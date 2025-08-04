// TODO: Make code complete parallel
// TODO: Current directory "controllers" may now follow MVC architecture, but for now it's just a place to delegate my code

import { createServer, startServer } from "./controllers/server.js";
import { getReadmes } from "./models/readme.js";

const main = async () => {
  try {
    const readmes = await getReadmes();
    if (!readmes.length) console.log("There is no available documentation.");
  } catch (error) {
    console.error(error);
  }
};

main();

const server = createServer();
startServer(server);
