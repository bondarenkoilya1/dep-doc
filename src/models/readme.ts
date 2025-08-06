import { DependenciesType, ReadmeType } from "../types/index.js";
import { promises as fs } from "fs";
import { NODE_MODULES_PATH, PACKAGE_JSON_PATH } from "../constants/index.js";
import path from "path";

const getDependencies = async (): Promise<DependenciesType> => {
  const packageJsonData = await fs.readFile(PACKAGE_JSON_PATH, { encoding: "utf8" });
  const { dependencies = {}, devDependencies = {} } = JSON.parse(packageJsonData);

  return {
    dependencies: Object.keys(dependencies),
    devDependencies: Object.keys(devDependencies)
  };
};

export const getReadmes = async () => {
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

  return { readmes, allDependencies };
};
