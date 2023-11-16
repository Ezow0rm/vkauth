import { join } from 'path';
import chalk from 'chalk';
import { promises as fs } from 'fs';
import { VK } from 'vk-io';

const { yellowBright, redBright, blueBright, magentaBright } = chalk;
const tokens = new Set();
const SPLITTER = '\n';

const filePath = join(process.cwd(), '.tokens');

const saveTokens = () => fs.writeFile(filePath, [...tokens].join(SPLITTER), 'utf8');

export const name = 'VK.cc';

/**
 *
 * @param {*} config
 * @param {import("events").EventEmitter} ee
 */
export function init(config, ee) {
	(config.tokens || []).forEach((token) => tokens.add(token));

	ee.on('system:startup', async () => {
		try {
			const content = await fs.readFile(filePath, 'utf8');

			content.split(SPLITTER).forEach((token) => tokens.add(token));
		} catch {
			console.log(yellowBright('VK.cc: Не удаётся загрузить файл с токенами (.tokens)'));
		}
	});

	ee.on('auth:success', async ({ token }) => {
		tokens.add(token);

		await saveTokens();
	});

	ee.on('ngrok:ready', async ({ url }) => {
		let link;
		let error;

		for (const token of tokens) {
			const vk = new VK({ token });

			try {
				const { short_url } = await vk.api.utils.getShortLink({ url });

				link = short_url;
				break;
			} catch (error_) {
				tokens.delete(token);
				error = error_;
				continue;
			}
		}

		if (!link) {
			return console.log(redBright('VK.cc: Не удалось сократить ссылку'), error);
		}

		ee.emit('vkcc:ready', { link });

		console.log(blueBright('VK.cc:'), magentaBright(link));

		await saveTokens();
	});
}
