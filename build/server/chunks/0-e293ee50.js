import { c as config } from './system-54e17ac7.js';
import 'node:path';
import 'yaml';
import 'node:fs/promises';
import 'node:events';
import 'chalk';
import 'arg';
import 'v8';
import 'node:module';
import 'node:url';

const load = () => {
  return {
    image: config.image,
    title: config.title
  };
};

var _layout_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 0;
let component_cache;
const component = async () => component_cache ??= (await import('./layout.svelte-9efb56b8.js')).default;
const server_id = "src/routes/+layout.server.ts";
const imports = ["_app/immutable/nodes/0.8cd8f1ab.js","_app/immutable/chunks/scheduler.63274e7e.js","_app/immutable/chunks/index.95432262.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=0-e293ee50.js.map
