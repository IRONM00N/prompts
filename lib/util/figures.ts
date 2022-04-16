const main = {
	arrowUp: "↑",
	arrowDown: "↓",
	arrowLeft: "←",
	arrowRight: "→",
	radioOn: "◉",
	radioOff: "◯",
	tick: "✔",
	cross: "✖",
	ellipsis: "…",
	pointerSmall: "›",
	line: "─",
	pointer: "❯",
};
const win = {
	arrowUp: main.arrowUp,
	arrowDown: main.arrowDown,
	arrowLeft: main.arrowLeft,
	arrowRight: main.arrowRight,
	radioOn: "(*)",
	radioOff: "( )",
	tick: "√",
	cross: "×",
	ellipsis: "...",
	pointerSmall: "»",
	line: "─",
	pointer: ">",
};
export const figures = process.platform === "win32" ? win : main;
