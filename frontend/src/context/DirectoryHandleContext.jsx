import React, { createContext, useContext, useState } from 'react';

const DirectoryHandleContext = createContext();

export const useDirectoryHandle = () => {
  const context = useContext(DirectoryHandleContext);
  if (!context) {
    throw new Error('useDirectoryHandle must be used within DirectoryHandleProvider');
  }
  return context;
};

export const DirectoryHandleProvider = ({ children }) => {
  // Store directory handles by folder ID
  const [handles, setHandles] = useState({});

  const setHandle = (folderId, handle) => {
    setHandles(prev => ({
      ...prev,
      [folderId]: handle
    }));
  };

  const getHandle = (folderId) => {
    return handles[folderId] || null;
  };

  const clearHandle = (folderId) => {
    setHandles(prev => {
      const newHandles = { ...prev };
      delete newHandles[folderId];
      return newHandles;
    });
  };

  const clearAllHandles = () => {
    setHandles({});
  };

  return (
    <DirectoryHandleContext.Provider
      value={{
        setHandle,
        getHandle,
        clearHandle,
        clearAllHandles
      }}
    >
      {children}
    </DirectoryHandleContext.Provider>
  );
};
