import { DatePart } from "./datepart";

const pos = (n) => {
	n = n % 10;
	return n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th";
};

export class Day extends DatePart {
	up() {
		this.date.setDate(this.date.getDate() + 1);
	}

	down() {
		this.date.setDate(this.date.getDate() - 1);
	}

	setTo(val) {
		this.date.setDate(parseInt(val.substr(-2)));
	}

	toString() {
		let date = this.date.getDate();
		let day = this.date.getDay();
		return this.token === "DD"
			? String(date).padStart(2, "0")
			: this.token === "Do"
			? String(date + pos(date))
			: this.token === "d"
			? String(day + 1)
			: this.token === "ddd"
			? String(this.locales.weekdaysShort[day])
			: this.token === "dddd"
			? this.locales.weekdays[day]
			: String(date);
	}
}
