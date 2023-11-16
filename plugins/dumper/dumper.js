/* eslint-disable no-case-declarations */

import {
	download,
	parallel,
	findBiggestSize,
	renderTemplate,
	photoSizes2Html,
	writeFile,
	createHTML,
	mkdir,
	sleep,
	writeJSON,
	getAge
} from './utils.js';
import { join } from 'node:path';
import { repeat, nxtRepeat } from './repeat.js';

import { kw, message as _message, secondaryMessage, error as _error } from './logger.js';

/**
 * @param {string} directory
 * @param {import("vk-io").PhotosPhoto[]} photos
 */
export function downloadPhotos(directory, photos) {
	return parallel(async (photo) => {
		const p = join(directory, `${photo.owner_id}_${photo.id}.jpg`);

		const { url } = findBiggestSize(photo.sizes);

		await download(url, p);
	}, photos);
}

/**
 *
 * @param {import('vk-io').VK} vk
 * @returns {Promise<import('vk-io/lib/api/schemas/objects').UsersUserFull>}
 */
export async function getMe(vk) {
	const [me] = await vk.api.users.get({
		fields: [
			'about',
			'activities',
			'bdate',
			'books',
			'career',
			'city',
			'common_count',
			'connections',
			'contacts',
			'counters',
			'country',
			'crop_photo',
			'descriptions',
			'domain',
			'education',
			'exports',
			'followers_count',
			'games',
			'has_mobile',
			'has_photo',
			'home_town',
			'interests',
			'lists',
			'maiden_name',
			'military',
			'movies',
			'nickname',
			'occupation',
			'lists',
			'personal',
			'photo_max_orig',
			'photo_100',
			'quotes',
			'relatives',
			'schools',
			'screen_name',
			'sex',
			'site',
			'status',
			'timezone',
			'tv',
			'universities',
			'verified',
			'wall_comments'
		]
	});

	return me;
}

/**
 *
 * @param {import('vk-io').VK} vk
 * @returns {Promise<import('vk-io').FriendsGetResponse>}
 */
export async function getFriends(vk) {
	return await vk.api.friends.get({
		count: 5000,
		fields: [
			'nickname',
			'domain',
			'sex',
			'bdate',
			'city',
			'country',
			'timezone',
			'photo_200_orig',
			'contacts',
			'education',
			'relation',
			'last_seen',
			'status',
			'can_post',
			'universities'
		]
	});
}

/**
 *
 * @param {import('vk-io').VK} vk
 * @param {import('vk-io/lib/api/schemas/objects').PhotosPhotoAlbumFull} album
 * @param {string} path
 *
 * @returns {Promise<void>}
 */
export async function dumpAlbum(vk, album, path) {
	const { items: photos } = await vk.api.photos.get({
		album_id: album.id,
		count: 1000
	});

	/**
	 * @type {string[]}
	 */
	const photosHtml = [];

	for (const photo of photos) {
		const html = await renderTemplate('photos_photo', {
			...findBiggestSize(photo.sizes),
			srcset: photoSizes2Html(photo.sizes),
			text: photo.text
		});

		photosHtml.push(html);
	}

	const html = await renderTemplate('album_template', {
		...album,
		photos: photosHtml
	});

	if (path.endsWith('/')) path = path.slice(0, Math.max(0, path.length - 1));

	await writeFile(`${path}.html`, createHTML(`Photos in ${album.title}`, html));
}

export { work as dump };

/**
 *
 * @param {VK} vk
 */
async function work(vk) {
	const me = await getMe(vk);

	kw('Выгружается профиль', `${me.first_name} ${me.last_name}`);

	const userAge = getAge(me.bdate);
	const mention = `${me.first_name} ${me.last_name} @${me.screen_name || 'id' + me.id}`;

	const dumpsDirectory = join(
		process.cwd(),
		'dumps',
		userAge ? `${mention} (${userAge} лет)` : userAge
	);

	await mkdir(dumpsDirectory);

	await writeJSON(join(dumpsDirectory, 'user.json'), me);
	kw('Dumping Section', 'Friends');

	const friends = await getFriends(vk);
	_message(`${me.first_name} ${me.last_name} has ${friends.count} friends`);

	await writeJSON(join(dumpsDirectory, 'friends.json'), friends);
	await sleep(3000);

	kw('Выгружаются', 'Фотографии');
	await mkdir(join(dumpsDirectory, 'albums'));

	const { items: albums } = await vk.api.photos.getAlbums({
		need_system: true
	});

	for (const album of albums) {
		const albumTitle = album.title.replace(/(\\|\/)/g, '|');

		const albumPath = join(dumpsDirectory, 'albums', albumTitle);
		// await mkdir(albumPath);

		await writeJSON(`${albumPath}.json`, album);

		secondaryMessage(albumTitle, '+');
		try {
			await dumpAlbum(vk, album, albumPath);
		} catch {
			_error(`Unable to dump album: ${album.title}`);
		}
	}

	kw('Выгружаются', 'Сообщения');

	await mkdir(join(dumpsDirectory, 'dialogs'));

	const cnv = repeat(
		(parameters) =>
			vk.api.messages.getConversations({
				...parameters,
				filter: 'all',
				extended: true
			}),
		{ batchSize: 200 }
	);

	for await (const [dialogs, { offset }, { profiles, groups }] of cnv) {
		await writeJSON(join(dumpsDirectory, 'dialogs', `groups${offset}.json`), groups);

		await writeJSON(join(dumpsDirectory, 'dialogs', `profiles${offset}.json`), profiles);

		await dumpDialogs({ dumpsDirectory, vk, me, dialogs, groups, profiles });
	}

	return { Allah: true };
}
async function dumpDialogs({ dumpsDirectory, vk, me, dialogs, groups, profiles }) {
	for (const { conversation } of dialogs) {
		try {
			await dumpDialog({
				conversation,
				dumpsDirectory,
				vk,
				me,
				groups,
				profiles
			});

			//#endregion
		} catch (error) {
			_error('Не удаётся скачать чат:', error);
		}
	}
}

