const { glob } = require("glob");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { DATA_DIRECTORY } = require("@/lib/getPots");

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
  const resizedImagesDir = path.join(process.cwd(), "public", "images", ".resized");
  await fs.mkdir(resizedImagesDir, { recursive: true });

  const lastProcessedMarkerFilePath = path.join(
    resizedImagesDir,
    "lastProcessed"
  );
  let lastProcessedTime = new Date(0);
  if (!process.env.FORCE_GENERATE_IMAGES && await exists(lastProcessedMarkerFilePath)) {
    lastProcessedTime = (await fs.stat(lastProcessedMarkerFilePath)).mtime;
  }

  const imagePaths = await glob(`${imagesDir}/**/*.jpg`);
  for (const imagePath of imagePaths) {
    const pathInfo = path.parse(imagePath);
    const modifiedTime = (await fs.stat(imagePath)).mtime;

    if (lastProcessedTime > modifiedTime) {
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

    const resizeImage = async (width) => {
      await image.resize(width, Jimp.AUTO);
      await image.quality(80);
      await image.writeAsync(
        `${relativeResizedDir}/${pathInfo.name}-${image.bitmap.width}x${image.bitmap.height}${pathInfo.ext}`
      );
    };

    await resizeImage(2000);
    await resizeImage(800);
    await resizeImage(500);
    await resizeImage(200);

    console.log(`Processed ${imagePath}`);
  }

  await fs.writeFile(lastProcessedMarkerFilePath, new Date().toISOString());
  
  if (process.env.CI) {
    console.log("CI environment. Deleting original images to save space.");
    const potImagesDir = path.join(DATA_DIRECTORY, "pots");
    await fs.rmdir(potImagesDir, { recursive: true });
  }
})();
