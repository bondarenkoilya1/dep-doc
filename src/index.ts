import path from "path";
import { promises as fs } from "fs";

// TODO: Make code complete parallel
// TODO: Current directory "controllers" may now follow MVC architecture, but for now it's just a place to delegate my code

import { PACKAGE_JSON_PATH, NODE_MODULES_PATH, PORT } from "./constants/index.js";
import { DependenciesType, ReadmeType } from "./types/index.js";
import { createServer, startServer } from "./controllers/server.js";

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

const server = createServer();
startServer(server);
