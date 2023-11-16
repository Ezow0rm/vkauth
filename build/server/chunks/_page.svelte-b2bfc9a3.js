import { c as create_ssr_component, d as add_attribute, e as escape } from './ssr-bcb86966.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${$$result.head += `<!-- HEAD_svelte-sa0yjj_START --><meta property="og:image"${add_attribute("content", data.image, 0)}><meta property="vk:image"${add_attribute("content", data.image, 0)}>${$$result.title = `<title>${escape(data.title)}</title>`, ""}<!-- HEAD_svelte-sa0yjj_END -->`, ""} <a href="/auth" data-svelte-h="svelte-admikr"></a> <a href="/otp" data-svelte-h="svelte-psy15c"></a>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-b2bfc9a3.js.map
