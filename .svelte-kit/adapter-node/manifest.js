export const manifest = (() => {
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
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
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
				endpoint: __memo(() => import('./entries/endpoints/api/players/_server.js'))
			},
			{
				id: "/api/players/[id]",
				pattern: /^\/api\/players\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/players/_id_/_server.js'))
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

export const prerendered = new Set([]);
