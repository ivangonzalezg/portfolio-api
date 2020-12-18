const IdNotFound = { name: "IdNotFound", code: 404 };
const WrongPassword = { name: "WrongPassword", code: 401 };
const EmailNotFound = { name: "EmailNotFound", code: 404 };
const MissingId = { name: "MissingId", code: 400 };
const MissingField = { name: "MissingField", code: 400 };
const SamePassword = { name: "SamePassword", code: 409 };
const NotActived = { name: "NotActived", code: 400 };
const AccessDenied = { name: "AccessDenied", code: 403 };
const NoFile = { name: "NoFile", code: 400 };

module.exports = {
  IdNotFound,
  WrongPassword,
  EmailNotFound,
  SamePassword,
  MissingId,
  MissingField,
  NotActived,
  AccessDenied,
  NoFile
};
