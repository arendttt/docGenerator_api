const fs = require("fs");
const path = require("path");

const templateUploadConfig = require("../configs/templateUploads");

class TemplateDiskStorage {
  async saveFile(file){

    await fs.promises.rename(
      path.resolve(templateUploadConfig.TMP_FOLDER, file),
      path.resolve(templateUploadConfig.UPLOADS_FOLDER, file)
    );

    return file;

  };

  async deleteFile(file){

    const filePath = path.resolve(templateUploadConfig.UPLOADS_FOLDER, file);

    try {
      await fs.promises.stat(filePath) // verificando se existe arquivo

    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  };
  
};

module.exports = TemplateDiskStorage;