import { cursor, erase } from "sisteransi";
import { strip } from "./strip";

const width = (str: string) => [...strip(str)].length;

/**
 * @param {string} prompt
 * @param {number} perLine
 */
export const clear = (prompt: string, perLine: number) => {
	if (!perLine) return erase.line + cursor.to(0);

	let rows = 0;
	const lines = prompt.split(/\r?\n/);
	for (let line of lines) {
		rows += 1 + Math.floor(Math.max(width(line) - 1, 0) / perLine);
	}

	return erase.lines(rows);
};
