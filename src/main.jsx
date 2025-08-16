import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ApolloProvider } from '@apollo/client'
import { BrowserRouter } from 'react-router'
import client from './lib/apollo-client';
import { AuthProvider } from './contexts/AuthContext.jsx'
import Navbar from './components/Navbar.jsx'
import "./App.css";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <App />
        </BrowserRouter>
      </AuthProvider>
    </ApolloProvider>
  </StrictMode>,
)
