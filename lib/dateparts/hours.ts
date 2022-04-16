import { DatePart } from "./datepart";

export class Hours extends DatePart {
	up() {
		this.date.setHours(this.date.getHours() + 1);
	}

	down() {
		this.date.setHours(this.date.getHours() - 1);
	}

	setTo(val) {
		this.date.setHours(parseInt(val.substr(-2)));
	}

	toString() {
		let hours = this.date.getHours();
		if (/h/.test(this.token)) hours = hours % 12 || 12;
		return this.token.length > 1 ? String(hours).padStart(2, "0") : hours;
	}
}
