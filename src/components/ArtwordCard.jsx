/* eslint-disable react/prop-types */
import { useState } from "react";
import { Heart, Eye, Share2 } from "lucide-react";
import { useArtStore } from "../store/useArtStore";

const ArtworkCard = ({ artwork, onViewDetails }) => {
  const [isHovered, setIsHovered] = useState(false);
  const toggleFavourite = useArtStore((state) => state.toggleFavourite);
  const favourites = useArtStore((state) => state.favourites);
  const isFavourite = favourites.includes(artwork.id);

  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[4/3]">
        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent
                      transition-opacity duration-300 ${
                        isHovered ? "opacity-100" : "opacity-0 sm:opacity-0"
                      } 
                      opacity-100 sm:hover:opacity-100`}
        >
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
            <div className="flex space-x-2">
              <button
                className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                onClick={() => toggleFavourite(artwork.id)}
              >
                <Heart
                  className={`h-4 sm:h-5 w-4 sm:w-5 ${
                    isFavourite ? "fill-red-500 text-red-500" : "text-gray-700"
                  }`}
                />
              </button>
              <button
                className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                onClick={() => onViewDetails(artwork)}
              >
                <Eye className="h-4 sm:h-5 w-4 sm:w-5 text-gray-700" />
              </button>
              <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                <Share2 className="h-4 sm:h-5 w-4 sm:w-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
              {artwork.title}
            </h3>
            <p className="text-sm text-gray-600">{artwork.artist}</p>
          </div>
          <span className="px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full self-start">
            {artwork.category}
          </span>
        </div>
        <div className="mt-3 sm:mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">{artwork.museum}</p>
          <p className="text-sm font-medium text-gray-900">{artwork.year}</p>
        </div>
      </div>
    </div>
  );
};

export default ArtworkCard;
