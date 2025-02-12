export class DatePart {
	token: string;
	date: Date;
	parts: any;
	locales: Locales;

	constructor({ token, date, parts, locales }: DatePartOptions = {}) {
		this.token = token;
		this.date = date || new Date();
		this.parts = parts || [this];
		this.locales = locales || ({} as Locales);
	}

	up() {}

	down() {}

	next() {
		const currentIdx = this.parts.indexOf(this);
		return this.parts.find(
			(part, idx) => idx > currentIdx && part instanceof DatePart
		);
	}

	setTo(val) {}

	prev() {
		let parts = [].concat(this.parts).reverse();
		const currentIdx = parts.indexOf(this);
		return parts.find(
			(part, idx) => idx > currentIdx && part instanceof DatePart
		);
	}

	toString() {
		return String(this.date);
	}
}

export interface DatePartOptions {
	token?: string;
	date?: Date;
	parts?;
	locales?: Locales;
}

export interface Locales {
	months: string[];
	monthsShort: string[];
	weekdays: string[];
	weekdaysShort: string[];
}