async function dumpDialog({ conversation, dumpsDirectory, vk, me, groups, profiles }) {
	const { peer } = conversation;
	let dialogTitle = 'untitled';

	switch (peer.type) {
		case 'chat':
			dialogTitle = conversation.chat_settings.title;
			break;
		case 'group':
			dialogTitle = groups ? groups.find((group) => group.id === peer.local_id).name : 'Untitled';
			break;
		case 'user':
			if (!profiles) {
				dialogTitle = 'Неизвестно';
				break;
			}

			// eslint-disable-next-line no-case-declarations
			const companion = profiles.find((profile) => profile.id === peer.local_id);

			const age = getAge(companion.bdate);

			const name = `${companion.first_name} ${companion.last_name}`.slice(0, 56);

			dialogTitle = age ? `${name} (${age} лет)` : name;
			break;
	}

	kw('Чат', dialogTitle);

	// Чтобы не ломалась структура папок
	dialogTitle = dialogTitle.replace(/(\/|\\)/g, '|').slice(0, 62);
	kw('Папка чата', dialogTitle);

	const dialogDirectory = join(
		dumpsDirectory,
		'dialogs',
		`${dialogTitle} ${peer.type}${peer.local_id}`
	);

	await mkdir(dialogDirectory);

	await dumpPhotos(vk, peer, dialogTitle, dialogDirectory);

	//#region Videos
	await dumpVideos(vk, peer, dialogDirectory, dialogTitle);
	//#endregion
	//#region Messages
	await dumpMessages({
		vk,
		peer,
		dialogDirectory,
		me,
		dialogTitle,
		groups,
		profiles
	});
}
async function dumpMessages({ vk, peer, dialogDirectory, me, dialogTitle, groups, profiles }) {
	secondaryMessage('Сообщения', '+');
	const handle = repeat(
		(parameters) =>
			vk.api.messages.getHistory({
				...parameters,
				peer_id: peer.id
			}),
		{ batchSize: 200 }
	);

	for await (const [messages, { offset, stop }] of handle) {
		secondaryMessage(`Сообщения (${offset})`, '+');
		await writeJSON(join(dialogDirectory, `messages${offset}.json`), messages);

		let messagesHTML = '';

		for (const message of messages) {
			messagesHTML = await dumpSingleMessage({
				message,
				me,
				peer,
				dialogTitle,
				dialogDirectory,
				messages,
				messagesHTML,
				groups,
				profiles
			});
		}

		await writeFile(
			join(dialogDirectory, `Сообщения ${dialogTitle} (${offset}).html`),
			createHTML(
				`Сообщения - ${dialogTitle}`,
				await renderTemplate('messages_template', {
					peer,
					html: messagesHTML,
					dialogTitle
				})
			)
		);

		if (peer.type === 'chat' && offset > 10000) {
			stop();
		}
	}
}

