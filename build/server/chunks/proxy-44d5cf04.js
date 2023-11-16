import ipRegex from 'ip-regex';
import fetch from 'node-fetch';
import path from 'node:path';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { readFile } from 'node:fs/promises';
import { c as config } from './system-8ad95ff4.js';
import chalk from 'chalk';

const regex = ipRegex();
const defaults = {
  checkUrl: "https://api.vk.com",
  checkTimeout: 3e3,
  filename: "proxy.txt",
  reloadInterval: 6e4
};
const proxyConfig = { ...defaults, ...config.proxy };
proxyConfig.checkTimeout = Math.max(parseInt(proxyConfig.checkTimeout), 500) || 500;
proxyConfig.reloadInterval = Math.max(parseInt(proxyConfig.reloadInterval), 1e4) || 1e4;
proxyConfig.filename ||= defaults.filename;
proxyConfig.checkUrl ||= defaults.checkUrl;
try {
  new URL(proxyConfig.checkUrl);
} catch {
  console.log(
    chalk.redBright(
      `Недопустимый URL проверки прокси: ${proxyConfig.checkUrl}. Для проверки будет использоваться: ${defaults.checkUrl}`
    )
  );
  proxyConfig.checkUrl = defaults.checkUrl;
}
const proxyFile = path.resolve(process.cwd(), proxyConfig.filename);
const cache = /* @__PURE__ */ new Map();
class Proxy {
  static normalize(line, defaultProto = "socks") {
    if (line.includes("://")) {
      const match = /^socks(4|5):\/\/(.*)/.exec(line);
      if (match)
        return `socks://${match[2]}`;
      return line;
    }
    if (line.includes("@")) {
      const [part1, part2] = line.split("@");
      if (regex.test(part2)) {
        return `${defaultProto}://${line}`;
      }
      return `${defaultProto}://${part2}@${part1}`;
    }
    const parts = line.split(":");
    if (isPort(parts[1])) {
      const [hostname, port, username, password] = parts;
      const url = new URL(`${defaultProto}://${hostname}:${port}`);
      if (username)
        url.username = username;
      if (password)
        url.password = password;
      return url.toString();
    }
    if (isPort(parts[3])) {
      const [username, password, hostname, port] = parts;
      const url = new URL(`${defaultProto}://${hostname}:${port}`);
      url.username = username;
      url.password = password;
      return url.toString();
    }
    throw new Error(`Invalid proxy format: ${line}`);
  }
  static getAgent(forUrl) {
    const url = new URL(forUrl);
    if (url.protocol.startsWith("socks")) {
      return new SocksProxyAgent(forUrl);
    }
    if (url.protocol.startsWith("http")) {
      return new HttpsProxyAgent(forUrl);
    }
    throw new Error(`Unsupported proxy protocol: "${url.protocol}"`);
  }
  static async check(agent, {
    timeout = proxyConfig.checkTimeout,
    url = proxyConfig.checkUrl,
    signal
  } = {}) {
    try {
      if (!signal) {
        const abortController = new AbortController();
        setTimeout(() => abortController.abort(), timeout);
        signal = abortController.signal;
      }
      await fetch(url, { agent, signal });
      return true;
    } catch {
      return false;
    }
  }
  _valid = false;
  _url;
  _agent;
  _line;
  get line() {
    return this._line;
  }
  get valid() {
    return this._valid;
  }
  get url() {
    return this._url;
  }
  get agent() {
    return this._agent;
  }
  constructor(line, url = Proxy.normalize(line)) {
    const agent = Proxy.getAgent(url);
    this._line = line;
    this._url = url;
    this._agent = agent;
  }
  async check(options = {}) {
    this._valid = await Proxy.check(this.agent, options);
    return this.valid;
  }
}
function isPort(part) {
  const value = parseInt(part);
  return value > 0 && value <= 65535 && value.toString() === part;
}
async function resolve(line) {
  const cached = cache.get(line);
  if (cached) {
    return cached;
  }
  const variants = /* @__PURE__ */ new Set();
  for (const protocol of ["https", "socks", "http"]) {
    variants.add(Proxy.normalize(line, protocol));
  }
  const abortController = new AbortController();
  const { signal } = abortController;
  let proxy;
  await Promise.all(
    [...variants].map(async (url) => {
      const instance = new Proxy(line, url);
      await instance.check({ signal });
      if (instance.valid) {
        abortController.abort();
        proxy = instance;
      }
      if (!proxy || !proxy.valid) {
        proxy = instance;
      }
    })
  );
  setTimeout(() => abortController.abort(), proxyConfig.checkTimeout);
  if (!proxy) {
    proxy = new Proxy(line);
    await proxy.check();
  }
  console.log(
    chalk.blueBright(`Проверено прокси ${proxy.line}. Результат:`),
    proxy.valid ? chalk.greenBright(`РАБОЧЕЕ`) : chalk.redBright("НЕРАБОЧЕЕ")
  );
  cache.set(line, proxy);
  cache.set(proxy.url, proxy);
  return proxy;
}
async function getList() {
  const lines = (await readFile(proxyFile, "utf-8").catch(() => "")).split("\n").map((line) => line.trim()).filter(Boolean);
  const results = await Promise.allSettled(lines.map(resolve));
  return results.flatMap((r) => r.status === "fulfilled" ? [r.value] : []);
}
const proxies = [];
function update() {
  getList().then((list) => proxies.splice(0, proxies.length, ...list));
}
let initialized = false;
function init() {
  if (initialized) {
    return;
  }
  setInterval(update, proxyConfig.reloadInterval);
  update();
  initialized = true;
}
function getRandomAgent() {
  return proxies[Math.floor(Math.random() * proxies.length)];
}

export { getRandomAgent as g, init as i };
//# sourceMappingURL=proxy-44d5cf04.js.map
