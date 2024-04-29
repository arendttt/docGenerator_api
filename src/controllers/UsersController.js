const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const sqliteConnection = require("../database/sqlite");

class UsersController {
  async create(request, response) {
    const { name, email, CNPJ, password } = request.body;

    const database = await sqliteConnection();

    const checkIfEmailExists = await database.get("SELECT * FROM users WHERE email = (?)", [ email ]);
    const checkIfCNPJExists = await database.get("SELECT * FROM users WHERE CNPJ = (?)", [ CNPJ ]);

    if(checkIfEmailExists) {
      throw new AppError("Este e-mail já está em uso.")
    };
    
    if (checkIfCNPJExists) {
      throw new AppError("CNPJ já cadastrado.")
    };

    if(!email || !CNPJ) {
      throw new AppError("Você precisa preencher o email e/ou CNPJ para prosseguir.")
    }

    const hashedPassword = await hash(password, 8);

    await database.run("INSERT INTO users (name, email, CNPJ, password) VALUES (?, ?, ?, ?)", [ name, email, CNPJ, hashedPassword ]);

    return response.status(201).json();
  };

};

module.exports = UsersController;
