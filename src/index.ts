import path from "path";
import { promises as fs } from "fs";

const projectRoot = path.resolve(process.cwd());
const packageJSONFilePath = path.join(projectRoot, "package.json");
const nodeModulesDirectoryPath = path.join(projectRoot, "node_modules");

const getDependencies = (data: string) => {
  const { dependencies = {}, devDependencies = {} } = JSON.parse(data);

  const arrayOfDependencies = Object.keys(dependencies);
  const arrayOfDevDependencies = Object.keys(devDependencies);

  return { arrayOfDependencies, arrayOfDevDependencies };
};

const matchNodeModulesDependencies = async (
  arrayOfDependencies: string[],
  arrayOfDevDependencies: string[]
) => {
  const directories = await fs.readdir(nodeModulesDirectoryPath, { encoding: "utf8" });
  const matchedDirectories = directories.filter(
    (directory) =>
      arrayOfDependencies.includes(directory) || arrayOfDevDependencies.includes(directory)
  );

  return matchedDirectories;
  // matchedDirectories.forEach((directory) => {
  //   const currentDirectoryFilePath = path.join(projectRoot, "node_modules", directory);
  // });
};

const main = async () => {
  try {
    const packageJSONData = await fs.readFile(packageJSONFilePath, { encoding: "utf8" });
    const { arrayOfDependencies, arrayOfDevDependencies } = getDependencies(packageJSONData);
    const matchedDirectories = await matchNodeModulesDependencies(
      arrayOfDependencies,
      arrayOfDevDependencies
    );

    console.log(matchedDirectories);
  } catch (error) {
    console.log(error);
  }
};

main();
