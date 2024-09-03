// src/components/SongDetails.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';

const GET_SONG_DETAILS = gql`
  query GetSong($id: Int!) {
    song(id: $id) {
      id
      name
      artists {
        id
        name
      }
    }
  }
`;

const SongDetails = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_SONG_DETAILS, {
    variables: { id: parseInt(id, 10) },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Safeguard against missing data
  const song = data?.song || {};
  const artists = song.artists || [];

  return (
    <div className="App">
      <h2>{song.name || 'Unknown Song'}</h2>
      <h3>Artists:</h3>
      <ul>
        {artists.length > 0 ? (
          artists.map(artist => (
            <li key={artist.id}>{artist.name}</li>
          ))
        ) : (
          <p>No artists available</p>
        )}
      </ul>
      <Link to="/" className="return-button">Return to Playlists</Link>
    </div>
  );
};

export default SongDetails;
