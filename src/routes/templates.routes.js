const { Router } = require("express");
const multer = require("multer");
const templateUploadConfig= require("../configs/templateUploads");

const TemplateController = require("../controllers/TemplateController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const templatesRoutes = Router();

const upload = multer(templateUploadConfig.MULTER);

const templateController = new TemplateController();

templatesRoutes.use(ensureAuthenticated);

templatesRoutes.post("/", templateController.create);
templatesRoutes.patch("/templates/:id", upload.single("template_file"), templateController.update); 


module.exports = templatesRoutes;