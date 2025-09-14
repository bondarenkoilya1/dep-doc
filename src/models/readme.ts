import { DependenciesType, ReadmeType } from "../types/index.js";
import { promises as fs } from "fs";
import { NODE_MODULES_PATH, PACKAGE_JSON_PATH } from "../constants/index.js";
import path from "path";

export const getDependencies = async (): Promise<DependenciesType> => {
  const packageJsonData = await fs.readFile(PACKAGE_JSON_PATH, { encoding: "utf8" });
  const { dependencies = {}, devDependencies = {} } = JSON.parse(packageJsonData);

  const filterDependencies = (dependencies: string[], isOther: boolean) =>
    isOther
      ? Object.keys(dependencies).filter((dependency) => dependency[0] === "@")
      : Object.keys(dependencies).filter((dependency) => dependency[0] !== "@");

  const removeDuplicates = (dependencies: string[]) => [...new Set(dependencies)];

  return {
    dependencies: removeDuplicates(filterDependencies(dependencies, false)),
    devDependencies: removeDuplicates(filterDependencies(devDependencies, false)),
    otherDependencies: removeDuplicates(
      filterDependencies(dependencies, true) && filterDependencies(devDependencies, true)
    )
  };
};

// NODE MODULES: @types => node, other folder
// @types/node, @types/ror
export const getReadmes = async () => {
  const { dependencies, devDependencies, otherDependencies } = await getDependencies();

  // const otherDirectories = [...otherDependencies].map(
  //   (dependency) => dependency.split("/")[0]
  // ); // "@types"

  const directories = await fs.readdir(NODE_MODULES_PATH, { encoding: "utf8" });
  const matchedDirectories = directories.filter((directory) =>
    [...dependencies, ...devDependencies].includes(directory)
  );
  const readmes: ReadmeType[] = [];

  for (const directory of matchedDirectories) {
    const readmePath = path.join(NODE_MODULES_PATH, directory, "README.md");
    const readmeContent = await fs.readFile(readmePath, { encoding: "utf8" });
    readmes.push({ directory, content: readmeContent });
  }

  return readmes;
};
