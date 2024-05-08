const fs = require("fs");
const path = require("path")
const knex = require("../database/knex");
const AppError = require("../utils/AppError");

const officegen = require("officegen");

// rever no front

class PDFDownloadsController {
  async show(request, response) {
    const document_id = request.params.id;

    const document = await knex("documents").where({ id: document_id }).first();

    const docxFilePath = path.join(__dirname, "..", "..", "tmp", "documents", `${document.id} - ${document.title}.docx`);
    const pdfFilePath = path.join(__dirname, "..", "..", "tmp", "documents", `${document.id} - ${document.title}.docx`);

    if(fs.existsSync(docxFilePath)) {
      try {
        const docx = officegen("docx");
        const pdf = fs.createWriteStream(pdfFilePath);

        docx.generate(pdf);

        response.download(pdfFilePath, `${document.title}.pdf`)

        console.log("Arquivo pdf baixado!");

      } catch {
        throw new AppError("Não foi possível fazer o download.")
      }

    } else {
      throw new AppError("Arquivo não encontrado", 404)
    }


    return response.status(201).json();
  };
};

module.exports = PDFDownloadsController;