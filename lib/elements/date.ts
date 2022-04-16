import { bold, cyan, red } from "kleur";
import { cursor, erase } from "sisteransi";
import {
	DatePart,
	Day,
	Hours,
	Meridiem,
	Milliseconds,
	Minutes,
	Month,
	Seconds,
	Year
} from "../dateparts";
import { DatePartOptions, Locales } from "../dateparts/datepart";
import { clear, figures, style } from "../util";
import { Prompt } from "./prompt";

const regex =
	/\\(.)|"((?:\\["\\]|[^"])+)"|(D[Do]?|d{3,4}|d)|(M{1,4})|(YY(?:YY)?)|([aA])|([Hh]{1,2})|(m{1,2})|(s{1,2})|(S{1,4})|./g;
const regexGroups = {
	1: ({ token }: DatePartOptions) => token.replace(/\\(.)/g, "$1"),
	2: (opts: DatePartOptions) => new Day(opts), // Day // TODO
	3: (opts: DatePartOptions) => new Month(opts), // Month
	4: (opts: DatePartOptions) => new Year(opts), // Year
	5: (opts: DatePartOptions) => new Meridiem(opts), // AM/PM // TODO (special)
	6: (opts: DatePartOptions) => new Hours(opts), // Hours
	7: (opts: DatePartOptions) => new Minutes(opts), // Minutes
	8: (opts: DatePartOptions) => new Seconds(opts), // Seconds
	9: (opts: DatePartOptions) => new Milliseconds(opts), // Fractional seconds
};

const defaultLocales: Locales = {
	months: [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	],
	monthsShort: [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	],
	weekdays: [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	],
	weekdaysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};

/**
 * DatePrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {Number} [opts.initial] Index of default value
 * @param {String} [opts.mask] The format mask
 * @param {object} [opts.locales] The date locales
 * @param {String} [opts.error] The error message shown on invalid value
 * @param {Function} [opts.validate] Function to validate the submitted value
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 */
export class DatePrompt extends Prompt {
	constructor(opts = {}) {
		super(opts);
		this.msg = opts.message;
		this.cursor = 0;
		this.typed = "";
		this.locales = { ...defaultLocales, ...(opts.locales ?? {}) };
		this._date = opts.initial || new Date();
		this.errorMsg = opts.error || "Please Enter A Valid Value";
		this.validator = opts.validate || (() => true);
		this.mask = opts.mask || "YYYY-MM-DD HH:mm:ss";
		this.clear = clear("", this.out.columns);
		this.render();
	}

	get value() {
		return this.date;
	}

	get date() {
		return this._date;
	}

	set date(date) {
		if (date) this._date.setTime(date.getTime());
	}

	set mask(mask: string: string) {
		let result: any[];
		this.parts = [];
		while ((result = regex.exec(mask))) {
			let match = result.shift();
			let idx = result.findIndex((gr: any) => gr != null);
			this.parts.push(
				idx in regexGroups
					? regexGroups[idx]({
							token: result[idx] || match,
							date: this.date,
							parts: this.parts,
							locales: this.locales,
					  })
					: result[idx] || match
			);
		}

		let parts = this.parts.reduce((arr: any[], i: any) => {
			if (typeof i === "string" && typeof arr[arr.length - 1] === "string")
				arr[arr.length - 1] += i;
			else arr.push(i);
			return arr;
		}, []);

		this.parts.splice(0);
		this.parts.push(...parts);
		this.reset();
	}

	moveCursor(n: any) {
		this.typed = "";
		this.cursor = n;
		this.fire();
	}

	reset() {
		this.moveCursor(this.parts.findIndex((p: any) => p instanceof DatePart));
		this.fire();
		this.render();
	}

	exit() {
		this.abort();
	}

	abort() {
		this.done = this.aborted = true;
		this.error = false;
		this.fire();
		this.render();
		this.out.write("\n");
		this.close();
	}

	async validate() {
		let valid = await this.validator(this.value);
		if (typeof valid === "string") {
			this.errorMsg = valid;
			valid = false;
		}
		this.error = !valid;
	}

	async submit() {
		await this.validate();
		if (this.error) {
			this.color = "red";
			this.fire();
			this.render();
			return;
		}
		this.done = true;
		this.aborted = false;
		this.fire();
		this.render();
		this.out.write("\n");
		this.close();
	}

	up() {
		this.typed = "";
		this.parts[this.cursor].up();
		this.render();
	}

	down() {
		this.typed = "";
		this.parts[this.cursor].down();
		this.render();
	}

	left() {
		let prev = this.parts[this.cursor].prev();
		if (prev == null) return this.bell();
		this.moveCursor(this.parts.indexOf(prev));
		this.render();
	}

	right() {
		let next = this.parts[this.cursor].next();
		if (next == null) return this.bell();
		this.moveCursor(this.parts.indexOf(next));
		this.render();
	}

	next() {
		let next = this.parts[this.cursor].next();
		this.moveCursor(
			next
				? this.parts.indexOf(next)
				: this.parts.findIndex((part: any) => part instanceof DatePart)
		);
		this.render();
	}

	_(c: string) {
		if (/\d/.test(c)) {
			this.typed += c;
			this.parts[this.cursor].setTo(this.typed);
			this.render();
		}
	}

	render() {
		if (this.closed) return;
		if (this.firstRender) this.out.write(cursor.hide);
		else this.out.write(clear(this.outputText, this.out.columns));
		super.render();

		// Print prompt
		this.outputText = [
			style.symbol(this.done, this.aborted),
			bold(this.msg),
			style.delimiter(false),
			this.parts
				.reduce(
					(arr: string | any[], p: { toString: () => string | number; }, idx: any) =>
						arr.concat(
							idx === this.cursor && !this.done
								? cyan().underline(p.toString())
								: p
						),
					[]
				)
				.join(""),
		].join(" ");

		// Print error
		if (this.error) {
			this.outputText += this.errorMsg
				.split("\n")
				.reduce(
					(a: string, l: string | number, i: any) =>
						a + `\n${i ? ` ` : figures.pointerSmall} ${red().italic(l)}`,
					``
				);
		}

		this.out.write(erase.line + cursor.to(0) + this.outputText);
	}
}
