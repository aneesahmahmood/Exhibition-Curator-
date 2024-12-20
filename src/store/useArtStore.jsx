import { create } from "zustand";
import { fetchArtworks, fetchMetArtworks } from "../data/api";

export const useArtStore = create((set, get) => ({
  artworks: [],
  filteredArtworks: [],
  favourites: [],
  loading: false,
  filters: {
    museum: "",
    category: "",
    sortBy: "",
    searchQuery: "",
  },
  museums: [],
  categories: [],

  initFavourites: () => {
    const storedFavourites =
      JSON.parse(localStorage.getItem("favourites")) || [];
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

  loadAllArtworks: async (query = "", limit = 9, page = 1) => {
    try {
      const [chicagoResponse, metResponse] = await Promise.all([
        fetchArtworks(page, limit, query),
        fetchMetArtworks(query),
      ]);

      const combinedData = [...chicagoResponse.data, ...metResponse.data];
      const uniqueMuseums = [...new Set(combinedData.map((art) => art.museum))];
      const uniqueCategories = [
        ...new Set(combinedData.map((art) => art.category)),
      ];

      set({
        artworks: combinedData,
        filteredArtworks: combinedData,
        museums: uniqueMuseums,
        categories: uniqueCategories,
      });

      return {
        pagination: chicagoResponse.pagination,
      };
    } catch (error) {
      console.error("Failed to fetch artworks:", error);
      set({ artworks: [], filteredArtworks: [], museums: [], categories: [] });
      return {
        pagination: { current_page: 1, total_pages: 1 },
      };
    }
  },

  searchArtworks: async (query) => {
    set({ loading: true });
    if (!query) {
      set((state) => ({
        filteredArtworks: state.artworks,
        filters: { ...state.filters, searchQuery: "" },
        loading: false,
      }));
      return;
    }

    try {
      const [chicagoResponse, metResponse] = await Promise.all([
        fetchArtworks(1, 9, query),
        fetchMetArtworks(query),
      ]);

      const combinedData = [...chicagoResponse.data, ...metResponse.data];

      const filteredResults = combinedData.filter((artwork) => {
        const lowerQuery = query.toLowerCase();
        const title = artwork.title ? artwork.title.toLowerCase() : "";
        const artist = artwork.artist ? artwork.artist.toLowerCase() : "";
        const museum = artwork.museum ? artwork.museum.toLowerCase() : "";

        return (
          title.includes(lowerQuery) ||
          artist.includes(lowerQuery) ||
          museum.includes(lowerQuery)
        );
      });

      set({
        filteredArtworks: filteredResults,
        filters: { searchQuery: query },
        loading: false,
      });
    } catch (error) {
      console.error("Error during search:", error);
      set({ filteredArtworks: [], loading: false });
    }
  },

  resetFilters: () => {
    set((state) => ({
      filters: {
        museum: "",
        category: "",
        sortBy: "",
        searchQuery: "",
      },
      filteredArtworks: state.artworks,
    }));
  },

  sortArtworks: () => {
    const { filteredArtworks, filters } = get();
    let sortedArtworks = [...filteredArtworks]; // Shallow copy

    if (filters.sortBy) {
      sortedArtworks.sort((a, b) => {
        if (filters.sortBy === "title") {
          return a.title.localeCompare(b.title);
        } else if (filters.sortBy === "artist") {
          return a.artist.localeCompare(b.artist);
        } else if (filters.sortBy === "year") {
          return (
            parseInt(a.year) - parseInt(b.year) || a.year.localeCompare(b.year)
          );
        }
        return 0;
      });
    }

    set({ filteredArtworks: sortedArtworks });
  },

  setFilters: (newFilters) => {
    set((state) => {
      const updatedFilters = { ...state.filters, ...newFilters };

      // Apply filters
      let filteredResults = state.artworks.filter((artwork) => {
        const matchesMuseum =
          !updatedFilters.museum || artwork.museum === updatedFilters.museum;
        const matchesCategory =
          !updatedFilters.category ||
          artwork.category === updatedFilters.category;

        return matchesMuseum && matchesCategory;
      });

      return {
        filters: updatedFilters,
        filteredArtworks: filteredResults,
      };
    });
    get().sortArtworks();
  },
}));
