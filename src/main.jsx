import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ApolloProvider } from '@apollo/client'
import { BrowserRouter } from 'react-router'
import client from './lib/apolloClient';
import { AuthProvider } from './contexts/AuthContext.jsx'
import Navbar from './components/Navbar.jsx'
import "./index.css";
import { SnackbarProvider } from 'notistack'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <BrowserRouter>
            <Navbar />
            <App />
          </BrowserRouter>
        </SnackbarProvider>
      </AuthProvider>
    </ApolloProvider>
  </StrictMode>,
)
