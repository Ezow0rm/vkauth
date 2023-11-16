import { connect } from 'ngrok';
import chalk from 'chalk';
const { bold, greenBright, redBright, magentaBright } = chalk;

export const name = 'NGrok';

/**
 *
 * @param {*} config
 * @param {import("events").EventEmitter} ee
 */
export function init(config, ee) {
	ee.on('server:startup', async ({ port }) => {
    console.log(bold("Подключение к ngrok"))

		const ngrokUrl = await connect({
			...config,
			addr: port,
			onStatusChange: (status) => {
				if (status === 'connected') {
					ee.emit('ngrok:connected');

					console.log(bold('ngrok:'), greenBright('ПОДКЛЮЧЕН'));
				} else {
					ee.emit('ngrok:closed');

					console.log(bold('ngrok:'), redBright('ОТКЛЮЧЕН'));
				}
			}
		});

		ee.emit('ngrok:ready', { url: ngrokUrl });

		console.log(bold(`ngrok URL:`), magentaBright(ngrokUrl));
	});
}
