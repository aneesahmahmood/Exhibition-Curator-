import { create } from "zustand";
import { fetchArtworks, fetchMetArtworks } from "../data/api";

export const useArtStore = create((set) => ({
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

  loadAllArtworks: async (query = "", limit = 9) => {
    try {
      const [chicagoResponse, metResponse] = await Promise.all([
        fetchArtworks(1, limit, query),
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
    } catch (error) {
      console.error("Failed to fetch artworks:", error);
      set({ artworks: [], filteredArtworks: [], museums: [], categories: [] });
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
}));
