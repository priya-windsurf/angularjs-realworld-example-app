import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './store/AuthContext';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { ArticlePage } from './pages/ArticlePage';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<AuthPage />} />
            <Route path="register" element={<AuthPage />} />
            <Route path="article/:slug" element={<ArticlePage />} />
            <Route path="@:username" element={<div>Profile Page - Coming Soon</div>} />
            <Route path="@:username/favorites" element={<div>Profile Favorites - Coming Soon</div>} />
            <Route path="editor" element={<ProtectedRoute><div>Editor - Coming Soon</div></ProtectedRoute>} />
            <Route path="editor/:slug" element={<ProtectedRoute><div>Edit Article - Coming Soon</div></ProtectedRoute>} />
            <Route path="settings" element={<ProtectedRoute><div>Settings - Coming Soon</div></ProtectedRoute>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
