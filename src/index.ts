#!/usr/bin/env node
import chalk from "chalk";
import inquirer from "inquirer";
import { program } from "commander";
import { createFile, getEntryContentForHook, listFoldersInRepo } from "./utils";

const username = "henoktsegaye";
const repo = "custom-react-hooks";
const defaultPath = "hooks";

const getFolderList = async (library?: string) => {
  try {
    const folders = await listFoldersInRepo(username, repo, defaultPath);
    inquirer
      .prompt([
        {
          type: "list",
          name: "hooks",
          message: "Select hook to install",
          choices: folders,
        },
      ])
      .then(async (answers) => {
        console.log(chalk.greenBright("Installing hook...", answers.hooks));
        try {
          const { content, filename } = await getEntryContentForHook(
            username,
            repo,
            library ? `${library}/defaultPath` : defaultPath,
            answers.hooks
          );
          if (!content) {
            throw new Error("No content found");
          }
          await createFile(
            `./${answers.hooks}.${filename.split(".")[1]}`,
            content
          );
          console.log(chalk.greenBright("Hook installed successfully"));
        } catch (error) {
          console.error(chalk.bgRedBright("Error: "), error.message);
        }
      });
  } catch (error) {
    console.error(error);
  }
};

const welcome = async () => {
  console.log(chalk.greenBright("PRH - Pull react hooks"));
};

program
  .description(
    "PRH (Pull react hooks) is a CLI tool to install custom react hooks from github repo - custom-react-hooks"
  )
  .option("-v, --version", "output the current version")
  .option("-h, --help", "output usage information")
  .option("-l, --list", "list all available hooks")
  .parse(process.argv);

const options = program.opts();
if (!options.list && !options.version && !options.help) {
  welcome();
  getFolderList();
}

if (options.list) {
  welcome();
  getFolderList();
}

if (options.version) {
  welcome();
  console.log(chalk.greenBright("PRH version 1.0.0"));
}

if (options.help) {
  welcome();
  console.log(chalk.greenBright("PRH version 1.0.0"));
  console.log(
    chalk.greenBright(
      "PRH (Pull react hooks) is a CLI tool to install custom react hooks from github repo - custom-react-hooks"
    )
  );
  console.log(chalk.greenBright("Usage: prh -l - to list all available hooks"));
  console.log(chalk.greenBright("Usage: prh -v - to get the current version"));
  console.log(chalk.greenBright("Usage: prh -h - "));
}
