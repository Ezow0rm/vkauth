/* eslint-disable no-irregular-whitespace */
import chalk from 'chalk';
const { magenta, yellowBright, greenBright } = chalk;

export const name = 'Banner';

const banner = magenta`
██╗░░░██╗██╗░░██╗  ██████╗░██╗░░██╗██╗░██████╗██╗░░██╗██╗███╗░░██╗░██████╗░
██║░░░██║██║░██╔╝  ██╔══██╗██║░░██║██║██╔════╝██║░░██║██║████╗░██║██╔════╝░
╚██╗░██╔╝█████═╝░  ██████╔╝███████║██║╚█████╗░███████║██║██╔██╗██║██║░░██╗░
░╚████╔╝░██╔═██╗░  ██╔═══╝░██╔══██║██║░╚═══██╗██╔══██║██║██║╚████║██║░░╚██╗
░░╚██╔╝░░██║░╚██╗  ██║░░░░░██║░░██║██║██████╔╝██║░░██║██║██║░╚███║╚██████╔╝
░░░╚═╝░░░╚═╝░░╚═╝  ╚═╝░░░░░╚═╝░░╚═╝╚═╝╚═════╝░╚═╝░░╚═╝╚═╝╚═╝░░╚══╝░╚═════╝░
`;

export function init(_config, ee) {
	const vkf = magenta.bold`VK Phishing`;
	const xxh = yellowBright.bold.underline`XHT`;
	ee.on('system:startup', () =>
		console.log(`
${banner}

  ${vkf} от ${xxh}

${greenBright`Поддержку скрипта осуществляет https://t.me/dme_sup`}
`)
	);
}
