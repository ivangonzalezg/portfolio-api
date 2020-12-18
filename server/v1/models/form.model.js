const mongoose = require("mongoose");

const { Schema } = mongoose;

const formSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true
    },
    email: {
      type: Schema.Types.String,
      required: true,
      lowercase: true
    },
    time: {
      type: Schema.Types.String,
      required: true
    },
    budget: {
      type: Schema.Types.String,
      required: true
    },
    message: {
      type: Schema.Types.String
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

module.exports = mongoose.model("form", formSchema);
