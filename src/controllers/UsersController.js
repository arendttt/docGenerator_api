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

    if(!email && !CNPJ) {
      throw new AppError("Você precisa preencher o email e/ou CNPJ para prosseguir.")
    }

    if(!password) {
      throw new AppError("Você precisa definir uma senha para prosseguir.")
    }

    const hashedPassword = await hash(password, 8);

    await database.run("INSERT INTO users (name, email, CNPJ, password) VALUES (?, ?, ?, ?)", [ name, email, CNPJ, hashedPassword ]);

    return response.status(201).json();
  };

  async update(request, response) {
    const { name, email, CNPJ, password, oldPassword } =  request.body;
    const { id } = request.params;

    const database = await sqliteConnection();

    const user = await database.get("SELECT * FROM users WHERE id = (?)", [ id ]);

    if(!user) {
      throw new AppError("Usuário não encontrado!")
    };

    const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [ email ]);
    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Este e-mail já está em uso!")
    };

    const userWithUpdatedCNPJ = await database.get("SELECT * FROM users WHERE CNPJ = (?)", [ CNPJ ]);
    if(userWithUpdatedCNPJ && userWithUpdatedCNPJ.id !== user.id) {
      throw new AppError("Este CNPJ já está cadastrado!")
    };

    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.CNPJ = CNPJ ?? user.CNPJ;

    if(password && oldPassword) {
      const checkOldPassword = await compare(oldPassword, user.password);

      if(!checkOldPassword) {
        throw new AppError("A senha antiga não confere!")
      };

      user.password = await hash(password, 8);
    }

    await database.run(`
      UPDATE users SET
      name = ?,
      email = ?,
      CNPJ = ?,
      password = ?,
      updated_at = DATETIME('now')
      WHERE id = ?`,
      [user.name, user.email, user.CNPJ, user.password, id]
    );

    return response.status(200).json();
  };
};

module.exports = UsersController;
