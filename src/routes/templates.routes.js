const { Router } = require("express");
const multer = require("multer");
const templateUploadConfig= require("../configs/templateUploads");

const TemplateController = require("../controllers/TemplateController");

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const verifyUserAuthorization = require("../middlewares/verifyUserAuthorization");

const templatesRoutes = Router();

const upload = multer(templateUploadConfig.MULTER);

const templateController = new TemplateController();

templatesRoutes.use(ensureAuthenticated);

templatesRoutes.post("/", verifyUserAuthorization([ "admin", "staff "]), templateController.create);
templatesRoutes.patch("/templates/:id", verifyUserAuthorization([ "admin", "staff "]), upload.single("template_file"), templateController.update); 



module.exports = templatesRoutes;