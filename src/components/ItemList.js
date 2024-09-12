"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth";

function ItemList({
  item,
  onItemUpdated,
  onItemDeleted,
}) {
  // Inkludera onItemUpdated som en prop
  const auth = useAuth();
  const [isEditing, setIsEditing] = useState(
    false
  ); // State för edit-läge
  const [editedItem, setEditedItem] = useState({
    ...item,
  }); // State för redigerad item

  // Funktion för att hantera redigeringsläge
  const handleEditClick = () => {
    setIsEditing(true); // Sätt komponenten i redigeringsläge
  };

  // Funktion för att hantera ändringar i input-fält
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedItem((prevItem) => ({
      ...prevItem,
      [name]: name === "quantity" ? Number(value) : value
    }));
  };
  
  // Funktion för att spara ändringar
  const handleSave = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/items/${item.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedItem), // Skickar det redigerade itemet
        }
      );
      
      if (!response.ok) {
        throw new Error("Failed to update item");
      }

      const updatedItem = await response.json();

      // Uppdatera item i parent-komponenten
      if (onItemUpdated) {
        onItemUpdated(updatedItem); // Skicka det uppdaterade itemet tillbaka till parent
      } else {
        console.error(
          "onItemUpdated is not defined"
        );
      }

      console.log("Item updated successfully");
      setIsEditing(false); // Avsluta redigeringsläget
    } catch (error) {
      console.error(
        "Error updating item:",
        error
      );
    }
  };

  // Funktion för att radera ett item
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/items/${item.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      console.log("Item deleted successfully");

      // Om item raderats, informera parent-komponenten
      if (onItemDeleted) {
        onItemDeleted(item.id); // Passera vidare information om borttaget item till parent
      }
    } catch (error) {
      console.error(
        "Error deleting item:",
        error
      );
    }
  };

  return (
    <div className="flex w-full rounded overflow-hidden shadow-lg bg-white p-6 m-2">
      {isEditing ? (
        // Redigeringsläge: visa input-fält för redigering
        <>
          <input
            type="text"
            name="name"
            value={editedItem.name}
            onChange={handleInputChange}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            name="description"
            value={editedItem.description}
            onChange={handleInputChange}
            className="border p-2 mb-2 w-full"
            placeholder="Description"
          />
          <input
            type="text"
            name="category"
            value={editedItem.category}
            onChange={handleInputChange}
            className="border p-2 mb-2 w-full"
            placeholder="Category"
          />
          <input
            type="number"
            min="0"
            name="quantity"
            value={editedItem.quantity}
            onChange={handleInputChange}
            className="border p-2 mb-2 w-full"
            placeholder="Quantity"
          />
          <button
            className="text-green-500 hover:text-green-700 mr-2"
            onClick={handleSave}>
            Save
          </button>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </>
      ) : (
        // Visa item-information om inte i redigeringsläge
        <>
        <div className="flex w-full items-center justify-between mt-4 gap-4">
          <ul className="flex w-full justify-between">
            <li key={item.id} className="font-bold text-xl w-fit">
              {item.name}
            </li>
            <li key={`${item.id}-description`} className="text-gray-700 text-base w-fit">
              <p className="font-semibold">Description:</p> {item.description || "No description"}
            </li>
            <li key={`${item.id}-category`} className="text-gray-700 text-base w-fit">
              <p className="font-semibold">Category:</p> {item.category}
            </li>
            <li key={`${item.id}-quantity`} className="text-gray-700 text-base w-fit">
              <p className="font-semibold">Quantity:</p> {item.quantity}
            </li>
          </ul>

          {/* Knappar för att radera och redigera */}
          <div className="flex w-fit items-center gap-4">
            <button
              className="text-blue-500 hover:text-blue-700"
              title="Edit item"
              onClick={handleEditClick} // Starta redigeringsläge
            >
              ✏️ {/* Edit icon */}
            </button>
            <button
              className="text-red-500 hover:text-red-700"
              title="Delete item"
              onClick={handleDelete}>
              🗑️ {/* Delete icon */}
            </button>
          </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ItemList;
