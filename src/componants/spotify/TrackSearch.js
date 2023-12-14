import { useEffect, useState } from 'react';
import axios from 'axios';
const url = 'http://localhost:3001';

export const TrackSearch = ({ accessToken, artist, track }) => {
  const [trackData, setTrackData] = useState(null);

  useEffect(() => {
    const fetchTrackData = async () => {
      if (!accessToken) return;
      
      try {
        const response = await axios.get(url+'/api/track-search', {
          params: { accessToken, artist, track }
        });

        if (response.data) {
          setTrackData(response.data);
        }
      } catch (error) {
        console.error("Error fetching track data", error);
      }
    };

    fetchTrackData();
  }, [accessToken, artist, track]);

  return trackData;
};