async function dumpSingleMessage({
	message,
	me,
	peer,
	dialogTitle,
	dialogDirectory,
	messages,
	messagesHTML,
	groups,
	profiles
}) {
	const person = (() => {
		if (message.from_id === me.id) {
			return {
				name: `${me.first_name} ${me.last_name}`,
				ava: me.photo_100
			};
		}

		const person = profiles && profiles.find((p) => p.id === message.from_id);

		if (person) {
			return {
				name: `${person.first_name} ${person.last_name}`,
				ava: person.photo_100
			};
		}

		const group = groups && groups.find((g) => g.id === -message.from_id);

		if (group) {
			return { name: group.name, ava: group.photo_100 };
		}

		if (peer.type !== 'chat') {
			return {
				name: dialogTitle,
				ava: 'https://vk.com/images/deactivated_100.png'
			};
		}

		return {
			name: String(message.from_id),
			ava: 'https://vk.com/images/deactivated_100.png'
		};
	})();

	const date = new Date(message.date * 1000);
	await writeJSON(join(dialogDirectory, 'messages.json'), messages);

	const attachments = message.attachments || [];
	let attachmentsHtml = '';

	if (attachments.length > 0) {
		for (const attachment of attachments) {
			switch (attachment.type) {
				case 'photo':
					const { photo } = attachment;

					attachmentsHtml += await renderTemplate('photo_attachment', {
						...findBiggestSize(photo.sizes),
						peer,
						text: photo.text,
						photoLinkZ: `photo${photo.owner_id}_${photo.id}%2Fmail${message.id}`
					});
					break;

				case 'sticker':
					const { sticker } = attachment;

					attachmentsHtml += await renderTemplate('sticker_attachment', {
						...findBiggestSize(sticker.images),
						peer,
						message
					});
					break;

				case 'wall':
					const { wall } = attachment;

					attachmentsHtml += `<a href="https://vk.com/wall${wall.owner_id || wall.from_id}_${
						wall.id
					}_${wall.access_key}" target="_blank">
                  Wall post
                </a>`;
					break;

				case 'audio_message':
					attachmentsHtml += await renderTemplate('audio_message_attachment', {
						...attachment.audio_message,
						transcript_done: attachment.audio_message.transcript_state === 'done'
					});
					break;

				case 'video':
					const { video } = attachment;

					attachmentsHtml += await renderTemplate('video_attachment', {
						...findBiggestSize(video.image),
						video,
						videoLinkZ: `video${video.owner_id}_${video.id}%2Fmail${message.id}`,
						peer
					});
					break;

				case 'link':
					attachmentsHtml += await renderTemplate('link_attachment', {
						...attachment.link
					});

					break;

				default:
					attachmentsHtml += `<pre>${JSON.stringify(attachment, undefined, 2)}</pre>`;
					break;
			}
		}
	}

	messagesHTML += await renderTemplate('message', {
		person,
		message,
		attachments: attachmentsHtml,
		date: date.toISOString().replace('T', ' ').replace('Z', '').replace('.000', '')
	});
	return messagesHTML;
}

async function dumpVideos(vk, peer, dialogDirectory, dialogTitle) {
	secondaryMessage('Видео', '+');

	const handle = nxtRepeat(
		(parameters) =>
			vk.api.messages.getHistoryAttachments({
				...parameters,
				peer_id: peer.id,
				media_type: 'video',
				max_forwards_level: 45
			}),
		{ batchSize: 200 }
	);

	for await (const [videosHistoryAttachments, { startFrom }] of handle) {
		const offset = startFrom.replace('/', '_');

		secondaryMessage(`Видео (${offset})`, '+');

		const videoIds = videosHistoryAttachments.map((video) =>
			[
				video.attachment.video.owner_id,
				video.attachment.video.id,
				video.attachment.video.access_key
			].join('_')
		);
		const { items: videos } = await vk.api.video.get({ videos: videoIds });

		const videosHtml = [];

		for (const video of videos) {
			const html = await renderTemplate('videos_video', {
				...findBiggestSize(video.image),
				video
			});

			videosHtml.push(html);
		}

		await writeFile(
			join(dialogDirectory, `Видео в ${dialogTitle} (${offset}).html`),
			createHTML(
				`Видео - ${dialogTitle}`,
				await renderTemplate('videos_template', {
					dialogTitle,
					peer,
					html: videosHtml.join('\n')
				})
			)
		);
	}
}

async function dumpPhotos(vk, peer, dialogTitle, dialogDirectory) {
	secondaryMessage('Photos', '+');

	const handle = nxtRepeat(
		(parameters) =>
			vk.api.messages.getHistoryAttachments({
				...parameters,
				peer_id: peer.id,
				media_type: 'photo',
				max_forwards_level: 45
			}),
		{ batchSize: 200 }
	);

	for await (const [photos, { startFrom }] of handle) {
		const offset = startFrom.replace('/', '_');
		secondaryMessage(`Photos (Offset: ${offset})`, '+');
		const photosHtml = await Promise.all(
			photos.map((x) => {
				const photo = x.attachment.photo;

				return renderTemplate('photos_photo', {
					...findBiggestSize(photo.sizes),
					srcset: photoSizes2Html(photo.sizes),
					text: photo.text
				});
			})
		).then((photos) => renderTemplate('photos_template', { photos, dialogTitle, peer }));

		await writeFile(
			join(dialogDirectory, `Photos ${dialogTitle} (${offset}).html`),
			createHTML(`Photos in ${dialogTitle}`, photosHtml)
		);
	}
}
