import fs from "fs/promises";
import matter from "gray-matter";
import path from "path";
import { remark } from "remark";
import html from "remark-html";
import { Pot } from "./pot";

export const DATA_DIRECTORY = path.join(process.cwd(), "data");
export const IMAGES_DIRECTORY = path.join(process.cwd(), "public/images");

/**
 * Gets Ids for all pots.
 *
 * @returns list of pot ids
 */
export const getAllPotIds = async (): Promise<string[]> => {
  const dataPath = path.join(DATA_DIRECTORY, "pots");
  const files = await fs.readdir(dataPath);
  return files
    .filter((fileName) => path.extname(fileName) === ".md")
    .map((fileName) => path.parse(fileName).name);
};

/**
 * Gets metadata (no content) for all pots.
 */
export const getAllPots = async (): Promise<Pot[]> => {
  const pots: Pot[] = [];
  const ids = await getAllPotIds();
  for (const id of ids) {
    pots.push(await getPot(id));
  }
  return pots;
};

/**
 * Get definition of a pot given it's name.
 *
 * @param id id of pot to get
 */
export const getPot = async (
  id: string,
  includePageContent: boolean = false
): Promise<Pot> => {
  const fullPath = path.join(DATA_DIRECTORY, "pots", id + ".md");
  const fileContents = await fs.readFile(fullPath, "utf8");
  const matterResult = matter(fileContents);
  let pageContent = undefined;
  if (includePageContent) {
    const processedContent = await remark()
      .use(html)
      .process(matterResult.content);
    pageContent = processedContent.toString();
  }

  let images: string[] = matterResult.data.images;
  if (!matterResult.data.images) {
    images = (
      await fs.readdir(path.join(IMAGES_DIRECTORY, "pots", id))
    )
      .filter((fileName) => path.extname(fileName) === ".jpg")
      .map((fileName) => `/images/pots/${id}/${fileName}`);
  }

  const heroImage = matterResult.data.heroImage ?? images[0];

  return {
    id: id,
    name: matterResult.data.name,
    description: matterResult.data.description,
    heroImage,
    images,
    link: `/pot/${id}`,
    status: matterResult.data.status,
    pageContent,
  };
};
