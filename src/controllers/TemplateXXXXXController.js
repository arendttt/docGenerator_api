const { createReport } = require("docx-templates");
const AppError = require("../utils/AppError");
const knex = require("../database/knex");
const fs = require("fs");


class TemplateController {
  async create(request, response) { 
    const document_id = request.params.id; // pegando id do doc dos parâmetros
    const user_id = request.user.id; // pegando o usuário do token
    const { title } = request.body; // pegando o titulo do modelo do corpo da requisição


    const document = await knex("documents").where({ id: document_id }).first();
    if(!document) {
      throw new AppError("Documento não encontrado!", 401);
    }

    const documentFields = await knex("documentFields");
    
    const template = await knex("templates");
    if(template.template_file){
      await templateDiskStorage.deleteFile(template.template_file);
    };











    // identificando o template
    const newTemplate = fs.readFileSync(`${templateFileName}.docx`); 
    // gerar o relatório dinâmico
    const buffer = await createReport({
      newTemplate,
      cmdDelimiter: ["{{", "}}"],
      data: {
        
      }
    });
    // gerando o arquivo word 
    fs.writeFileSync("converted.docx", buffer);



    
  };
};

module.exports = TemplateController;