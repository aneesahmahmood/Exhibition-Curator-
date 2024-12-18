/* eslint-disable react/prop-types */
import { X } from "lucide-react";

const ArtworkModal = ({ artwork, onClose }) => {
  if (!artwork) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {artwork.title}
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="aspect-[4/3] mb-6">
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Artist</h3>
              <p className="text-gray-600">{artwork.artist}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">Year</h3>
              <p className="text-gray-600">{artwork.year}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">Medium</h3>
              <p className="text-gray-600">{artwork.medium}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">Museum</h3>
              <p className="text-gray-600">{artwork.museum}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">Category</h3>
              <p className="text-gray-600">{artwork.category}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Description
              </h3>
              <p
                className="text-gray-600"
                dangerouslySetInnerHTML={{ __html: artwork.description }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkModal;
