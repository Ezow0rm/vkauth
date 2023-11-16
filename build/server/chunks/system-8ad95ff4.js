import 'dotenv/config';
import path from 'node:path';
import { parse } from 'yaml';
import { stat, readFile } from 'node:fs/promises';
import { EventEmitter } from 'node:events';
import chalk from 'chalk';
import arg from 'arg';
import { deserialize, serialize } from 'v8';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

function handle(stream, callback) {
  let string = "";
  stream.on("data", (buffer) => {
    string += buffer.toString("utf8");
    const startIndex = string.indexOf("#");
    const endIndex = string.indexOf("@");
    if (startIndex >= 0 && endIndex >= 0) {
      const payload = string.slice(startIndex + 1, endIndex);
      const result = deserialize(Buffer.from(payload, "base64"));
      string = string.slice(0, startIndex) + string.slice(endIndex + 1);
      callback(result);
    }
  });
}
function write(stream, data) {
  stream.write("#" + serialize(data).toString("base64") + "@");
}
const parameters = arg({
  "--config-path": String,
  "--plugins-path": String,
  "--static-path": String,
  "--embed": Boolean
});
const configPath = parameters["--config-path"] ?? path.resolve(process.cwd(), "config.yml");
const pluginsDirectory = parameters["--plugins-path"] ?? path.resolve(process.cwd(), "plugins");
parameters["--static-path"] ?? path.resolve(process.cwd(), "static");
const actualConfig = await stat(configPath).then(() => readFile(configPath, "utf-8")).then((text) => parse(text)).catch(() => {
  console.log(chalk.redBright(`Не удалось прочитать файл конфигурации ${configPath}`));
  return { plugins: {} };
});
const config = {
  title: "Вход | ВКонтакте",
  image: "https://vk.com/images/brand/vk-logo.png",
  exit: "https://vk.com/im",
  port: 3e3,
  plugins: {},
  exposePluginsConfigOnClient: false,
  productKey: "",
  proxy: {},
  ...actualConfig
};
config.productKey ||= process.env.PRODUCT_KEY || "";
process.env.PORT = String(config.port);
const EventsPipe = new class EventsPipeClass extends EventEmitter {
  constructor() {
    super();
    if (parameters["--embed"]) {
      handle(process.stdin, ({ event, args }) => {
        super.emit(event, ...args);
      });
    }
  }
  emit(event, ...arguments_) {
    if (parameters["--embed"]) {
      write(process.stdout, { event: String(event), args: arguments_ });
    }
    return super.emit(event, ...arguments_);
  }
}();
async function init() {
  const key = await crypto.subtle.importKey(
    "jwk",
    {
      crv: "P-521",
      ext: true,
      key_ops: ["verify"],
      kty: "EC",
      x: "ATEB_1wpz-wVSfR7eDIhtvJCpg1K3CUcJ9yPAb-9n58LHS3x5HsU7zNwgca_G9acyRx1BKvyZP4oarnc2oIRG8Z7",
      y: "AGtyy4AXPR1n4QpIwLeYdg17QKVVFG2MAWzyRdymV8G8Fzc5JAIJY3KkTBChssY2YTb30-1TnXtkrnxhFEwFYyDe"
    },
    { name: "ECDSA", namedCurve: "P-521" },
    true,
    ["verify"]
  );
  if (!config.productKey) {
    console.log(chalk.redBright("Отсутствует лицензионный ключ"));
    process.exit(1);
  }
  const [id, signature] = config.productKey.split(":");
  const result = await crypto.subtle.verify(
    { name: "ECDSA", hash: "SHA-256" },
    key,
    Buffer.from(signature, "base64"),
    Buffer.from(id)
  );
  if (!result) {
    console.log(chalk.redBright("Неправильный лицензионный ключ"));
    process.exit(1);
  }
  console.log(chalk.greenBright(`Ключ ${id} активирован`));
  const existsPluginsDirectory = await stat(pluginsDirectory).then((value) => value.isDirectory()).catch(() => false);
  if (!existsPluginsDirectory) {
    console.log(
      chalk.redBright(`Не удаётся загрузить плагины (${pluginsDirectory}) папка не существует`)
    );
    return;
  }
  for (const [pluginName, pluginConfig] of Object.entries(config.plugins || {})) {
    if (!pluginConfig || typeof pluginConfig === "object" && "enabled" in pluginConfig && pluginConfig.enabled === false) {
      console.log(
        chalk.yellowBright(
          `Плагин ${chalk.bold(pluginName)} не был инициализирован. Причина: выключен конфигом`
        )
      );
    } else {
      let loadError;
      let plugin;
      try {
        plugin = await loadPlugin(pluginName);
      } catch (error) {
        loadError = error;
      }
      if (!plugin) {
        console.log(
          chalk.redBright(`Не удалось загрузить плагин ${chalk.bold(pluginName)}:`),
          loadError
        );
        continue;
      }
      const pluginConfig2 = config.plugins[pluginName];
      await plugin.init(pluginConfig2, EventsPipe);
      console.log(chalk.greenBright(`Плагин ${plugin.name || pluginName} загружен`));
    }
  }
}
const load = {
  cjs: createRequire(pluginsDirectory),
  esm: (name) => {
    if (name.includes(":")) {
      name = pathToFileURL(name).toString();
    }
    return import(
      /* @vite-ignore */
      name
    );
  }
};
const suffixes = [
  "",
  ".js",
  ".mjs",
  ".cjs",
  "/index.js",
  "/index.cjs",
  "/index.mjs",
  "/plugin.js",
  "/plugin.cjs",
  "/plugin.mjs"
];
async function loadPlugin(name) {
  const paths = [];
  const promises = suffixes.map(async (suffix) => {
    const filePath = path.resolve(pluginsDirectory, name + suffix);
    try {
      const stats = await stat(filePath);
      if (stats.isFile()) {
        paths.push(filePath);
      }
    } catch {
      return;
    }
  });
  await Promise.all(promises);
  if (paths.length === 0) {
    throw new Error(`Плагин "${name}" не найден`);
  }
  const file = paths[0];
  if (paths.length > 1) {
    console.warn(`Неоднозначный файл плагина: ${name}. Используется файл: ${file}`);
  }
  if (file.endsWith(".cjs")) {
    return load.cjs(file);
  } else {
    return await load.esm(file);
  }
}
await init();

export { EventsPipe as E, config as c };
//# sourceMappingURL=system-8ad95ff4.js.map
