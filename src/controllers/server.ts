import http from "http";
import { HTTP_STATUS, PORT, SRC_PATH } from "../constants/index.js";
import path from "path";
import { promises as fs } from "fs";
import { getReadmes } from "../models/readme.js";
import { marked } from "marked";
import { transferListToHtml } from "../utils/handleDependencies.js";
import { CONTENT_TYPE_HTML } from "../constants/index.js";

const handleRequest = async (request: http.IncomingMessage, response: http.ServerResponse) => {
  try {
    const htmlPath = path.join(SRC_PATH, "index.html");
    const htmlFile = await fs.readFile(htmlPath, { encoding: "utf8" });
    const { readmes, dependencies, devDependencies } = await getReadmes();

    const dependencyList = transferListToHtml(dependencies);
    const devDependencyList = transferListToHtml(devDependencies);

    // TODO: Fix the bug with URLs that has been changed (from / to -, etc)
    const selectedContent = readmes.find(
      (dependency) => dependency.directory === request.url.slice(1)
    );
    const renderedContent = selectedContent?.content || readmes[0].content;

    const modifiedHtml = htmlFile
      .replace("{{content}}", marked.parse(renderedContent) as string)
      .replace("{{dependencyList}}", dependencyList)
      .replace("{{devDependencyList}}", devDependencyList);

    response.writeHead(HTTP_STATUS.OK, { "Content-Type": CONTENT_TYPE_HTML });
    response.end(modifiedHtml);
  } catch (error) {
    response.writeHead(HTTP_STATUS.INTERNAL_SERVER_ERROR);
    response.end(`${error}`);
  }
};

export const createServer = (): http.Server => http.createServer(handleRequest);

export const startServer = (server: http.Server): http.Server =>
  server.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
