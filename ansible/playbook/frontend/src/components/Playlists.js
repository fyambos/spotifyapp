// src/components/Playlists.js

import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
// Define the GraphQL query to fetch playlists and their songs
const GET_PLAYLISTS = gql`
  query Playlists {
    playlists {
      id
      name
      spotify_id
      songs {
        id
        name
        spotify_id
      }
    }
  }
`;

// Component to fetch and display playlists
const Playlists = () => {
  const { loading, error, data } = useQuery(GET_PLAYLISTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <div className="App">
      <h1>Playlists</h1>
        
      {data.playlists.map(playlist => (
        <div key={playlist.id}>
          <h2>{playlist.name}</h2>
          <p>Spotify ID: {playlist.spotify_id}</p>
          <h3>Songs:</h3>
          {playlist.songs.length > 0 ? (
            <ul>
              {playlist.songs.map(song => (
                <li key={song.id}>
                  <Link to={`/song/${song.id}`}>{song.name}</Link> (Spotify ID: {song.spotify_id})
                </li>
              ))}
            </ul>
          ) : (
            <p>No songs available</p>
          )}
        </div>
      ))}
    </div>
  </div>
  );
};

export default Playlists;
