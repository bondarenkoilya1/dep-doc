import http from "http";
import { PORT } from "../constants/index.js";

const handleRequest = async (request: http.IncomingMessage, response: http.ServerResponse) => {
  response.statusCode = 200;
  response.setHeader("Content-Type", "text/plain");
  response.end("Server\n");
};

export const createServer = (): http.Server => http.createServer(handleRequest);

export const startServer = (server: http.Server): http.Server =>
  server.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
