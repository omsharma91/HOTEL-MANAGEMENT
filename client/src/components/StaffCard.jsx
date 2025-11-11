// src/components/StaffCard.jsx
export default function StaffCard({ staff }) {
  return (
    <div className="p-4 border rounded-lg shadow bg-white">
      <h3 className="text-lg font-semibold">{staff.name}</h3>
      <p className="text-gray-600">{staff.role}</p>
    </div>
  );
}
