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
    const { readmes, dependencies, devDependencies } = await getReadmes();

    const dependencyList = transferListToHtml(dependencies);
    const devDependencyList = transferListToHtml(devDependencies);

    const currentContent = readmes.find(
      (dependency) => dependency.directory === request.url.slice(1)
    );

    const content =
      currentContent && currentContent.content
        ? marked.parse(currentContent.content)
        : marked.parse(readmes[0].content);

    const modifiedHtml = htmlFile
      .replace("{{content}}", content as string)
      .replace("{{dependencyList}}", dependencyList)
      .replace("{{devDependencyList}}", devDependencyList);

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

// TODO: Bring those two to a separate file and return already modified deps
function createLiElement(text: string): string {
  // TODO: Fix the bug with URLs that has been changed (from / to -, etc)
  const url = text.split("/").join("-");

  return `<li class="navbar__list-item">
    <a class="navbar__list-link" href=${url}>${text}</a>
  </li>`;
}

function transferListToHtml(list: string[]) {
  return [...list].map(createLiElement).join("");
}
