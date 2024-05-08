const { Router } = require("express");

const DocumentsController = require("../controllers/DocumentsController");
const DocxDownloadsController = require("../controllers/DocxDownloadsController");
const PDFDownloadsController = require("../controllers/PDFDownloadsController");
const DinamicFieldsController = require("../controllers/DinamicFieldsController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const documentsRoutes = Router();
const documentsController = new DocumentsController();
const dinamicFieldsController = new DinamicFieldsController();
const docxDownloadsController = new DocxDownloadsController();
const pdfDownloadsController = new PDFDownloadsController();

documentsRoutes.use(ensureAuthenticated);

documentsRoutes.post("/:id", documentsController.create);
documentsRoutes.get("/", documentsController.index);
documentsRoutes.get("/:id", documentsController.show);
documentsRoutes.delete("/:id", documentsController.delete);

documentsRoutes.post("/document/:id", dinamicFieldsController.create);

documentsRoutes.get("/download/:id", docxDownloadsController.show);

documentsRoutes.get("/pdf/:id", pdfDownloadsController.show);

module.exports = documentsRoutes;