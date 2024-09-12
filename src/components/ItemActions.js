"use client";

function ItemActions({ searchCategory, setSearchCategory, inStockOnly, setInStockOnly, onCreateNewItem }) {
  //* Här hanteras användarens input från sökfältet. Varje gång användaren skriver något i sökfältet uppdateras searchCategory-state, vilket sedan används för att filtrera resultaten baserat på kategori.
  const handleSearchChange = (e) => {
    setSearchCategory(e.target.value);
  };
  // e.target.value: Hämtar värdet som användaren skriver in i sökfältet.
  // setSearchCategory: Uppdaterar state-variabeln searchCategory med det nya värdet från sökfältet.

  //* Denna funktion uppdaterar om vi ska visa endast items som finns i lager. Genom att kontrollera om användaren har kryssat i rutan 'In Stock Only' uppdateras inStockOnly-state, och listan filtreras därefter.
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
