exports.up = knex => knex.schema.createTable("documentFields", table => {
  table.increments("id");
  table.integer("document_id").references("id").inTable("documents").onDelete("CASCADE");

  table.text("name");
  table.text("marital_status");
  table.text("occupation");
  table.text("identification_card"); // RG
  table.text("tax_id"); // CPF
  table.text("street_address");
  table.text("number_address");
  table.text("district_address");
  table.text("supplement_address");
  table.text("zipcode_address");
  table.text("city_address");
  table.text("state_address");
  table.text("country_address");
  table.text("description"); 
  table.integer("total_payment"); // valor total
  table.integer("payment_installments"); // quantidade de parcelas
  table.integer("total_payment_installments"); // valor de cada parcela
  table.date("payment_date");

});

exports.down = knex => knex.schema.dropTable("documentFields");