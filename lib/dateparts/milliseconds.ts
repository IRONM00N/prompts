import { DatePart } from "./datepart";

export class Milliseconds extends DatePart {
	up() {
		this.date.setMilliseconds(this.date.getMilliseconds() + 1);
	}

	down() {
		this.date.setMilliseconds(this.date.getMilliseconds() - 1);
	}

	setTo(val) {
		this.date.setMilliseconds(parseInt(val.substr(-this.token.length)));
	}

	toString() {
		return String(this.date.getMilliseconds())
			.padStart(4, "0")
			.slice(0, this.token.length);
	}
}
