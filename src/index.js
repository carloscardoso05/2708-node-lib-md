import chalk from "chalk";
import fs from "fs";

function handleError(error, path) {
    throw new Error(chalk.red(error.code, 'Não há arquivo no diretório', path))
}

async function readArchive(path){
  try {
    const text = await fs.promises.readFile(path, {encoding: "utf-8"})
    return text
  } catch (error) {
    handleError(error, path)
    return
  }
}

async function getLinks(path){
  const text = await readArchive(path)
  const regex = /\[([^\[^\]]*?)\]\(([^\(^\)]*?)\)/gm;
  const captures = [...text.matchAll(regex)]
  const links = captures.map(capture => ({
    name: capture[1],
    url: capture[2]
  }))
  return links.length !== 0 ? links : 'Não há links no arquivo'
}

export {getLinks, readArchive}