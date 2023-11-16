import { i as init } from './proxy-b9c894e4.js';
import { E as EventsPipe } from './system-54e17ac7.js';
import 'ip-regex';
import 'node-fetch';
import 'node:path';
import 'https-proxy-agent';
import 'socks-proxy-agent';
import 'node:fs/promises';
import 'chalk';
import 'yaml';
import 'node:events';
import 'arg';
import 'v8';
import 'node:module';
import 'node:url';

{
  init();
  EventsPipe.emit("system:startup");
  EventsPipe.emit("server:startup", { port: parseInt(process.env.PORT || "3000") });
}
const handle = async ({ event, resolve }) => {
  return resolve(event);
};

export { handle };
//# sourceMappingURL=hooks.server-86db4e5d.js.map
