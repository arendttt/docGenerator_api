const { createReport } = require("docx-templates");
const AppError = require("../utils/AppError");
const knex = require("../database/knex");
const fs = require("fs");

const TemplateDiskStorage = require("../providers/TemplateDiskStorage");

// logica para salvar endereço do arquivo no banco de dados - tabela template -> template_file
// logica para salvar todas as informações no banco de dados

class TemplateController {
  async create(request, response) { 
    const user_id = request.user.id; // pegando o usuário do token
    const { 
      title,  
      name, 
      marital_status, 
      occupation,
      identification_card,
      tax_id,
      street_address,
      number_address,
      district_address,
      supplement_address,
      zipcode_address,
      city_address,
      state_address,
      country_address,
      description,
      total_payment,
      payment_installments,
      total_payment_installments,
      payment_date 
    } = request.body; // pegando os dados da requisição
    //const templateFileName = request.file.filename; // pegando o nome do arquivo


    /*
    // para salvar o arquivo no banco
    const templateDiskStorage = new TemplateDiskStorage();
    const filename = await templateDiskStorage.saveFile(templateFileName);
    template.template_file = filename;
    */

    if(!title){
      throw new AppError("Preencha o titulo para prosseguir.")
    }
    
    // salvando os dados da tabela templates
    const [ template_id ] = await knex("templates").insert({
      user_id,
      title,
     // template_file: filename
    })

    const templateFieldsInsert = {
      template_id, 
      name, 
      marital_status, 
      occupation,
      identification_card,
      tax_id,
      street_address,
      number_address,
      district_address,
      supplement_address,
      zipcode_address,
      city_address,
      state_address,
      country_address,
      description,
      total_payment,
      payment_installments,
      total_payment_installments,
      payment_date
    };

    await knex("documentFields").insert(templateFieldsInsert);


    return response.status(201).json();











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

  // atualizar arquivo
  async update(request, response) {
    const template_id = request.params.id;
    const templateFileName = request.file.filename;

    const templateDiskStorage = new TemplateDiskStorage();

    const template = await knex("templates").where({ id: template_id }).first();

    if(!template) {
      throw new AppError("Template não encontrado.", 401);
    }

    if(template.template_file) {
      await templateDiskStorage.deleteFile(template.template_file);
    };

    const filename = await templateDiskStorage.saveFile(templateFileName);
    template.template_file = filename;

    await knex("templates").update({ template_file: filename }).where({ id: template_id });

    return response.json(template);

  }
};

module.exports = TemplateController;