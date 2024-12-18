/* eslint-disable react/prop-types */
import { useState } from "react";
import { Search, Palette, BookMarked, Menu, X } from "lucide-react";
import { useArtStore } from "../store/useArtStore";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const searchArtworks = useArtStore((state) => state.searchArtworks);
  const favourites = useArtStore((state) => state.favourites);
  const artworks = useArtStore((state) => state.artworks);
  const favouriteArtworks = artworks.filter((art) =>
    favourites.includes(art.id)
  );

  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (e) => {
    const value = e.target.value.trim();
    setSearchValue(value);

    if (value) {
      searchArtworks(value);
    } else {
      useArtStore.getState().resetFilters();
    }
  };

  return (
    <header className="glass-effect sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Palette className="h-8 w-8 text-indigo-600" />

            <Link
              to="/"
              className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
            >
              ArtExplorer
            </Link>
          </div>

          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search artworks, artists, or museums..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl 
                         focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                         transition-all duration-200 bg-white/50 backdrop-blur-sm"
                value={searchValue}
                onChange={handleSearchChange}
              />
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/favourites"
              className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <BookMarked className="h-5 w-5" />
              <span>My Favourites ({favouriteArtworks.length})</span>
            </Link>
          </nav>

          <button
            className="md:hidden p-2 text-gray-600 hover:text-indigo-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl 
                       focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                       transition-all duration-200 bg-white/50 backdrop-blur-sm"
              value={searchValue}
              onChange={handleSearchChange}
            />
            <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/favourites"
                className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <BookMarked className="h-5 w-5" />
                <span>My Favourites ({favouriteArtworks.length})</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
