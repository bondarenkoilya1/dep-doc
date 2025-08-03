import path from "path";
import { promises as fs } from "fs";
import http from "http";

// TODO: Make code complete parallel

const projectRoot = path.resolve(process.cwd());
const packageJsonFilePath = path.join(projectRoot, "package.json");
const nodeModulesDirectoryPath = path.join(projectRoot, "node_modules");

const getDependencies = (data: string) => {
  const { dependencies = {}, devDependencies = {} } = JSON.parse(data);

  return {
    dependencies: Object.keys(dependencies),
    devDependencies: Object.keys(devDependencies)
  };
};

const getReadmes = async (dependencies: string[], devDependencies: string[]) => {
  const allDependencies = new Set([...dependencies, ...devDependencies]);
  const directories = await fs.readdir(nodeModulesDirectoryPath, { encoding: "utf8" });
  const matchedDirectories = directories.filter((directory) => allDependencies.has(directory));
  const readmes = [];

  for (const directory of matchedDirectories) {
    const directoryPath = path.join(projectRoot, "node_modules", directory);
    const readmePath = path.join(directoryPath, "README.md");
    const readmeContent = await fs.readFile(readmePath, { encoding: "utf8" });
    readmes.push({ directory, readmeContent });
  }

  return readmes;
};

const main = async () => {
  try {
    const packageJsonData = await fs.readFile(packageJsonFilePath, { encoding: "utf8" });
    const { dependencies, devDependencies } = getDependencies(packageJsonData);
    const readmes = await getReadmes(dependencies, devDependencies);

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

const PORT = 5123;
server.listen(PORT, () => {
  console.log(`Server started on  http://localhost:${PORT}`);
});
