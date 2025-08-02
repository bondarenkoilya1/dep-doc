import path from "path";
import fs from "fs";

const projectRoot = path.resolve(process.cwd());
const packageJSONFilePath = path.join(projectRoot, "package.json");

const readFileAsync = async (path: string) => {
  return new Promise((resolve, reject) =>
    fs.readFile(path, { encoding: "utf8" }, (error, data) => {
      if (error) return reject(error);
      resolve(data);
    })
  );
};

readFileAsync(packageJSONFilePath)
  .then((data: string) => {
    const { dependencies = {}, devDependencies = {} } = JSON.parse(data);

    const arrayOfDependencies = Object.keys(dependencies);
    const arrayOfDevDependencies = Object.keys(devDependencies);

    console.log(arrayOfDependencies, arrayOfDevDependencies);
  })
  .catch((error) => console.log(error.message));
