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

const GET = async () => {
  return new Response(null, {
    status: 307,
    statusText: "Temporary Redirect",
    headers: { Location: config.exit }
  });
};

export { GET };
//# sourceMappingURL=_server.ts-03db21b0.js.map
