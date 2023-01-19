import chalk from "chalk";
import { getLinks, readArchive } from "./index.js";
import validatedList from "./http-validation.js";
import fs from "fs";

const args = process.argv;
const path = args[args.length - 1];
const validate = args.includes("--validate");
const log = (l) => console.log(chalk.yellow(l));
// const printList = (list, archiveName='') => {
//   log([list, chalk.bgGreen.black(archiveName)])
// }

async function processText(path, validate) {
  try {
    fs.lstatSync(path);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log(chalk.red("Arquivo ou diretório inválido"));
      return;
    } else {
      throw new Error(error);
    }
  }

  if (fs.lstatSync(path).isFile()) {
    const links = await getLinks(path);
    // links.forEach((link) => log(`${link.name}: ${link.url}`));
    validate ? log(await validatedList(links)) : null
  } else if (fs.lstatSync(path).isDirectory()) {
    const archives = await fs.promises.readdir(path);
    archives.forEach(async (archive) => {
      console.log(chalk.bgGreen.black.bold(archive));
      const links = await getLinks(`${path}/${archive}`);
      links.forEach(async (link) => {
        // log(`${link.name}: ${link.url}`)
        validate ? log(await validatedList(links)) : null
      });
      console.log();
    });
  }
}

processText(path, validate);
