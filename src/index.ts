import path from "path";
import { promises as fs } from "fs";
import http from "http";

// TODO: Make code complete parallel

import { PACKAGE_JSON_PATH, NODE_MODULES_PATH, PORT } from "./constants/index.js";
import { DependenciesType, ReadmeType } from "./types/index.js";

const getDependencies = async (): Promise<DependenciesType> => {
  const packageJsonData = await fs.readFile(PACKAGE_JSON_PATH, { encoding: "utf8" });
  const { dependencies = {}, devDependencies = {} } = JSON.parse(packageJsonData);

  return {
    dependencies: Object.keys(dependencies),
    devDependencies: Object.keys(devDependencies)
  };
};

const getReadmes = async () => {
  const { dependencies, devDependencies } = await getDependencies();
  const allDependencies = new Set([...dependencies, ...devDependencies]);
  const directories = await fs.readdir(NODE_MODULES_PATH, { encoding: "utf8" });
  const matchedDirectories = directories.filter((directory) => allDependencies.has(directory));
  const readmes: ReadmeType[] = [];

  for (const directory of matchedDirectories) {
    const readmePath = path.join(NODE_MODULES_PATH, directory, "README.md");
    const readmeContent = await fs.readFile(readmePath, { encoding: "utf8" });
    readmes.push({ directory, content: readmeContent });
  }

  return readmes;
};

const main = async () => {
  try {
    const readmes = await getReadmes();
    if (!readmes.length) console.log("There is no available documentation.");
  } catch (error) {
    console.error(error);
  }
};

main();

const server = http.createServer(async (request, response) => {
  response.statusCode = 200;
  response.setHeader("Content-Type", "text/plain");
  response.end("Server\n");
});

server.listen(PORT, () => console.log(`Server started on  http://localhost:${PORT}`));
