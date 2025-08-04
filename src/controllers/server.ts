import http from "http";
import { PORT, SRC_PATH } from "../constants/index.js";
import path from "path";
import { promises as fs } from "fs";

const handleRequest = async (request: http.IncomingMessage, response: http.ServerResponse) => {
  try {
    const htmlPath = path.join(SRC_PATH, "index.html");
    const htmlFile = await fs.readFile(htmlPath, { encoding: "utf8" });

    const data = { content: "HTML page for the server" };
    const modifiedHtml = htmlFile.replace("{{content}}", data.content);

    response.writeHead(200, { "Content-Type": "text/html" });
    response.end(modifiedHtml);
  } catch (error) {
    response.writeHead(500);
    response.end("Internal Server Error");
  }
};

export const createServer = (): http.Server => http.createServer(handleRequest);

export const startServer = (server: http.Server): http.Server =>
  server.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
