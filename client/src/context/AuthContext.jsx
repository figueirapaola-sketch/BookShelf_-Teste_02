import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('bookshelf_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [allAuthors, setAllAuthors] = useState([]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('bookshelf_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('bookshelf_user');
    }
  }, [currentUser]);

  // Load all registered authors from the real database
  const refreshAuthors = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setAllAuthors(data);
      }
    } catch (err) {
      console.error('Erro ao carregar autores:', err);
    }
  };

  useEffect(() => {
    refreshAuthors();
  }, [currentUser]);

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error('Falha na comunicação com o servidor.');
    }
    if (!res.ok) throw new Error(data.error || 'Falha no login');
    setCurrentUser(data.user);
    refreshAuthors();
    return data.user;
  };

  const register = async ({ name, email, password, role, bio = '', avatar = '', institution = '' }) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role, bio, avatar, institution })
    });
    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error('Falha na resposta do servidor.');
    }
    if (!res.ok) throw new Error(data.error || 'Erro ao registrar usuário');
    setCurrentUser(data.user);
    refreshAuthors();
    return data.user;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchUser = (userOrId) => {
    if (typeof userOrId === 'object') {
      setCurrentUser(userOrId);
    } else {
      const found = allAuthors.find((u) => u.id === Number(userOrId));
      if (found) setCurrentUser(found);
    }
  };

  const updateProfile = async (id, data) => {
    const res = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (res.ok && result.user) {
      if (currentUser?.id === Number(id)) {
        setCurrentUser(result.user);
      }
      refreshAuthors();
    }
    return result;
  };

  const isAdmin = currentUser?.role === 'admin';
  const isProfessor = currentUser?.role === 'professor';
  const isAuthor = currentUser?.role === 'author';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        isProfessor,
        isAuthor,
        allAuthors,
        login,
        register,
        logout,
        switchUser,
        updateProfile,
        refreshAuthors
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
