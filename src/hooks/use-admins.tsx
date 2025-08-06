
'use client';

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

interface AdminsContextType {
  adminUids: string[];
  setAdminUids: Dispatch<SetStateAction<string[]>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const AdminsContext = createContext<AdminsContextType | undefined>(undefined);

export function AdminsProvider({ children }: { children: ReactNode }) {
  const [adminUids, setAdminUids] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const value = {
    adminUids,
    setAdminUids,
    isLoading,
    setIsLoading,
  };

  return (
    <AdminsContext.Provider value={value}>
      {children}
    </AdminsContext.Provider>
  );
}

export function useAdmins() {
  const context = useContext(AdminsContext);
  if (context === undefined) {
    throw new Error('useAdmins must be used within an AdminsProvider');
  }
  return context;
}
