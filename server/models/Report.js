const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    value: {
      type: String,
    },
    generatedBy: {
      type: String, // admin/staff user name or ID
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);


module.exports = mongoose.model("Report", reportSchema);
