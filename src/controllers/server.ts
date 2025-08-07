import http from "http";
import { PORT, SRC_PATH } from "../constants/index.js";
import path from "path";
import { promises as fs } from "fs";
import { getReadmes } from "../models/readme.js";
import { marked } from "marked";

const handleRequest = async (request: http.IncomingMessage, response: http.ServerResponse) => {
  try {
    const htmlPath = path.join(SRC_PATH, "index.html");
    const htmlFile = await fs.readFile(htmlPath, { encoding: "utf8" });
    const { readmes, allDependencies } = await getReadmes();

    const dependencyList = [...allDependencies].map(createLiElement).join("");
    const content = marked.parse(readmes[0].content); // todo: maybe vulnerable to xss attacks

    const modifiedHtml = htmlFile
      .replace("{{content}}", content as string)
      .replace("{{dependencyList}}", dependencyList);

    response.writeHead(200, { "Content-Type": "text/html" });
    response.end(modifiedHtml);
  } catch (error) {
    response.writeHead(500);
    response.end(`${error}`);
  }
};

export const createServer = (): http.Server => http.createServer(handleRequest);

export const startServer = (server: http.Server): http.Server =>
  server.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));

function createLiElement(text: string): string {
  return `<li class="navbar__list-item">
    <a class="navbar__list-link">${text}</a>
  </li>`;
}
