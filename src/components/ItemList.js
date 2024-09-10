"use client"

import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";

// function ItemList({ item }) {
//   return (
//     <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white p-6 mb-4">
//       <div className="font-bold text-xl mb-2">{item.name}</div>
      
//       <p className="text-gray-700 text-base">
//         <span className="font-semibold">Description:</span> {item.description || "No description"}
//       </p>
//       <p className="text-gray-700 text-base">
//         <span className="font-semibold">Category:</span> {item.category}
//       </p>
//       <p className="text-gray-700 text-base">
//         <span className="font-semibold">Quantity:</span> {item.quantity}
//       </p>

//       {/* Knappar för att radera och redigera */}
//       <div className="flex justify-between items-center mt-4">
//         <button
//           className="text-blue-500 hover:text-blue-700"
//           title="Edit item"
//         >
//           ✏️ {/* Edit icon */}
//         </button>
//         <button
//           className="text-red-500 hover:text-red-700"
//           title="Delete item"
//         >
//           🗑️ {/* Delete icon */}
//         </button>
//       </div>
//     </div>
//   );
// }

// export default ItemList;

function ItemList({ item, onItemDeleted  }) {
  const auth = useAuth();
  const router = useRouter();

  //* Funktion för att radera ett item
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/items/${item.id}`, {
        method: "DELETE", 
        headers: {
          Authorization: `Bearer ${auth.token}`,  
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete item");
      }
      console.log("Item deleted successfullly");

       // Om item raderats, informera parent-komponenten
      if (onItemDeleted) {
        onItemDeleted(item.id);  // Passera vidare information om borttaget item till parent
      }
    } catch (error) {
      console.error("Error deleteing item: ", error);
    }
  };

  //* Funktion för att navigera till redigeringssidan
  const handleEdit = () => {
    // Navigera användaren till redigeringssidan för detta item
    //TODO gör en sida för att ändra en item
    router.push(`/items/edit/${item.id}`);
  };

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
        <button className="text-blue-500 hover:text-blue-700" title="Edit item" onClick={handleEdit}>
          ✏️ {/* Edit icon */}
        </button>
        <button className="text-red-500 hover:text-red-700" title="Delete item" onClick={handleDelete}>
          🗑️ {/* Delete icon */}
        </button>
      </div>
    </div>
  );
}

export default ItemList;