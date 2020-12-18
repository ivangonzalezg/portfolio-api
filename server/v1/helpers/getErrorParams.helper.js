const {
  IdNotFound,
  WrongPassword,
  EmailNotFound,
  SamePassword,
  MissingId,
  MissingField,
  NotActived,
  AccessDenied,
  NoFile
} = require("./errors.helper");

const defaultMessage = "Error desconocido";

function getMongoErrorKey(errmsg) {
  const a = errmsg.split("index: ")[1];
  const b = a.split(" dup key")[0];
  const c = b.split("$")[1] || b;
  const d = c.split("_1")[0];
  return d;
}

module.exports = (error = {}) => {
  const { name, model, code = 500 } = error;
  if (!name) return { message: defaultMessage, code };
  switch (name) {
    case "ValidationError":
      return { ...error.errors[Object.keys(error.errors)[0]], code };
    case "MongoError":
      if (code === 11000) {
        const key = getMongoErrorKey(error.errmsg);
        if (key === "email") return { message: "Correo electrónico ya está en uso", code: 409 };
        return { message: `Error de clave duplicada: ${key}.`, code: 500 };
      }
      return { message: defaultMessage, code };
    case "CastError":
      if (model.modelName) return { message: `${model.modelName} no encontrado`, code };
      return { message: defaultMessage, code };
    case IdNotFound.name:
      return { message: "ID no encontrado", code };
    case WrongPassword.name:
      return { message: "Contraseña incorrecta", code };
    case EmailNotFound.name:
      return { message: "Correo electrónico no está registrado", code };
    case MissingId.name:
      return { message: "Id faltante", code };
    case MissingField.name:
      return { message: "Campos faltantes", code };
    case SamePassword.name:
      return { message: "No puedes usar la misma contraseña", code };
    case NotActived.name:
      return { message: "Tu cuenta no está activada. Contacta al administrador", code };
    case AccessDenied.name:
      return { message: "Acceso denegado", code };
    case NoFile.name:
      return { message: "Ningún archivo fue envíado", code };
    default:
      return { message: defaultMessage, code };
  }
};
