const router = require("express-promise-router")();
const form = require("../controllers/form.controller");
const bodyValidation = require("../helpers/bodyValidation.helper");

router.route("/send").post(bodyValidation.form.send, form.send);

module.exports = router;
