import { DatePart } from "./datepart";

export class Year extends DatePart {
	up() {
		this.date.setFullYear(this.date.getFullYear() + 1);
	}

	down() {
		this.date.setFullYear(this.date.getFullYear() - 1);
	}

	setTo(val) {
		this.date.setFullYear(val.substr(-4));
	}

	toString() {
		let year = String(this.date.getFullYear()).padStart(4, "0");
		return this.token.length === 2 ? year.slice(-2) : year;
	}
}
