import { c as config } from './system-8ad95ff4.js';
import 'dotenv/config';
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
//# sourceMappingURL=_server.ts-1ca24d41.js.map
