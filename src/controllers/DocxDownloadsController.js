const fs = require("fs");
const path = require("path")
const knex = require("../database/knex");
const AppError = require("../utils/AppError");

// rever no front

class DocxDownloadsController {
  async show(request, response) {
    const document_id = request.params.id;

    const document = await knex("documents").where({ id: document_id }).first();

    const filePath = path.join(__dirname, "..", "..", "tmp", "documents", `${document.id} - ${document.title}.docx`);

    if(fs.existsSync(filePath)) {
      try {
        response.download(filePath, `${document.id} - ${document.title}.docx`);
        console.log("Arquivo baixado!")

      } catch {
        throw new AppError("Não foi possível fazer o download.")
      }

    } else {
      throw new AppError("Arquivo não encontrado", 404)
    }


    return response.status(201).json();
  };
};

module.exports = DocxDownloadsController;