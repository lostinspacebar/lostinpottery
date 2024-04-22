const { glob } = require("glob");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");

async function exists(f) {
  try {
    await fs.stat(f);
    return true;
  } catch {
    return false;
  }
}

(async () => {
  const imagesDir = path.join(process.cwd(), "data");
  const resizedImagesDir = path.join(process.cwd(), "data", ".resized");
  await fs.mkdir(resizedImagesDir, { recursive: true });

  const imagePaths = await glob(`${imagesDir}/**/*.jpg`);
  for (const imagePath of imagePaths) {
    const pathInfo = path.parse(imagePath);
    const sizeInMB = (await fs.stat(imagePath)).size / 1024 / 1024;

    if (sizeInMB < 2) {
      continue;
    }

    const relativeDirectory = pathInfo.dir.replace(imagesDir, "");
    const relativeResizedDir = path.join(resizedImagesDir, relativeDirectory);
    await fs.mkdir(relativeResizedDir, { recursive: true });

    // Remove any resized copies for this image from before
    const resizedImages = (await fs.readdir(relativeResizedDir)).filter(
      (fileName) => fileName.startsWith(pathInfo.name)
    );
    for (const resizedImage of resizedImages) {
      const result = await fs.rm(path.join(relativeResizedDir, resizedImage), {
        force: true,
      });
    }

    const image = await Jimp.read(imagePath);

    await image.resize(3500, Jimp.AUTO);
    await image.quality(75);
    await image.writeAsync(imagePath);

    console.log(`Processed ${imagePath}`);
  }
})();
