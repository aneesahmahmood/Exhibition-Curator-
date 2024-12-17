import { useState, useEffect } from "react";
import ArtworkCard from "./ArtwordCard";
import ArtworkModal from "./ArtworkModal";
import { useArtStore } from "../store/useArtStore";

const ArtworkGrid = () => {
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const artworks = useArtStore((state) => state.filteredArtworks);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(artworks.length === 0);
  }, [artworks]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading artworks...</p>
      </div>
    );
  }

  if (artworks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No artworks found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {artworks.map((artwork) => (
          <ArtworkCard
            key={artwork.id}
            artwork={artwork}
            onViewDetails={setSelectedArtwork}
          />
        ))}
      </div>

      {selectedArtwork && (
        <ArtworkModal
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
        />
      )}
    </>
  );
};

export default ArtworkGrid;
