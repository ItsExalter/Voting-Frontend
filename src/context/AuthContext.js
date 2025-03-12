import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || null);

  const login = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    setUserRole(role);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}