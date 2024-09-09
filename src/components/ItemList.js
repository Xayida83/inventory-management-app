"use client"
import { useAuth } from "@/context/auth";

function ItemList({ item }) {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white p-6 mb-4">
      <div className="font-bold text-xl mb-2">{item.name}</div>
      
      <p className="text-gray-700 text-base">
        <span className="font-semibold">Description:</span> {item.description || "No description"}
      </p>
      <p className="text-gray-700 text-base">
        <span className="font-semibold">Category:</span> {item.category}
      </p>
      <p className="text-gray-700 text-base">
        <span className="font-semibold">Quantity:</span> {item.quantity}
      </p>

      {/* Knappar för att radera och redigera */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="text-blue-500 hover:text-blue-700"
          title="Edit item"
        >
          ✏️ {/* Edit icon */}
        </button>
        <button
          className="text-red-500 hover:text-red-700"
          title="Delete item"
        >
          🗑️ {/* Delete icon */}
        </button>
      </div>
    </div>
  );
}

export default ItemList;
