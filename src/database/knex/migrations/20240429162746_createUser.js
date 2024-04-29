exports.up = knex => knex.schema.createTable("users", table => {
  table.increments("id");
  table.text("name").notNullable();
  table.text("email");
  table.text("CNPJ");
  table.text("password").notNullable();

  table.enum("role", ["admin", "staff", "client"], { useNative: true, enumName: "roles"}).notNullable().default("client");

  table.timestamp("created_at").default(knex.fn.now());
  table.timestamp("updated_at").default(knex.fn.now());

});


exports.down = knex => knex.schema.dropTable("users");