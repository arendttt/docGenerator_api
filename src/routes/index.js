const usersRoutes = require("./users.routes");
const sessionsRoutes = require("./sessions.routes");
const documentsRoutes = require("./documents.routes");

const { Router } = require("express");

const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/sessions", sessionsRoutes);
routes.use("/documents", documentsRoutes);

module.exports = routes;