import { useState, useEffect } from 'react';

const API_URL = 'https://swapi.co/api';

const validResources = ['films', 'people', 'planets', 'species', 'starships', 'vehicles'];

function useSwap(resource, queryOptions = {}) {
  if (!validResources.includes(resource)) {
    throw new Error(`Invalid resource provided: ${resource}`);
  }

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id = null, page = 1, search = null } = queryOptions;

  useEffect(() => {
    (async () => {
      setLoading(true);

      let url;
      if (id) {
        url = `${API_URL}/${resource}/${id}/`;
      } else {
        const urlParams = new URLSearchParams();
        if (page) {
          urlParams.append('page', page);
        }

        if (search) {
          urlParams.append('search', search);
        }
        url = `${API_URL}/${resource}/?${urlParams}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setData(data);
      setLoading(false);
    })();
  }, [id, page, resource, search]);

  return {
    data,
    loading,
  };
}

export default useSwap;
