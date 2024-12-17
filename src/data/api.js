import axios from 'axios';
const ARTIC_BASE_URL = 'https://api.artic.edu/api/v1';
const MET_BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1';

export async function fetchArtworks(page = 1, limit = 10, query = '') {
  const params = {
    page,
    limit,
    fields: 'id,title,artist_display,date_display,medium_display,description,thumbnail,image_id,department_title,classification_title'
  };

  if (query) {
    params.q = query;
  }

  const endpoint = query ? '/artworks/search' : '/artworks';
  const response = await axios.get(`${ARTIC_BASE_URL}${endpoint}`, { params });

  const { data, pagination } = response.data;
  return {
    data: data.map((artwork) => ({
      id: artwork.id,
      title: artwork.title || 'Untitled',
      artist: artwork.artist_display || 'Unknown Artist',
      year: artwork.date_display || 'Unknown Year',
      medium: artwork.medium_display || 'Unknown Medium',
      description: artwork.description || 'No description available',
      imageUrl: artwork.image_id 
        ? `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg` 
        : null,
      museum: 'Art Institute of Chicago',
      category: artwork.classification_title || 'Unknown Category',
    })),
    pagination: {
      current_page: page,
      total_pages: Math.ceil(pagination.total / limit)
    }
  };
}

export async function fetchMetArtworks(query = '') {
  if (!query) {
    return { data: [], pagination: { current_page: 1, total_pages: 1 } };
  }

  const searchResponse = await axios.get(`${MET_BASE_URL}/search`, {
    params: { q: query, hasImages: true }
  });

  const objectIDs = searchResponse.data.objectIDs || [];
  const limitedIDs = objectIDs.slice(0, 10); 

  const detailRequests = limitedIDs.map(id =>
    axios.get(`${MET_BASE_URL}/objects/${id}`)
  );

  const detailResponses = await Promise.all(detailRequests);

  const metArtworks = detailResponses.map((res) => {
    const obj = res.data;
    return {
      id: obj.objectID,
      title: obj.title || 'Untitled',
      artist: obj.artistDisplayName || 'Unknown Artist',
      year: obj.objectDate || 'Unknown Year',
      medium: obj.medium || 'Unknown Medium',
      description: obj.creditLine || 'No description available',
      imageUrl: obj.primaryImageSmall || null,
      museum: 'The Metropolitan Museum of Art',
                category: obj.classification || 'Unknown Category',
    };
  });

  return {
    data: metArtworks,
    pagination: {
      current_page: 1,
      total_pages: Math.ceil(objectIDs.length / 10)
    }
  };
}
