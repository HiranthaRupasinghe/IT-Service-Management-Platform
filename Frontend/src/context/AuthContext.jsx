import React, { createContext, useContext, useState } from 'react';
import { USERS, ROLES } from '../data/mockData';

const AuthContext = createContext(null);

export const DEMO_CREDENTIALS = [
  { username: 'SuperAdmin', password: '123', userId: 'U001', role: ROLES.SUPER_ADMIN, label: 'Super Admin' },
  { username: 'ITAdmin', password: '123', userId: 'U002', role: ROLES.IT_ADMIN, label: 'IT Admin' },
  { username: 'Sachin', password: '123', userId: 'U003', role: ROLES.TRAINEE, label: 'Intern (Sachin)' },
  { username: 'Hirantha', password: '123', userId: 'U004', role: ROLES.TRAINEE, label: 'Intern (Hirantha)' },
  { username: 'Shalom', password: '123', userId: 'U005', role: ROLES.TRAINEE, label: 'Intern (Shalom)' },
  { username: 'Savishka', password: '123', userId: 'U006', role: ROLES.TRAINEE, label: 'Intern (Savishka)' },
  { username: 'Intern', password: '123', userId: 'U003', role: ROLES.TRAINEE, label: 'Intern' },
  { username: 'ZoomRequester', password: '123', userId: 'U007', role: ROLES.ZOOM_REQUESTER, label: 'Zoom Requester' },
];

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  const login = (username, password) => {
    const trimmedUser = (username || '').trim().toLowerCase();
    const trimmedPass = (password || '').trim();

    if (trimmedPass === '123') {
      const cred = DEMO_CREDENTIALS.find(
        c => c.username.toLowerCase() === trimmedUser
      );
      if (cred) {
        const user = USERS.find(u => u.id === cred.userId);
        if (user) {
          setCurrentUser(user);
          return { success: true, user };
        }
      }

      const user = USERS.find(
        u => u.username.toLowerCase() === trimmedUser || u.name.toLowerCase() === trimmedUser
      );
      if (user) {
        setCurrentUser(user);
        return { success: true, user };
      }
    }

    return { success: false, error: 'Invalid username or password. Please check your credentials and try again.' };
  };

  const loginAs = (userId) => {
    const user = USERS.find(u => u.id === userId);
    if (user) setCurrentUser(user);
  };

  const logout = () => setCurrentUser(null);

  const hasPermission = (permission) => {
    if (!currentUser) return false;
    const perms = ROLE_PERMISSIONS[currentUser.role] || [];
    return perms.includes(permission) || perms.includes('*');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, loginAs, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: ['*'],
  [ROLES.IT_ADMIN]: [
    'view_assets', 'edit_assets', 'view_stock', 'manage_stock', 'view_tickets', 'create_tickets',
    'assign_tickets', 'update_tickets', 'view_repairs', 'manage_repairs', 'view_zoom', 'manage_zoom',
    'view_publication', 'manage_publication', 'view_tasks', 'create_tasks', 'assign_tasks',
    'update_tasks', 'view_users',
  ],
  [ROLES.TRAINEE]: [
    'view_assets', 'view_stock', 'view_tickets', 'update_tickets', 'request_reassignment',
    'view_zoom', 'view_tasks', 'update_tasks',
  ],
  [ROLES.ZOOM_REQUESTER]: ['submit_zoom', 'view_own_zoom'],
};
