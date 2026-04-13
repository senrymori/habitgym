import { createContext, FC, PropsWithChildren, useContext } from 'react';
import { Database } from '@nozbe/watermelondb';
import { database } from '@db/database.ts';

const DatabaseContext = createContext<Database | undefined>(undefined);

export const DatabaseProvider: FC<PropsWithChildren> = function ({ children }) {
  return <DatabaseContext.Provider value={database}>{children}</DatabaseContext.Provider>;
};

export const useDatabase = (): Database => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
