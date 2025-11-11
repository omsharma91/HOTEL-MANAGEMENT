import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchReports, generateReport } from "../actions/reportAction";
import ReportCard from "../components/ReportCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function ReportScreen() {
  const dispatch = useDispatch();
  const reportState = useSelector((state) => state.reports); // check reducer key
  const { loading, error, reports } = reportState;

  const [selectedMonth, setSelectedMonth] = useState(""); // month filter

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  // Filter reports by selected month
  const filteredReports = selectedMonth
    ? reports.filter((r) => {
        const month = new Date(r.createdAt).toISOString().slice(5, 7); // "01".."12"
        return month === selectedMonth;
      })
    : reports;

  // Prepare chart data: count reports per type
  const chartData = filteredReports.reduce((acc, curr) => {
    const found = acc.find((item) => item.title === curr.title);
    if (found) found.count += 1;
    else acc.push({ title: curr.title, count: 1 });
    return acc;
  }, []);

  const handleGenerateReport = () => {
    const newReport = {
      title: "Customer Report",
      description: "Shows customer activity",
      value: "Generated",
      generatedBy: "Admin",
    };
    dispatch(generateReport(newReport));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Reports</h2>

      <div className="flex items-center mb-4 gap-4">
        <button
          onClick={handleGenerateReport}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Generate Report
        </button>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">All Months</option>
          <option value="01">January</option>
          <option value="02">February</option>
          <option value="03">March</option>
          <option value="04">April</option>
          <option value="05">May</option>
          <option value="06">June</option>
          <option value="07">July</option>
          <option value="08">August</option>
          <option value="09">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
      </div>

      {/* Chart */}
      <div className="w-full h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="title" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#4ade80" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {loading && <p>Loading reports...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReports.map((report) => (
          <ReportCard key={report._id} report={report} />
        ))}
      </div>
    </div>
  );
}
