function FilterInput({ filterTerm, onFilterChange }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <label htmlFor="filterInput" className="font-medium">Search todos:</label>
      <input
        id="filterInput"
        type="text"
        value={filterTerm}
        onChange={e => onFilterChange(e.target.value)}
        placeholder="Search by title..."
        className="border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 min-h-11"
      />
    </div>
  );
}
export default FilterInput;