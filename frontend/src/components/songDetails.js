// src/components/songDetails.js
import React from 'react';
import { useParams } from 'react-router-dom';
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

const SongDetail = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_SONG_DETAILS, {
    variables: { id: parseInt(id, 10) },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { song } = data;

  return (
    <div>
      <h2>{song.name}</h2>
      <h3>Artists:</h3>
      <ul>
        {song.artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default SongDetail;
