const Report = require("../models/Report");

// @desc   Fetch all reports
// @route  GET /api/reports
// @access Private (admin/staff)
const getReports = async (req, res) => {
  try {
    const reports = await Report.find({});
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc   Create a new report
// @route  POST /api/reports
// @access Private
const createReport = async (req, res) => {
  try {
    const { title, description, value, generatedBy } = req.body;

    const report = new Report({
      title,
      description,
      value,
      generatedBy,
    });

    const createdReport = await report.save();
    res.status(201).json(createdReport);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error: error.message });
  }
};

// @desc   Get single report by ID
// @route  GET /api/reports/:id
// @access Private
const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (report) {
      res.json(report);
    } else {
      res.status(404).json({ message: "Report not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc   Delete a report
// @route  DELETE /api/reports/:id
// @access Private
const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (report) {
      await report.remove();
      res.json({ message: "Report removed" });
    } else {
      res.status(404).json({ message: "Report not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Export all functions
module.exports = {
  getReports,
  createReport,
  getReportById,
  deleteReport,
};
