exports.up = knex => knex.schema.createTable("documents", table => {
  table.increments("id");
  table.integer("user_id").references("id").inTable("users");
  table.integer("template_id").references("id").inTable("templates");
  table.text("title").notNullable();

  table.enum("status", ["waiting", "concluded"], { useNative: true, enumName: "status"}).notNullable().default("waiting");

  table.timestamp("created_at").default(knex.fn.now());

});


exports.down = knex => knex.schema.dropTable("documents");