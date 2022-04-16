import { strip } from "./strip";

export const lines = (msg: string, perLine: number): number => {
	let lines = String(strip(msg) || "").split(/\r?\n/);

	if (!perLine) return lines.length;
	return lines
		.map((l) => Math.ceil(l.length / perLine))
		.reduce((a, b) => a + b);
};
