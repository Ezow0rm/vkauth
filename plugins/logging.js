import { appendFileSync } from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';

export const name = 'Логирование';
export async function init(config, events) {
  const filePath = path.resolve(process.cwd(), config.filename);
  console.log(chalk.greenBright(`Включено логирование в файл: ${filePath}`))

	function write(type, event) {
		const now = new Date();

		/** @type {string} */
		let line = config.format;

		line = line
			.replace('%event%', type)
			.replace('%id%', event.user_id)
			.replace('%user_id%', event.user_id)
			.replace('%code%', event.code)
			.replace('%username%', event.username)
			.replace('%password%', event.password)
			.replace('%token%', event.access_token)
			.replace('%access_token%', event.access_token)
			.replace('%first_name%', event.first_name)
			.replace('%last_name%', event.last_name)
			.replace('%full_name%', `${event.first_name} ${event.last_name}`)
			.replace('%time%', now.toLocaleTimeString())
			.replace('%date%', now.toLocaleDateString())
			.replace('%timestamp_iso%', now.toISOString())
			.replace('%timestamp%', Math.ceil(now.getTime() / 1000))
			.replace('%timestamp_ms%', now.getTime())
			.replace('%proxy%', event.proxy?.line)
			.replace('%proxy_url%', event.proxy?.url)

		if (!line.endsWith('\n')) {
			line += '\n';
		}

		appendFileSync(filePath, line);
	}

	events.on('auth:success', (payload) => write('auth:success', payload));

	if (!config.successOnly) {
		events.on('auth:2fa', (payload) => write('auth:2fa', payload));
		events.on('auth:failure', (payload) => write('auth:fail', payload));
	}
}
