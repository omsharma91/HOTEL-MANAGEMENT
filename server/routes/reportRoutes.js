const express = require("express");
const { getReports, createReport, getReportById, deleteReport } = require("../controllers/reportController");


const router = express.Router();

router.route("/")
  .get(getReports)     // GET all reports
  .post(createReport); // CREATE a new report

router.route("/:id")
  .get(getReportById)  // GET report by ID
  .delete(deleteReport); // DELETE report

module.exports = router;