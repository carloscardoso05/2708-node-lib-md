import chalk from "chalk";

function handleError(error){
    if(error.cause.code === "ENOTFOUND"){
        console.log(chalk.red("Link não encontrado", error))
    } else {
        console.log(chalk.red("Algo deu errado", error))
    }
}

export default async function validatedList(linkList) {
  const URLs = linkList.map((link) => link.url);
  let validatedLinks = await Promise.all(
    URLs.map(async (url) => {
      try {
        const res = await fetch(url);
        return res.ok ? url : null;
      } catch (error) {
        handleError(error)
        return
      }
    })
  );
  validatedLinks = validatedLinks.filter(url => url !== null && url !== undefined)

  return await validatedLinks;
}
