"use client"

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth";
import ItemList from "@/components/ItemList";
import CreateItemModal from "@/components/CreateItemModal";

// export default function ItemsPage() {
//   const auth = useAuth();
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true); 
//   const [error, setError] = useState(null); 
//   const [searchCategory, setSearchCategory] = useState(""); // Sökterm för kategori
//   const [inStockOnly, setInStockOnly] = useState(false);   // Filter för items i lager

//   // Hämta items från API
//   useEffect(() => {
//     const fetchItems = async () => {
//       setLoading(true); // Start loading
//       setError(null); // Reset error

//       try {
//         const response = await fetch(
//           `http://localhost:3000/api/items?category=${searchCategory}&inStock=${inStockOnly}`,  // Passar kategorin och lagerstatus till API:et
//           {
//             headers: {
//               Authorization:
//                 "Bearer " + auth.token,
//                 "Content-Type": "application/json",
//             },
//           }
//         );
//         if (!response.ok) {
//           throw new Error(
//             "Failed to fetch items"
//           );
//         }

//         const data = await response.json();
//         setItems(data);
//       } catch (error) {
//         console.error("Error fetching items:", error);
//         setError(error.message);
//         setItems([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (auth.token) {
//       fetchItems();
//     }
//   }, [auth.token, searchCategory, inStockOnly]);

//   //* Hantera uppdateringen av item
//   const handleItemUpdated = (updatedItem) => {
//     setItems((prevItems) =>
//       prevItems.map((item) =>
//         item.id === updatedItem.id ? updatedItem : item
//       )
//     );
//   };


//   //* Hantera borttagning av item
//   const handleItemDeleted = (deletedItemId) => {
//     setItems((prevItems) =>
//       prevItems.filter((item) => item.id !== deletedItemId)
//     );
//   };

//   // Handle search input change
//   const handleSearchChange = (e) => {
//     setSearchCategory(e.target.value);
//   };

//   // Handle in-stock checkbox change
//   const handleInStockChange = (e) => {
//     setInStockOnly(e.target.checked);
//   };

//   return (
//     <main className="flex flex-col items-center justify-between p-24">
//       {/* Header section för sök, filter och skapa */}
//       <header className="w-full flex items-center justify-between p-4 bg-gray-200 mb-4 rounded">
//         <div className="flex w-fit items-center space-x-4">
//           {/* Sök kategori */}
//           <input
//             type="text"
//             placeholder="Search category"
//             value={searchCategory}
//             onChange={handleSearchChange}
//             className="p-2 border border-gray-400 rounded"
//           />

//           {/* Filtrering av i lager */}
//           <label className="flex items-center space-x-2">
//             <input
//               type="checkbox"
//               checked={inStockOnly}
//               onChange={handleInStockChange}
//             />
//             <span>In Stock Only</span>
//           </label>
//         </div>

//         {/* Skapa item knapp */}
//         <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700">
//           + Create Item
//         </button>
//       </header>

//       {/* Listan för items */}
//       <h1 className="text-3xl font-bold">Items List</h1>
//       <section className="flex w-full flex-col items-center justify-center">
//         {loading ? (
//           <p>Loading...</p>
//         ) : error ? (
//           <p>Error: {error}</p>
//         ) : items.length > 0 ? (
//           items.map((item) => (
//             <ItemList
//               key={item.id}
//               item={item}
//               onItemUpdated={handleItemUpdated} // Skicka callback för uppdatering
//               onItemDeleted={handleItemDeleted} // Skicka callback-funktion till ItemList
//             />
//           ))
//         ) : (
//           <p>No items found</p>
//         )}
//       </section>
//     </main>
//   );
// }

export default function ItemsPage() {
  const auth = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchCategory, setSearchCategory] = useState(""); // Sökterm för kategori
  const [inStockOnly, setInStockOnly] = useState(false);   // Filter för items i lager
  const [isModalOpen, setIsModalOpen] = useState(false);   // State för modal

  // Hämta items från API
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true); // Start loading
      setError(null); // Reset error

      try {
        const response = await fetch(
          `http://localhost:3000/api/items?category=${searchCategory}&inStock=${inStockOnly}`,  // Passar kategorin och lagerstatus till API:et
          {
            headers: {
              Authorization: "Bearer " + auth.token,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch items");
        }

        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Error fetching items:", error);
        setError(error.message);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    if (auth.token) {
      fetchItems();
    }
  }, [auth.token, searchCategory, inStockOnly]);

  //* Hantera uppdateringen av item
  const handleItemUpdated = (updatedItem) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      )
    );
  };

  //* Hantera borttagning av item
  const handleItemDeleted = (deletedItemId) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.id !== deletedItemId)
    );
  };

  //* Hantera skapandet av ett nytt item
  const handleItemCreated = (newItem) => {
    setItems((prevItems) => [...prevItems, newItem]); // Lägg till det nya itemet i listan
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchCategory(e.target.value);
  };

  // Handle in-stock checkbox change
  const handleInStockChange = (e) => {
    setInStockOnly(e.target.checked);
  };

  return (
    <main className="flex flex-col items-center justify-between p-24">
      {/* Header section för sök, filter och skapa */}
      <header className="w-full flex items-center justify-between p-4 bg-gray-200 mb-4 rounded">
        <div className="flex w-fit items-center space-x-4">
          {/* Sök kategori */}
          <input
            type="text"
            placeholder="Search category"
            value={searchCategory}
            onChange={handleSearchChange}
            className="p-2 border border-gray-400 rounded"
          />

          {/* Filtrering av i lager */}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={handleInStockChange}
            />
            <span>In Stock Only</span>
          </label>
        </div>

        {/* Skapa item knapp */}
        <button
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
          onClick={() => setIsModalOpen(true)}  // Öppna modalen när knappen klickas
        >
          + Create Item
        </button>
      </header>

      {/* Listan för items */}
      <h1 className="text-3xl font-bold">Items List</h1>
      <section className="flex w-full flex-col items-center justify-center">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : items.length > 0 ? (
          items.map((item) => (
            <ItemList
              key={item.id}
              item={item}
              onItemUpdated={handleItemUpdated} // Skicka callback för uppdatering
              onItemDeleted={handleItemDeleted} // Skicka callback-funktion till ItemList
            />
          ))
        ) : (
          <p>No items found</p>
        )}
      </section>

      {/* Modalen för att skapa ett nytt item */}
      {isModalOpen && (
        <CreateItemModal
          onClose={() => setIsModalOpen(false)}  // Stäng modalen
          onItemCreated={handleItemCreated}      // Skicka callback-funktion när ett item skapas
        />
      )}
    </main>
  );
}