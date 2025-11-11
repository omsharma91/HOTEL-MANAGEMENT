// src/screens/StaffPage.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import StaffCard from "../components/StaffCard";
import { fetchStaff } from "../actions/staffAction";

export default function StaffPage() {
  const dispatch = useDispatch();
  const { loading, data: staff, error } = useSelector((state) => state.staff);

  useEffect(() => {
    dispatch(fetchStaff());
  }, [dispatch]);

  if (loading) return <p>Loading staff...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {staff.map((s) => (
        <StaffCard key={s.id} staff={s} />
      ))}
    </div>
  );
}
