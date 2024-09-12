"use client";

function ItemActions({ searchCategory, setSearchCategory, inStockOnly, setInStockOnly, onCreateNewItem }) {
  const handleSearchChange = (e) => {
    setSearchCategory(e.target.value);
  };

  const handleInStockChange = (e) => {
    setInStockOnly(e.target.checked);
  };

  return (
    <section className="w-full flex items-center justify-between p-4 bg-gray-200 mb-4 rounded">
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
        onClick={onCreateNewItem}  // Callback för att skapa nytt item
      >
        + Create Item
      </button>
    </section>
  );
}

export default ItemActions;
