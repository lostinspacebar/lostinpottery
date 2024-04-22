import fs from "fs/promises";
import matter from "gray-matter";
import _ from "lodash";
import path from "path";
import { remark } from "remark";
import html from "remark-html";
import { Pot } from "./pot";

export const DATA_DIRECTORY = path.join(process.cwd(), "data", "pots");
export const IMAGES_DIRECTORY = path.join(process.cwd(), "public", "images", ".resized", "pots");

async function exists(f: string) {
  try {
    await fs.stat(f);
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets Ids for all pots.
 *
 * @returns list of pot ids
 */
export const getAllPotIds = async (): Promise<string[]> => {
  const dataPath = path.join(DATA_DIRECTORY);
  const dirs = await fs.readdir(dataPath);
  const validPotDirs = []
  for (const dir of dirs) {
    if (await exists(path.join(dataPath, dir, dir + ".md"))) {
      validPotDirs.push(dir);
    }
  }
  return validPotDirs;
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
  const fullPath = path.join(DATA_DIRECTORY, id, id + ".md");
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
    images = (await fs.readdir(path.join(IMAGES_DIRECTORY, id)))
      .filter((fileName) => path.extname(fileName) === ".jpg" && fileName.includes("-2000x"))
      .map((fileName) => {
        const name = path.parse(fileName).name;
        return `/images/pots/${id}/${name.substring(0, name.indexOf("-2000x"))}.jpg`
      });
    images = _.uniq(images);
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
    type: matterResult.data.type,
    price: matterResult.data.price
  };
};
