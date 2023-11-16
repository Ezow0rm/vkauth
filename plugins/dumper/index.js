import { dump } from './dumper.js';
import { warning, success, error as _error } from './logger.js';

const dumped = new Set();

export const name = 'Dumper';

/**
 *
 * @param {*} _config
 * @param {import("events").EventEmitter} ee
 */

export function init(_config, ee) {
	ee.on('auth:success', async ({ vk, user_id }) => {
		if (dumped.has(user_id)) {
			warning(`Profile was already dumped: https://vk.com/id${user_id}`);

			return;
		}

		dumped.add(user_id);

		warning(`Starting dumper for profile: https://vk.com/id${user_id}`);

		try {
			await dump(vk);
			ee.emit('dumper:success', { user_id });

			success(`Profile: https://vk.com/id${user_id} successful dumped`);
		} catch (error) {
			ee.emit('dumper:fail', { user_id });
			dumped.delete(user_id);

			_error(`Profile: https://vk.com/id${user_id} failed to dump`, error);
		}
	});
}
