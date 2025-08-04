import path from "path";

export const PROJECT_ROOT = path.resolve(process.cwd());
export const PACKAGE_JSON_PATH = path.join(PROJECT_ROOT, "package.json");
export const NODE_MODULES_PATH = path.join(PROJECT_ROOT, "node_modules");
export const PORT = 5123;
