// TODO: Make code complete parallel
// TODO: Current directory "controllers" may now follow MVC architecture, but for now it's just a place to delegate my code
// TODO: Deal with @dependency/dependency dependencies and it's urls

import { createServer, startServer } from "./controllers/server.js";

const main = async () => {
  try {
  } catch (error) {
    console.error(error);
  }
};

main();

const server = createServer();
startServer(server);
