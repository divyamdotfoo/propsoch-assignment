export type SearchBarProps = {
  onSearch?: (query: string) => void;
};

export function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <div className="flex items-center rounded-full border border-gray-300 bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Location Search */}
      <div className="flex-1 px-4 py-2 border-r border-gray-200">
        <label className="block text-xs font-medium text-gray-800">
          Location
        </label>
        <input
          type="text"
          placeholder="Search area, city..."
          className="w-full text-sm text-gray-600 placeholder-gray-400 focus:outline-none bg-transparent"
        />
      </div>

      {/* Property Type */}
      <div className="flex-1 px-4 py-2 border-r border-gray-200">
        <label className="block text-xs font-medium text-gray-800">
          Property Type
        </label>
        <input
          type="text"
          placeholder="Any type"
          className="w-full text-sm text-gray-600 placeholder-gray-400 focus:outline-none bg-transparent"
        />
      </div>

      {/* Budget */}
      <div className="flex-1 px-4 py-2">
        <label className="block text-xs font-medium text-gray-800">
          Budget
        </label>
        <input
          type="text"
          placeholder="Min - Max"
          className="w-full text-sm text-gray-600 placeholder-gray-400 focus:outline-none bg-transparent"
        />
      </div>

      {/* Search Button */}
      <button className="m-1.5 rounded-full bg-emerald-600 p-3 text-white hover:bg-emerald-700 transition-colors">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    </div>
  );
}
