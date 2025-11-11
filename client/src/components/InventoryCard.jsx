// src/components/InventoryCard.jsx
export default function InventoryCard({ item }) {
  return (
    <div className="p-4 border rounded-lg shadow bg-white">
      <h3 className="text-lg font-semibold">{item.name}</h3>
      <p className="text-gray-600">Quantity: {item.quantity}</p>
      <p className={item.quantity < 5 ? "text-red-500" : "text-green-600"}>
        {item.quantity < 5 ? "Low Stock" : "In Stock"}
      </p>
    </div>
  );
}
