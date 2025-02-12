/**
 * @param {string} msg The message to wrap
 * @param {object} opts
 */
export const wrap = (msg: string, opts: WrapOptions = {}) => {
	const tab = Number.isSafeInteger(parseInt(opts.margin))
		? new Array(parseInt(opts.margin)).fill(" ").join("")
		: opts.margin || "";

	const width = opts.width;

	return (msg || "")
		.split(/\r?\n/g)
		.map((line) =>
			line
				.split(/\s+/g)
				.reduce(
					(arr, w) => {
						if (
							w.length + tab.length >= width ||
							arr[arr.length - 1].length + w.length + 1 < width
						)
							arr[arr.length - 1] += ` ${w}`;
						else arr.push(`${tab}${w}`);
						return arr;
					},
					[tab]
				)
				.join("\n")
		)
		.join("\n");
};

export interface WrapOptions {
	/**
	 * Left margin
	 */
	margin?: number | string;

	/**
	 * Maximum characters per line including the margin
	 */
	width: number;
}
