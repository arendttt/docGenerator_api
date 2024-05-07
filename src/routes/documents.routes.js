const { Router } = require("express");

const DocumentsController = require("../controllers/DocumentsController");
const DinamicFieldsController = require("../controllers/DinamicFieldsController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const documentsRoutes = Router();
const documentsController = new DocumentsController();
const dinamicFieldsController = new DinamicFieldsController();

documentsRoutes.use(ensureAuthenticated);

documentsRoutes.post("/:id", documentsController.create);
documentsRoutes.get("/", documentsController.index);
documentsRoutes.get("/:id", documentsController.show);
documentsRoutes.delete("/:id", documentsController.delete);

documentsRoutes.post("/document/:id", dinamicFieldsController.create);

module.exports = documentsRoutes;