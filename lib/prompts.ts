import * as elements from "./elements";
import { SuggestFunction } from "./elements";

const noop = (v: any): any => v;

function toPrompt(
	type: keyof typeof elements,
	args: TextOptions | NumberOptions | AutocompleteOptions,
	opts: ToPromptOptions = {}
) {
	return new Promise((res, rej) => {
		const p = new elements[type](args);
		const onAbort = opts.onAbort || noop;
		const onSubmit = opts.onSubmit || noop;
		const onExit = opts.onExit || noop;
		p.on("state", args.onState || noop);
		p.on("submit", (x) => res(onSubmit(x)));
		p.on("exit", (x) => res(onExit(x)));
		p.on("abort", (x) => rej(onAbort(x)));
	});
}

interface ToPromptOptions {
	onAbort?: (items: any) => any;
	onSubmit?: (items: any) => any;
	onExit?: (items: any) => any;
}

interface BaseFunctionOptions {
	onState?: (state: any) => any;
}

/**
 * Text prompt
 * @param args The arguments for the prompt
 * @returns Promise with user input
 */
export const text = (args: TextOptions): Promise<string> =>
	toPrompt("TextPrompt", args) as Promise<string>;

export type TextOptions = BaseFunctionOptions & elements.TextPromptOptions;

/**
 * Password prompt with masked input
 * @param args The arguments for the prompt
 * @returns Promise with user input
 */
export const password = (args: Omit<TextOptions, "style">): Promise<string> => {
	(args as TextOptions).style = "password";
	return text(args);
};

/**
 * Prompt where input is invisible, like sudo
 * @param args The arguments for the prompt
 * @returns Promise with user input
 */
export const invisible = (
	args: Omit<TextOptions, "style">
): Promise<string> => {
	(args as TextOptions).style = "invisible";
	return text(args);
};

/**
 * Number prompt
 * @param args The arguments for the prompt
 * @returns Promise with user input
 */
export const number = (args: NumberOptions): Promise<number> =>
	toPrompt("NumberPrompt", args) as Promise<number>;

export type NumberOptions = BaseFunctionOptions &
	elements.NumberValidateFunction;

/**
 * Date prompt
 * @param args The arguments for the prompt
 * @param {string} args.message Prompt message to display
 * @param {number} args.initial Default number value
 * @param {function} [args.onState] On state change callback
 * @param {number} [args.max] Max value
 * @param {number} [args.min] Min value
 * @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
 * @param {Boolean} [opts.float=false] Parse input as floats
 * @param {Number} [opts.round=2] Round floats to x decimals
 * @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
 * @param {function} [args.validate] Function to validate user input
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */
export const date = (args) => toPrompt("DatePrompt", args);

/**
 * Classic yes/no prompt
 * @param args The arguments for the prompt
 * @param {string} args.message Prompt message to display
 * @param {boolean} [args.initial=false] Default value
 * @param {function} [args.onState] On state change callback
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */
export const confirm = (args) => toPrompt("ConfirmPrompt", args);

/**
 * List prompt, split intput string by `seperator`
 * @param args The arguments for the prompt
 * @param {string} args.message Prompt message to display
 * @param {string} [args.initial] Default string value
 * @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
 * @param {string} [args.separator] String separator
 * @param {function} [args.onState] On state change callback
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input, in form of an `Array`
 */
export const list = (args) => {
	const sep = args.separator || ",";
	return toPrompt("TextPrompt", args, {
		onSubmit: (str: string) => str.split(sep).map((s) => s.trim()),
	});
};

/**
 * Toggle/switch prompt
 * @param args The arguments for the prompt
 * @param {string} args.message Prompt message to display
 * @param {boolean} [args.initial=false] Default value
 * @param {string} [args.active="on"] Text for `active` state
 * @param {string} [args.inactive="off"] Text for `inactive` state
 * @param {function} [args.onState] On state change callback
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */
export const toggle = (args) => toPrompt("TogglePrompt", args);

/**
 * Interactive select prompt
 * @param args The arguments for the prompt
 * @param {string} args.message Prompt message to display
 * @param {Array} args.choices Array of choices objects `[{ title, value }, ...]`
 * @param {number} [args.initial] Index of default value
 * @param {String} [args.hint] Hint to display
 * @param {function} [args.onState] On state change callback
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */
export const select = (args) => toPrompt("SelectPrompt", args);

/**
 * Interactive multi-select prompt
 * @param args The arguments for the prompt
 * @param {string} args.message Prompt message to display
 * @param {Array} args.choices Array of choices objects `[{ title, value, [selected] }, ...]`
 * @param {number} [args.max] Max select
 * @param {string} [args.hint] Hint to display user
 * @param {Number} [args.cursor=0] Cursor start position
 * @param {function} [args.onState] On state change callback
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */
export const multiselect = (args) => {
	args.choices = [].concat(args.choices || []);
	const toSelected = (items) =>
		items.filter((item) => item.selected).map((item) => item.value);
	return toPrompt("MultiselectPrompt", args, {
		onAbort: toSelected,
		onSubmit: toSelected,
	});
};

/**
 * Interactive autocompleteMultiselect prompt
 * @param args The arguments for the prompt
 * @param {string} args.message Prompt message to display
 * @param {Array} args.choices Array of choices objects `[{ title, value, [selected] }, ...]`
 * @param {number} [args.max] Max select
 * @param {string} [args.hint] Hint to display user
 * @param {Number} [args.cursor=0] Cursor start position
 * @param {function} [args.onState] On state change callback
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */
export const autocompleteMultiselect = (args) => {
	args.choices = [].concat(args.choices || []);
	const toSelected = (items) =>
		items.filter((item) => item.selected).map((item) => item.value);
	return toPrompt("AutocompleteMultiselectPrompt", args, {
		onAbort: toSelected,
		onSubmit: toSelected,
	});
};

const byTitle = (input, choices) =>
	Promise.resolve(
		choices.filter(
			(item) =>
				item.title.slice(0, input.length).toLowerCase() === input.toLowerCase()
		)
	);

/**
 * Interactive auto-complete prompt
 * @returns Promise with user input
 */
export const autocomplete = (args: AutocompleteOptions): Promise<any> => {
	args.suggest = args.suggest || byTitle;
	args.choices = [].concat(args.choices || []);
	return toPrompt("AutocompletePrompt", args);
};

export type AutocompleteOptions = elements.AutocompletePromptOptions &
	BaseFunctionOptions & {
		/**
		 * Function to filter results based on user input. Defaults to sort by `title`
		 */
		suggest?: SuggestFunction;
	};
