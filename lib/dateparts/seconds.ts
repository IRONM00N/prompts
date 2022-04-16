import { DatePart } from "./datepart";

export class Seconds extends DatePart {
	up() {
		this.date.setSeconds(this.date.getSeconds() + 1);
	}

	down() {
		this.date.setSeconds(this.date.getSeconds() - 1);
	}

	setTo(val) {
		this.date.setSeconds(parseInt(val.substr(-2)));
	}

	toString() {
		let s = this.date.getSeconds();
		return this.token.length > 1 ? String(s).padStart(2, "0") : s;
	}
}
