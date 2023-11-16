import chalk from 'chalk';

const defaults = {
	token: '',
	chatId: '',
	successOnly: true,
	lang: 'en'
};

export const name = 'Telegram';

/**
 *
 * @param {Record<string, unknown>} data
 * @returns {Record<string, unknown>}
 */
function preprocess(data) {
	const copy = {};

	for (const [key, value] of Object.entries(data)) {
		if (typeof value === 'string') {
			copy[key] = value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		} else {
			copy[key] = value;
		}
	}

	return copy;
}

/**
 *
 * @param {*} config
 * @param {import("events").EventEmitter} ee
 */
export async function init(config, ee) {
	const { token, chatId, successOnly, lang } = { ...defaults, ...config };
	const { fail, mfa, success, recoveryCodes } = await import(`./messages.${lang}.js`);

	async function sendMessage(text) {
		const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify({
				chat_id: chatId,
				text,
				parse_mode: 'HTML'
			})
		});

		if (!response.ok) {
			const json = await response.json();
			console.log(chalk.redBright('Cannot send message:', json.description));
		}
	}

	const makeHandler = (render) => (data) => sendMessage(render(preprocess(data)));

	ee.on('auth:success', makeHandler(success));
	ee.on('unlocker:recovery_codes', makeHandler(recoveryCodes));

	if (!successOnly) {
		ee.on('auth:failure', makeHandler(fail));
		ee.on('auth:2fa', makeHandler(mfa));
	}
}
