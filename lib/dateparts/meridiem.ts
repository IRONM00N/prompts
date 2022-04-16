import { DatePart } from "./datepart";

export class Meridiem extends DatePart {
	up() {
		this.date.setHours((this.date.getHours() + 12) % 24);
	}

	down() {
		this.up();
	}

	toString() {
		let meridiem = this.date.getHours() > 12 ? "pm" : "am";
		return /\A/.test(this.token) ? meridiem.toUpperCase() : meridiem;
	}
}
