const { createReport } = require("docx-templates");
const AppError = require("../utils/AppError");
const knex = require("../database/knex");
const fs = require("fs");
const path = require('path');

// pegar os campos do arquivo que está na pasta templates e substituir as informações

class DinamicFieldsController {
  async create(request, response) { 
    const document_id = request.params.id;

    // identificar template que o documento está utilizando
    const documentTemplate = await knex("documents").where({ id: document_id }).first();
    if(!documentTemplate) {
      throw new AppError("Documento não encontrando ou não associado à um template.")
    }

    // identificando o caminho do template na tabela templates
    const template = await knex("templates").where({ id: documentTemplate.template_id }).select("template_file").first();
    if(!template) {
      throw new AppError("Template não informado.")
    }

     // acessando os documentos na pasta templates
     const templatesFilePath = path.join(__dirname, "..", "..", "tmp", "uploads", "templates");
     function listFiles() {
       return fs.readdirSync(templatesFilePath) // lendo os documentos
     }
     const templateFiles = listFiles(); // listando os documentos lidos

     const matchingFile = templateFiles.find(file => file === template.template_file);
     if(!matchingFile) {
       throw new AppError("Arquivo não encontrado.")
     }

     // caminho do template
     const templateFilePath = path.join(templatesFilePath, matchingFile);
     // lendo o template 
     const newTemplate = fs.readFileSync(templateFilePath); 

     const docFields = await knex("documentFields").where({ id: document_id }).select("*").first();
   
    const buffer = await createReport({
      template: newTemplate,
      cmdDelimiter: ["{{", "}}"],
      data: {
        name: docFields.name,
        marital_status: docFields.marital_status,
        occupation: docFields.occupation,
        identification_card: docFields.identification_card,
        tax_id: docFields.tax_id,
        street_address: docFields.street_address,
        number_address: docFields.number_address,
        district_address: docFields.district_address,
        supplement_address: docFields.supplement_address,
        zipcode_address: docFields.zipcode_address,
        city_address: docFields.city_address,
        state_address: docFields.state_address,
        country_address: docFields.country_address,
        description: docFields.description,
        total_payment: docFields.total_payment,
        payment_installments: docFields.payment_installments,
        total_payment_installments: docFields.total_payment_installments,
        payment_date: docFields.payment_date
      }
    });

    const outputDocumentPath = path.join(__dirname, "..", "..", "tmp", "documents", `${documentTemplate.id} - ${documentTemplate.title}.docx`);

    fs.writeFileSync(outputDocumentPath, buffer);

    return response.status(201).json();
  }
  };

module.exports = DinamicFieldsController;