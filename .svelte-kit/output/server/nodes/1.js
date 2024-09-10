

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.B6y-ac_Y.js","_app/immutable/chunks/scheduler.D3aZ0wum.js","_app/immutable/chunks/index.BjELp4DP.js","_app/immutable/chunks/entry.zNB8tCdx.js"];
export const stylesheets = [];
export const fonts = [];
