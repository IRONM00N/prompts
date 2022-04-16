import c from "kleur";
import { figures } from "./figures";

// rendering user input.
export const styles = Object.freeze({
	password: { scale: 1, render: (input: string) => "*".repeat(input.length) },
	emoji: { scale: 2, render: (input: string) => "😃".repeat(input.length) },
	invisible: { scale: 0, render: (input: string) => "" },
	default: { scale: 1, render: (input: string) => `${input}` },
});

export const render = (type: keyof typeof styles) =>
	styles[type] || styles.default;

// icon to signalize a prompt.
export const symbols = Object.freeze({
	aborted: c.red(figures.cross),
	done: c.green(figures.tick),
	exited: c.yellow(figures.cross),
	default: c.cyan("?"),
});

export const symbol = (done: boolean, aborted: boolean, exited?: boolean) =>
	aborted
		? symbols.aborted
		: exited
		? symbols.exited
		: done
		? symbols.done
		: symbols.default;

// between the question and the user's input.
export const delimiter = (completing: boolean): string =>
	c.gray(completing ? figures.ellipsis : figures.pointerSmall);

export const item = (expandable: boolean, expanded: boolean): string =>
	c.gray(expandable ? (expanded ? figures.pointerSmall : "+") : figures.line);
