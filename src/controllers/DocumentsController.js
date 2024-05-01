const knex = require("../database/knex");

class DocumentsController {
  async create(request, response) {
    const { 
      title, 
      status, 
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
    } = request.body;

    const user_id = request.user.id;

    const [ document_id ] = await knex("documents").insert({
      title, 
      status, 
      user_id
    });

    const insertDocumentFields = {
      document_id,
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
    }

    await knex("documentFields").insert(insertDocumentFields);

    return response.status(201).json();

  };

  // pesquisa pelo titulo do documento
  async index(request, response) {
    const { title } = request.query;

    let documents

    if(title) {
      documents = await knex("documents")
        .select([
          "documents.id",
          "documents.user_id",
          "documents.title",
          "documents.created_at"
        ])
        .whereLike("title", `%${title}%`)
        .orderBy("created_at")

  } 

    return response.status(201).json(documents);
  }

  // mostrar um documento especifico
  async show(request, response) {
    const { id } = request.params;

    const document = await knex("documents").where({ id }).first();
    let documentFields = await knex("documentFields")
      .where({ document_id: id })

    // filtrando para aparecer apenas o campos que não são nulos
    documentFields = documentFields.map(field => {
      const nonNullFields = {};
      for (let key in field) {
        if (field[key] !== null) {
          nonNullFields[key] = field[key];
        }
      }
      return nonNullFields;
    });

    return response.json({
      document,
      documentFields
    });
    
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("documents").where({ id }).delete();

    return response.json();
  };
};

module.exports = DocumentsController;