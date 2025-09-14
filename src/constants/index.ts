import path from "path";

const PROJECT_ROOT = path.resolve(process.cwd());
export const SRC_PATH = path.resolve(PROJECT_ROOT, "src");
export const PACKAGE_JSON_PATH = path.join(PROJECT_ROOT, "package.json");
export const NODE_MODULES_PATH = path.join(PROJECT_ROOT, "node_modules");
export const PORT = 5123;

export const CONTENT_TYPE_HTML = "text/html";
export const HTTP_STATUS = {
  OK: 200,
  INTERNAL_SERVER_ERROR: 500
};
