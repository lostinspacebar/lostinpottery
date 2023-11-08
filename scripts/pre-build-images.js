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
  const imagesDir = path.join(process.cwd(), "public", "images");
  const resizedImagesDir = path.join(imagesDir, ".resized");
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
  process.exit(0);

  const pots = await fs.readdir(potImagesPath, {
    withFileTypes: true,
  });

  for (const potEntry of pots) {
    if (!potEntry.isDirectory()) {
      continue;
    }

    const potName = potEntry.name;
    const potImagesDir = path.join(potImagesPath, potName);
    const resizedImagesDir = path.join(potImagesDir, ".resized");

    if (!(await exists(resizedImagesDir))) {
      await fs.mkdir(resizedImagesDir);
    }

    const lastProcessedMarkerFilePath = path.join(
      resizedImagesDir,
      "lastProcessed"
    );
    let lastProcessedTime = new Date(0);
    if (await exists(lastProcessedMarkerFilePath)) {
      lastProcessedTime = (await fs.stat(lastProcessedMarkerFilePath)).mtime;
    }

    const potImages = await fs.readdir(potImagesDir, {
      withFileTypes: true,
    });
    for (const potImageEntry of potImages) {
      if (!potImageEntry.name.endsWith(".jpg")) {
        continue;
      }
      const potImageFileName = potImageEntry.name;
      const fullPath = path.join(potImagesDir, potImageFileName);
      const pathInfo = path.parse(fullPath);
      const modifiedTime = (await fs.stat(fullPath)).mtime;

      if (lastProcessedTime > modifiedTime) {
        // No changes since last time
        console.log(`Skipping ${potName}. No changes since last time.`);
        continue;
      }

      // Remove all resized pics for this file
      const resizedImages = (await fs.readdir(resizedImagesDir)).filter(
        (fileName) => fileName.startsWith(pathInfo.name)
      );
      for (const resizedImage of resizedImages) {
        const result = await fs.rm(path.join(resizedImagesDir, resizedImage), {
          force: true,
        });
      }

      const image = await Jimp.read(fullPath);

      const resizeImage = async (width) => {
        await image.resize(width, Jimp.AUTO);
        await image.writeAsync(
          `${resizedImagesDir}/${pathInfo.name}-${image.bitmap.width}x${image.bitmap.height}${pathInfo.ext}`
        );
      };

      await resizeImage(1000);
      await resizeImage(600);
      await resizeImage(300);
      await resizeImage(150);
    }

    await fs.writeFile(lastProcessedMarkerFilePath, new Date().toISOString());
    console.log(`Processed ${potName}.`);
  }

  /*
  for(const imagePath of images) {
    const pathInfo = path.parse(imagePath);
    const resizedFileDir = path.join(pathInfo.dir, ".resized");
    const processedMarkerFilePath = path.join(resizedFileDir, 'processed');
    console.log(processedMarkerFilePath);

    if (!fs.existsSync(resizedFileDir)) {
      await fs.mkdirSync(resizedFileDir);
    }

    const image = await Jimp.read(imagePath);
    const imageModifiedTime = fs.statSync(imagePath).mtime;
    
    let lastProcessedTime = new Date(0);
    if (fs.existsSync(processedMarkerFilePath)) {
      lastProcessedTime = fs.statSync(processedMarkerFilePath).mtime;
    }

    if (lastProcessedTime > imageModifiedTime) {
      

      const f = fs.openSync(processedMarkerFilePath, 'w');
      fs.closeSync(f);
    }
    console.log(`Processed ${imagePath}`);
  }
  */
})();
