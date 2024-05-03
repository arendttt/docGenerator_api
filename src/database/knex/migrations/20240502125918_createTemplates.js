exports.up = knex => knex.schema.createTable("templates", table => {
  table.increments("id");
  table.integer("user_id").references("id").inTable("users"); // usuário que criou o template
  table.text("title").notNullable();
  table.text("template_file");

  table.timestamp("created_at").default(knex.fn.now());

});


exports.down = knex => knex.schema.dropTable("templates");