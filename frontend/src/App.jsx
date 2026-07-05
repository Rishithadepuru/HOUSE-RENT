import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { RoleProvider } from './context/RoleContext';
import AppRoutes from './routes/AppRoutes';
import Navbar from './modules/common/Navbar';
import Footer from './modules/common/Footer';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <RoleProvider>
          <AuthProvider>
            <div className="app-container">
              <Navbar />
              <main className="main-content">
                <ErrorBoundary>
                  <AppRoutes />
                </ErrorBoundary>
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </RoleProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
