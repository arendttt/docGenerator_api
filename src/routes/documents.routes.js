const { Router } = require("express");

const DocumentsController = require("../controllers/DocumentsController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const documentsRoutes = Router();
const documentsController = new DocumentsController();

documentsRoutes.use(ensureAuthenticated);

documentsRoutes.post("/", documentsController.create);
documentsRoutes.get("/", documentsController.index);
documentsRoutes.get("/:id", documentsController.show);
documentsRoutes.delete("/:id", documentsController.delete);

module.exports = documentsRoutes;