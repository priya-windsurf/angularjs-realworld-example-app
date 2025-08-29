import React, { ReactNode } from 'react';
import { useAuth } from '../store/AuthContext';

interface ShowAuthedProps {
  when: boolean;
  children: ReactNode;
}

export const ShowAuthed: React.FC<ShowAuthedProps> = ({ when, children }) => {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  if (when === isAuthenticated) {
    return <>{children}</>;
  }
  return null;
};
