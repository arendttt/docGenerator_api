const usersRoutes = require("./users.routes");
const sessionsRoutes = require("./sessions.routes");
const documentsRoutes = require("./documents.routes");
const templatesRoutes = require("./templates.routes");

const { Router } = require("express");

const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/sessions", sessionsRoutes);
routes.use("/documents", documentsRoutes);
routes.use("/templates", templatesRoutes);

module.exports = routes;