import { DatePart } from "./datepart";

export class Minutes extends DatePart {
	up() {
		this.date.setMinutes(this.date.getMinutes() + 1);
	}

	down() {
		this.date.setMinutes(this.date.getMinutes() - 1);
	}

	setTo(val) {
		this.date.setMinutes(parseInt(val.substr(-2)));
	}

	toString() {
		let m = this.date.getMinutes();
		return this.token.length > 1 ? String(m).padStart(2, "0") : String(m);
	}
}
