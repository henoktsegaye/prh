import axios from "axios";
import chalk from "chalk";
import * as fs from "fs";
const axiosInstance = axios.create({
    baseURL: "https://api.github.com",
    timeout: 10000,
});
export async function listFoldersInRepo(owner, repo, folderPath) {
    const apiUrl = folderPath
        ? `/repos/${owner}/${repo}/contents/${folderPath}`
        : `/repos/${owner}/${repo}/contents`;
    try {
        const response = await axiosInstance.get(apiUrl);
        if (!response.data) {
            throw new Error("No data found");
        }
        const folders = response.data
            .filter((item) => item.type === "dir")
            .map((item) => item.name);
        return folders;
    }
    catch (error) {
        console.error("error");
        console.error(chalk.bgRedBright("Error: "), error.message);
        return [];
    }
}
export const getEntryContentForHook = async (owner, repo, folderPath, hookName) => {
    const apiUrl = `/repos/${owner}/${repo}/contents/${folderPath}/${hookName}`;
    const response = await axiosInstance.get(apiUrl);
    if (!response.data) {
        throw new Error("No file found under that hook");
    }
    for (const item of response.data) {
        if (item.name === "index.ts" || item.name === "index.tsx") {
            const response = await axios.get(item.download_url);
            if (response.data) {
                return {
                    content: response.data,
                    filename: item.name,
                    url: item.html_url.replace(item.name, ""),
                };
            }
        }
    }
    throw new Error("No content found");
};
export const createFile = async (path, content) => new Promise((resolve, reject) => {
    if (!path || !content) {
        reject("Invalid path or content");
    }
    fs.writeFileSync(path, content, {
        encoding: "utf-8",
        flag: "w",
    });
    resolve("File created successfully");
});
