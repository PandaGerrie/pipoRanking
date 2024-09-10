const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.BM5rwf27.js","app":"_app/immutable/entry/app.DFESKC23.js","imports":["_app/immutable/entry/start.BM5rwf27.js","_app/immutable/chunks/entry.zNB8tCdx.js","_app/immutable/chunks/scheduler.D3aZ0wum.js","_app/immutable/entry/app.DFESKC23.js","_app/immutable/chunks/scheduler.D3aZ0wum.js","_app/immutable/chunks/index.BjELp4DP.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./chunks/0-nGu0AyhY.js')),
			__memo(() => import('./chunks/1-CIKAFZYK.js')),
			__memo(() => import('./chunks/2-DZ8qgdFx.js'))
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
				id: "/api/players",
				pattern: /^\/api\/players\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server-CgI2cNsp.js'))
			},
			{
				id: "/api/players/[id]",
				pattern: /^\/api\/players\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./chunks/_server-CLtcosqH.js'))
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

export { manifest, prerendered };
//# sourceMappingURL=manifest.js.map
