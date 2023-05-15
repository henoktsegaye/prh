import axios from "axios";
import chalk from "chalk";
import fs from "fs";

const axiosInstance = axios.create({
  baseURL: "https://api.github.com",
  timeout: 10000,
});

export type Response = Content[];

export interface Content {
  name: string;
  path: string;
  type: string;
  sha: string;
  url: string;
  git_url?: string;
  html_url: string;
  size?: number;
  download_url: string | null;
}

export async function listFoldersInRepo(
  owner: string,
  repo: string,
  folderPath?: string
): Promise<string[]> {
  let apiUrl = `/repos/${owner}/${repo}/contents`;
  if (folderPath) {
    apiUrl = `/repos/${owner}/${repo}/contents/${folderPath}`;
  }
  try {
    const response = await axiosInstance.get<void, { data: Response }>(apiUrl);
    const folders = response.data
      .filter((item) => item.type === "dir")
      .map((item) => item.name);
    return folders;
  } catch (error) {
    console.error("error");
    console.error(chalk.bgRedBright("Error: "), error.message);
    return [];
  }
}

export const getEntryContentForHook = async (
  owner: string,
  repo: string,
  folderPath: string,
  hookName: string
): Promise<{ content: string; filename: string }> => {
  const apiUrl = `/repos/${owner}/${repo}/contents/${folderPath}/${hookName}`;
  const response = await axiosInstance.get<void, { data: Response }>(apiUrl);
  if (!response.data) {
    throw new Error("No file found under that hook");
  }

  for (const item of response.data) {
    if (item.name === "index.ts" || item.name === "index.tsx") {
      const response = await axios.get<void, { data: string }>(
        item.download_url
      );
      if (response.data) {
        return {
          content: response.data,
          filename: item.name,
        };
      }
    }
  }
  throw new Error("No content found");
};

export const createFile = async (path: string, content: string) =>
  new Promise((resolve, reject) => {
    if (!path || !content) {
      reject("Invalid path or content");
    }
    fs.writeFileSync(path, content, {
      encoding: "utf-8",
      flag: "w",
    });
    resolve("File created successfully");
  });
