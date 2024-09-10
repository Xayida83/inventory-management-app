"use client"; // Ensure this is a client component

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth";
import ItemList from "@/components/ItemList";

export default function ItemsPage() {
  const auth = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true); // Start loading
      setError(null); // Reset error

      try {
        const response = await fetch(
          "http://localhost:3000/api/items",
          {
            headers: {
              Authorization:
                "Bearer " + auth.token,
                "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error(
            "Failed to fetch items"
          );
        }

        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error(
          "Error fetching items:",
          error
        );
        setError(error.message);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    if (auth.token) {
      fetchItems();
    }
  }, [auth.token]);

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <h1 className="text-3xl font-bold">
        Items List
      </h1>
      <section className="flex flex-col items-center justify-center gap-4">
        {items.length > 0 ? (
          items.map((item) => (
            <ItemList key={item.id} item={item} />
          ))
        ) : (
          <p>No items found</p>
        )}
      </section>
    </main>
  );
}
