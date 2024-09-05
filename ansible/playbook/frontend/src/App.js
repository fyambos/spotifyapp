import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import './App.css';
import SongDetails from './components/SongDetails';
import Playlists from './components/Playlists';
import { Routes, Route } from 'react-router-dom';

// Main App component
const App = () => {
  // Initialize Apollo Client with your GraphQL endpoint
  const client = new ApolloClient({
    uri: 'http://localhost:3000/graphql',
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <Routes>
            <Route path="/" element={<Playlists />} />
            <Route path="/song/:id" element={<SongDetails />} />
         </Routes>
    </ApolloProvider>
  );
};


export default App;
