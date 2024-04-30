const knex = require("../database/knex");
const AppError = require("../utils/AppError");

const { compare } = require("bcryptjs");

const authConfig = require("../configs/auth");

const { sign } = require("jsonwebtoken");

class SessionsController {
  async create(request, response) {
    const { email, CNPJ, password } = request.body;

    let userQuery = knex("users");
    if(email) {
      userQuery = userQuery.where({ email });
    } else if (CNPJ) {
      userQuery = userQuery.where({ CNPJ });
    };
    const user = await userQuery.first();

    if(!user) {
      throw new AppError("E-mail, CNPJ e/ou senha incorretos!", 401);
    };

    const passwordMatched = await compare(password, user.password);
    if(!passwordMatched) {
      throw new AppError("E-mail, CNPJ e/ou senha incorretos!", 401);
    };

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({ role: user.role }, secret, {
      subject: String(user.id),
      expiresIn
    });

    console.log(user);

    return response.json({ user, token })

  }
};

module.exports = SessionsController;