import { create } from 'zustand';
import { fetchArtworks, fetchMetArtworks } from '../data/api';

export const useArtStore = create((set) => ({
  artworks: [],
  filteredArtworks: [],
  favourites: [],
  museums: [],
  categories: [],
  filters: {
    museum: '',
    category: '',
    sortBy: '',
    searchQuery: '',
  },

  initFavourites: () => {
    const storedFavourites = JSON.parse(localStorage.getItem("favourites")) || [];
    set({ favourites: storedFavourites });
  },

  toggleFavourite: (artworkId) => {
    set((state) => {
      const isFav = state.favourites.includes(artworkId);
      const updatedFavourites = isFav
        ? state.favourites.filter((id) => id !== artworkId)
        : [...state.favourites, artworkId];

      localStorage.setItem("favourites", JSON.stringify(updatedFavourites));
      return { favourites: updatedFavourites };
    });
  },

  loadAllArtworks: async (query = '', limit = 9) => {
    try {
      const [chicagoResponse, metResponse] = await Promise.all([
        fetchArtworks(1, limit, query),
        fetchMetArtworks(query),
      ]);

      const combinedData = [...chicagoResponse.data, ...metResponse.data];
      const uniqueMuseums = [...new Set(combinedData.map((art) => art.museum))];
      const uniqueCategories = [...new Set(combinedData.map((art) => art.category))];

      set({
        artworks: combinedData,
        filteredArtworks: combinedData,
        museums: uniqueMuseums,
        categories: uniqueCategories,
      });
    } catch (error) {
      console.error("Failed to fetch combined artworks:", error);
    }
  },

  setFilters: (newFilters) => {
    set((state) => {
      const updatedFilters = { ...state.filters, ...newFilters };

      let filtered = state.artworks.filter((artwork) => {
        return Object.entries(updatedFilters).every(([key, value]) => {
          if (!value) return true; 
          if (key === 'sortBy' || key === 'searchQuery') return true; 
          return artwork[key] === value;
        });
      });

      if (updatedFilters.sortBy) {
        filtered.sort((a, b) => {
          switch (updatedFilters.sortBy) {
            case 'title':
              return a.title.localeCompare(b.title);
            case 'artist':
              return a.artist.localeCompare(b.artist);
            case 'year': {
              const yearA = parseInt(a.year.replace(/\D/g, '')) || 0;
              const yearB = parseInt(b.year.replace(/\D/g, '')) || 0;
              return yearA - yearB;
            }
            default:
              return 0;
          }
        });
      }

      if (updatedFilters.searchQuery?.trim()) {
        const query = updatedFilters.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (artwork) =>
            artwork.title.toLowerCase().includes(query) ||
            artwork.artist.toLowerCase().includes(query) ||
            artwork.museum.toLowerCase().includes(query)
        );
      }

      return {
        filters: updatedFilters,
        filteredArtworks: filtered,
      };
    });
  },

  resetFilters: () => {
    set((state) => ({
      filters: {
        museum: '',
        category: '',
        sortBy: '',
        searchQuery: '',
      },
      filteredArtworks: state.artworks,
    }));
  },
}));
