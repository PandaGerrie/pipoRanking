

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.DnnCun6j.js","_app/immutable/chunks/scheduler.D3aZ0wum.js","_app/immutable/chunks/index.BjELp4DP.js"];
export const stylesheets = ["_app/immutable/assets/2.CUm4RlVl.css"];
export const fonts = [];
