function SortBy({ sortBy, sortDirection, onSortByChange, onSortDirectionChange }) {
  return (
    <div className="flex items-start gap-6 mb-6 flex-col sm:flex-row sm:items-center">
      <div className="flex items-center gap-2">
        <label htmlFor="sortBySelect" className="font-medium">Sort by:</label>
        <select
          id="sortBySelect"
          value={sortBy}
          onChange={e => onSortByChange(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 bg-white min-h-11"
        >
          <option value="createdAt">Creation Date</option>
          <option value="title">Title</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="sortDirectionSelect" className="font-medium">Order:</label>
        <select
          id="sortDirectionSelect"
          value={sortDirection}
          onChange={e => onSortDirectionChange(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 bg-white min-h-11"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
    </div>
  );
}

export default SortBy;