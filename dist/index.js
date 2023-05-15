#!/usr/bin/env node
import chalk from "chalk";
import inquirer from "inquirer";
import { program } from "commander";
import nanospinner from "nanospinner";
import { createFile, getEntryContentForHook, listFoldersInRepo, } from "./utils.js";
const username = "henoktsegaye";
const repo = "custom-react-hooks";
const defaultPath = "hooks";
const spinner = nanospinner.createSpinner();
const getFolderList = async (library) => {
    try {
        spinner.start({
            text: "Fetching hooks...",
            color: "blue",
        });
        const folders = await listFoldersInRepo(username, repo, defaultPath);
        spinner.stop({
            text: "Hooks fetched successfully",
            color: "green",
        });
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
                spinner.start({
                    text: "Installing hook...",
                    color: "blue",
                });
                const { content, filename, url } = await getEntryContentForHook(username, repo, library ? `${library}/defaultPath` : defaultPath, answers.hooks);
                spinner.stop({
                    text: "Hook installed successfully",
                    color: "green",
                });
                if (!content) {
                    throw new Error("No content found");
                }
                await createFile(`./${answers.hooks}.${filename.split(".")[1]}`, content);
                console.log(chalk.greenBright(`How to use hook: ${url}`));
            }
            catch (error) {
                console.error(chalk.bgRedBright("Error: "), error.message);
            }
        });
    }
    catch (error) {
        console.error(error);
    }
    spinner.clear();
};
const welcome = async () => {
    console.log(chalk.greenBright("PRH - Pull react hooks"));
};
program
    .description("PRH (Pull react hooks) is a CLI tool to install custom react hooks from github repo - custom-react-hooks")
    .version("1.0.1")
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
if (options.help) {
    welcome();
    console.log(chalk.greenBright("PRH version 1.0.0"));
    console.log(chalk.greenBright("PRH (Pull react hooks) is a CLI tool to install custom react hooks from github repo - custom-react-hooks"));
    console.log(chalk.greenBright("Usage: prh -l - to list all available hooks"));
    console.log(chalk.greenBright("Usage: prh -v - to get the current version"));
    console.log(chalk.greenBright("Usage: prh -h - "));
}
