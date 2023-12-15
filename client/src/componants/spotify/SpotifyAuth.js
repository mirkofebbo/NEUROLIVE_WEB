import { useEffect, useState } from 'react';
import axios from 'axios';

const url = 'http://localhost:3001';

export const SpotifyAuth = () => {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const response = await axios.post(url+'/api/token');

        if (response.data && response.data.accessToken) {
          setAccessToken(response.data.accessToken);
        }
      } catch (error) {
        console.error("Error fetching access token", error);
      }
    };

    fetchAccessToken();
  }, []);

  return accessToken;
};
