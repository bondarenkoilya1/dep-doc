import path from "path";
import fs from "fs";

const projectRoot = path.resolve(process.cwd());
const packageJSONFilePath = path.join(projectRoot, "package.json");
const nodeModulesDirectoryPath = path.join(projectRoot, "node_modules");

const readFileAsync = async (path: string) => {
  return new Promise((resolve, reject) =>
    fs.readFile(path, { encoding: "utf8" }, (error, data) => {
      if (error) return reject(error);
      resolve(data);
    })
  );
};

const getDependencies = (data: string) => {
  const { dependencies = {}, devDependencies = {} } = JSON.parse(data);

  const arrayOfDependencies = Object.keys(dependencies);
  const arrayOfDevDependencies = Object.keys(devDependencies);

  return { arrayOfDependencies, arrayOfDevDependencies };
};

const matchNodeModulesDependencies = (
  arrayOfDependencies: string[],
  arrayOfDevDependencies: string[]
) => {
  fs.readdir(nodeModulesDirectoryPath, (error, directories) => {
    if (error) throw error;

    const matchedDirectories = directories.filter(
      (directory) =>
        arrayOfDevDependencies.includes(directory) || arrayOfDependencies.includes(directory)
    );

    // matchedDirectories.forEach((directory) => {
    //   const currentDirectoryFilePath = path.join(projectRoot, "node_modules", directory);
    // });
  });
};

readFileAsync(packageJSONFilePath)
  .then(getDependencies)
  .then(({ arrayOfDependencies, arrayOfDevDependencies }) =>
    matchNodeModulesDependencies(arrayOfDependencies, arrayOfDevDependencies)
  )
  .catch((error) => console.log(error.message));
