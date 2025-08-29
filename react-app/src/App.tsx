import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './store/AuthContext';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { ArticlePage } from './pages/ArticlePage';
import { ProfilePage } from './pages/ProfilePage';
import { EditorPage } from './pages/EditorPage';
import { SettingsPage } from './pages/SettingsPage';
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
            <Route path="@:username" element={<ProfilePage />} />
            <Route path="@:username/favorites" element={<ProfilePage />} />
            <Route path="editor" element={<ProtectedRoute><EditorPage /></ProtectedRoute>} />
            <Route path="editor/:slug" element={<ProtectedRoute><EditorPage /></ProtectedRoute>} />
            <Route path="settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
