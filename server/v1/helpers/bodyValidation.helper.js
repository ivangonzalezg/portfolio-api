const Joi = require("@hapi/joi");
const httpStatus = require("./httpStatus.helper");

function getMessage(error = new Error("")) {
  return error.message.replace(`"${error.details[0].path[0]}"`, error.details[0].path[0]);
}

const schemas = {
  form: {
    send: Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      time: Joi.string().required(),
      budget: Joi.string().required(),
      message: Joi.string().allow("")
    })
  }
};

async function evaluateSchema(schema, req, res, next) {
  try {
    await schema.validateAsync(req.body);
    return next();
  } catch (error) {
    const message = getMessage(error);
    return res.status(400).json({ ...httpStatus["400"], message });
  }
}

module.exports = {
  form: {
    send: async (req, res, next) => evaluateSchema(schemas.form.send, req, res, next)
  }
};
