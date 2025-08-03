import path from "path";
import { promises as fs } from "fs";

const projectRoot = path.resolve(process.cwd());
const packageJsonFilePath = path.join(projectRoot, "package.json");
const nodeModulesDirectoryPath = path.join(projectRoot, "node_modules");

const getDependencies = (data: string) => {
  const { dependencies = {}, devDependencies = {} } = JSON.parse(data);

  const arrayOfDependencies = Object.keys(dependencies);
  const arrayOfDevDependencies = Object.keys(devDependencies);

  return { arrayOfDependencies, arrayOfDevDependencies };
};

const getReadmes = async (arrayOfDependencies: string[], arrayOfDevDependencies: string[]) => {
  const directories = await fs.readdir(nodeModulesDirectoryPath, { encoding: "utf8" });
  const matchedDirectories = directories.filter(
    (directory) =>
      arrayOfDependencies.includes(directory) || arrayOfDevDependencies.includes(directory)
  );

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
    const { arrayOfDependencies, arrayOfDevDependencies } = getDependencies(packageJsonData);
    const readmes = await getReadmes(arrayOfDependencies, arrayOfDevDependencies);

    if (!readmes.length) console.log("There is no available documentation.");
  } catch (error) {
    console.log(error);
  }
};

main();
