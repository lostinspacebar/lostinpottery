const fs = require('fs/promises');
const path = require('path');

(async () => {
  const files = await fs.readdir(path.join(process.cwd(), "public"));
  console.log(files);
})();