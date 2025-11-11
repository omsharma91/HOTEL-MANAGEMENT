// src/components/ReportCard.jsx
export default function ReportCard({ report }) {
  return (
    <div className="p-4 border rounded-lg shadow bg-white">
      <h3 className="text-lg font-semibold">{report.title}</h3>
      <p className="text-gray-600">{report.description}</p>
      <p className="text-blue-600 font-medium mt-2">
        Value: {report.value}
      </p>
    </div>
  );
}
