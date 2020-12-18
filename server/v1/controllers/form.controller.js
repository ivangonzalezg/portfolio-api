const Form = require("../models/form.model");
const httpStatus = require("../helpers/httpStatus.helper");
const getErrorParams = require("../helpers/getErrorParams.helper");
const mailerHelper = require("../helpers/mailer.helper");

exports.send = async (req, res) => {
  try {
    const { body } = req;
    new Form(body).save();
    await mailerHelper.form(body);
    return res.status(200).json({ ...httpStatus["200"] });
  } catch (error) {
    const { message, code } = getErrorParams(error);
    return res.status(code).json({ ...httpStatus[code], message });
  }
};
