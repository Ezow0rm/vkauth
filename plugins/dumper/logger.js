import chalk from 'chalk';
const { blueBright, magentaBright, yellowBright, redBright, greenBright } = chalk;
const _ = console.log;

const kw = (key, value) => _(blueBright(`${key}:`), magentaBright(value));

const factory =
	(color, out = _) =>
	(...x) =>
		out(...x.map((y) => color(y)));

const message = factory(magentaBright);

const secondaryMessage = (message, sign = '') => _(magentaBright(sign), blueBright(message));

const warning = factory(yellowBright, console.warn);
const error = factory(redBright, console.error);
const success = factory(greenBright);

export { kw, message, error, success, warning, secondaryMessage };
