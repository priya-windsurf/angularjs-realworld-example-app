import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import EditorPage from './pages/EditorPage';
import ArticlePage from './pages/ArticlePage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<AuthPage type="login" />} />
            <Route path="/register" element={<AuthPage type="register" />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/editor" element={<EditorPage />} />
            <Route path="/editor/:slug" element={<EditorPage />} />
            <Route path="/article/:slug" element={<ArticlePage />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
            <Route path="/profile/:username/favorites" element={<ProfilePage tab="favorites" />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
