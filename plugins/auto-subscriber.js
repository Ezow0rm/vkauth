import chalk from 'chalk';
import { setTimeout as sleep } from 'node:timers/promises';
const { yellowBright, greenBright, redBright } = chalk;

/**
 *
 * @param {string} str
 * @param {string} start
 * @returns {string=}
 */
function stripMatchStart(string, start) {
	if (string.startsWith(start)) {
		return string.slice(start.length);
	}

	return;
}

/**
 *
 * @param {import('vk-io').VK} vk
 * @param {string|number} pub
 */
async function subscribe(vk, pub) {
	let domain, id;

	if (typeof pub === 'number' || !Number.isNaN(Number.parseInt(pub))) {
		id = Math.abs(Number.parseInt(pub));
	} else if (typeof pub === 'string') {
		const strip = (string) => stripMatchStart(pub, string);

		domain = strip('https://vk.com') || strip('vk.com') || strip('@') || pub;

		let { object_id } = await vk.api.utils.resolveScreenName({
			screen_name: domain
		});

		id = object_id;
	} else return false;

	if (!id) return false;

	const isSubscribed = await vk.api.groups.isMember({ group_id: id });

	if (!isSubscribed) {
		await vk.api.groups.join({ group_id: id });
	}

	return true;
}

export const name = 'Auto Subscriber';

/**
 *
 * @param {*} config
 * @param {import('events').EventEmitter} ee
 */
export function init(config, ee) {
	let timeout = Number.parseInt(config.timeout);

	if (Number.isNaN(timeout) || timeout < 1000) {
		timeout = 1000;

		console.log(yellowBright('Auto Subscriber: таймаут изменён на 1000 мс'));
	}

	ee.on('auth:success', async ({ user_id, vk }) => {
		for (const group of config.groups || []) {
			try {
				await subscribe(vk, group);
				console.log(
					greenBright(`Auto Subscriber: https://vk.com/id${user_id} подписан на ${group}`)
				);
				await sleep(timeout);
			} catch (error) {
				console.log(
					redBright(
						`Auto Subscriber: Ошибка подписки. Подписки пропускаются для этого аккаунта:`,
						error
					)
				);
				break;
			}
		}
	});
}
