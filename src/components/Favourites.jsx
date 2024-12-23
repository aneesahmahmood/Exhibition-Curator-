import { useArtStore } from "../store/useArtStore";
import ArtworkCard from "./ArtworkCard";

const Favourites = () => {
  const favourites = useArtStore((state) => state.favourites);
  const artworks = useArtStore((state) => state.artworks);
  const toggleFavourite = useArtStore((state) => state.toggleFavourite);

  const favouriteArtworks = artworks.filter((art) => favourites.includes(art.id));

  if (favouriteArtworks.length === 0) {
    return <div className="text-center py-8">No favourites yet.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {favouriteArtworks.map((art) => (
        <div key={art.id} className="relative">
          <ArtworkCard artwork={art} />
          <button
            className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
            onClick={() => toggleFavourite(art.id)}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default Favourites;
