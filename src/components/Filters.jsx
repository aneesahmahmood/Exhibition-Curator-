import { useState } from "react";
import {
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronDown,
} from "lucide-react";
import { useArtStore } from "../store/useArtStore";

const Filters = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { setFilters, resetFilters, filters, museums, categories } =
    useArtStore();

  const handleFilterChange = (key, value) => {
    setFilters({ [key]: value });
  };

  const handleReset = () => {
    resetFilters();
  };

  return (
    <div className="glass-effect rounded-xl p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-indigo-600" />
          <span className="text-gray-900 font-semibold">Filters & Sort</span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            className="text-sm text-indigo-600 hover:text-indigo-700"
            onClick={handleReset}
          >
            Reset All
          </button>
          <button
            className="md:hidden"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ChevronDown
              className={`h-5 w-5 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      <div
        className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${
          !isExpanded ? "hidden md:grid" : ""
        }`}
      >
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm text-gray-600">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Museum</span>
          </label>
          <select
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={filters.museum}
            onChange={(e) => handleFilterChange("museum", e.target.value)}
          >
            <option value="">All Museums</option>
            {museums.map((museum) => (
              <option key={museum} value={museum}>
                {museum}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm text-gray-600">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Category</span>
          </label>
          <select
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm text-gray-600">
            <ArrowUpDown className="h-4 w-4" />
            <span>Sort by</span>
          </label>
          <select
            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={filters.sortBy}
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
          >
            <option value="">Featured</option>
            <option value="title">Title</option>
            <option value="artist">Artist</option>
            <option value="year">Year</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Filters;
