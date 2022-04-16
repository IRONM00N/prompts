import EventEmitter from "events";
import color from "kleur";
import readline from "readline";
import { beep, cursor } from "sisteransi";
import { action } from "../util";

/**
 * Base prompt skeleton
 */
export abstract class Prompt extends EventEmitter {
	firstRender: boolean;
	in: NodeJS.ReadStream;
	out: NodeJS.WriteStream;
	onRender: any;
	close: () => void;
	aborted: any;
	exited: any;
	closed: boolean;

	constructor(opts: PromptOptions = {}) {
		super();

		this.firstRender = true;
		this.in = opts.stdin || process.stdin;
		this.out = opts.stdout || process.stdout;
		this.onRender = (opts.onRender || (() => void 0)).bind(this);
		const rl = readline.createInterface({
			input: this.in,
			escapeCodeTimeout: 50,
		});
		readline.emitKeypressEvents(this.in, rl);

		if (this.in.isTTY) this.in.setRawMode(true);
		const isSelect =
			["SelectPrompt", "MultiselectPrompt"].indexOf(this.constructor.name) > -1;
		const keypress = (str, key) => {
			let a = action(key, isSelect);
			if (a === false) {
				this._ && this._(str, key);
			} else if (typeof this[a] === "function") {
				this[a](key);
			} else {
				this.bell();
			}
		};

		this.close = () => {
			this.out.write(cursor.show);
			this.in.removeListener("keypress", keypress);
			if (this.in.isTTY) this.in.setRawMode(false);
			rl.close();
			this.emit(
				this.aborted ? "abort" : this.exited ? "exit" : "submit",
				this.value
			);
			this.closed = true;
		};

		this.in.on("keypress", keypress);
	}

	abstract _(...args: any[]): any;

	fire() {
		this.emit("state", {
			value: this.value,
			aborted: !!this.aborted,
			exited: !!this.exited,
		});
	}

	bell() {
		this.out.write(beep);
	}

	render() {
		this.onRender(color);
		if (this.firstRender) this.firstRender = false;
	}
}

export interface Prompt extends EventEmitter {
	get value(): any;
	on(
		eventName: "state",
		listener: (state: { value: any; aborted: boolean; exited: boolean }) => void
	): this;
	on(eventName: string | symbol, listener: (...args: any[]) => void): this;
	once(eventName: string | symbol, listener: (...args: any[]) => void): this;
}

export interface PromptOptions {
	onRender?: () => any;

	/**
	 * The Readable stream to listen to
	 */
	stdin?: NodeJS.ReadStream;

	/**
	 * The Writable stream to write readline data to
	 */
	stdout?: NodeJS.WriteStream;
}
