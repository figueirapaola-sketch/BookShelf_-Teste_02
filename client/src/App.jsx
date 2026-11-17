import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import BooksCatalog from './pages/BooksCatalog';
import BookReader from './pages/BookReader';
import BookEditor from './pages/BookEditor';
import ArticlesFeed from './pages/ArticlesFeed';
import ArticleDetail from './pages/ArticleDetail';
import ArticleEditor from './pages/ArticleEditor';
import AuthorsList from './pages/AuthorsList';
import AuthorProfile from './pages/AuthorProfile';
import AdminDashboard from './pages/AdminDashboard';
import EditorialGuide from './pages/EditorialGuide';
import Register from './pages/Register';
import Login from './pages/Login';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-stone-50 text-stone-900 selection:bg-amber-200 selection:text-amber-900">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/books" element={<BooksCatalog />} />
              <Route path="/books/new" element={<BookEditor />} />
              <Route path="/books/:id/edit" element={<BookEditor />} />
              <Route path="/books/:id" element={<BookReader />} />
              <Route path="/articles" element={<ArticlesFeed />} />
              <Route path="/articles/new" element={<ArticleEditor />} />
              <Route path="/articles/:id/edit" element={<ArticleEditor />} />
              <Route path="/articles/:id" element={<ArticleDetail />} />
              <Route path="/authors" element={<AuthorsList />} />
              <Route path="/authors/:id" element={<AuthorProfile />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/editorial-guide" element={<EditorialGuide />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
