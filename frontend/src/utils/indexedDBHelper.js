/**
 * IndexedDB Helper for persisting File System Access API handles
 * This allows folder permissions to persist across browser sessions
 */

const DB_NAME = 'BlinkExamLibrary';
const DB_VERSION = 1;
const STORE_NAME = 'folderHandles';

/**
 * Open or create the IndexedDB database
 */
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'folderId' });
      }
    };
  });
};

/**
 * Save a directory handle to IndexedDB
 * @param {string} folderId - Unique folder identifier
 * @param {FileSystemDirectoryHandle} directoryHandle - The directory handle to save
 * @param {string} folderName - Human-readable folder name
 */
export const saveDirectoryHandle = async (folderId, directoryHandle, folderName) => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const data = {
      folderId,
      directoryHandle,
      folderName,
      savedAt: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      const request = store.put(data);
      request.onsuccess = () => {
        console.log(`Saved directory handle for folder: ${folderName} (${folderId})`);
        resolve(true);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error saving directory handle:', error);
    throw error;
  }
};

/**
 * Get a directory handle from IndexedDB
 * @param {string} folderId - Unique folder identifier
 * @returns {Promise<FileSystemDirectoryHandle|null>}
 */
export const getDirectoryHandle = async (folderId) => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.get(folderId);
      request.onsuccess = () => {
        const result = request.result;
        if (result && result.directoryHandle) {
          console.log(`Retrieved directory handle for folder: ${result.folderName} (${folderId})`);
          resolve(result.directoryHandle);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error getting directory handle:', error);
    return null;
  }
};

/**
 * Check if we still have permission for a directory handle
 * @param {FileSystemDirectoryHandle} directoryHandle
 * @returns {Promise<boolean>}
 */
export const checkPermission = async (directoryHandle) => {
  try {
    const permission = await directoryHandle.queryPermission({ mode: 'read' });
    return permission === 'granted';
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
};

/**
 * Request permission for a directory handle
 * @param {FileSystemDirectoryHandle} directoryHandle
 * @returns {Promise<boolean>}
 */
export const requestPermission = async (directoryHandle) => {
  try {
    const permission = await directoryHandle.requestPermission({ mode: 'read' });
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting permission:', error);
    return false;
  }
};

/**
 * Get directory handle with automatic permission handling
 * @param {string} folderId - Unique folder identifier
 * @returns {Promise<FileSystemDirectoryHandle|null>}
 */
export const getDirectoryHandleWithPermission = async (folderId) => {
  try {
    // Try to get handle from IndexedDB
    const handle = await getDirectoryHandle(folderId);
    
    if (!handle) {
      console.log(`No saved handle found for folder: ${folderId}`);
      return null;
    }

    // Check if we still have permission
    const hasPermission = await checkPermission(handle);
    
    if (hasPermission) {
      console.log(`Permission already granted for folder: ${folderId}`);
      return handle;
    }

    // Try to request permission
    console.log(`Requesting permission for folder: ${folderId}`);
    const granted = await requestPermission(handle);
    
    if (granted) {
      console.log(`Permission granted for folder: ${folderId}`);
      return handle;
    }

    console.log(`Permission denied for folder: ${folderId}`);
    return null;
  } catch (error) {
    console.error('Error getting directory handle with permission:', error);
    return null;
  }
};

/**
 * Delete a directory handle from IndexedDB
 * @param {string} folderId - Unique folder identifier
 */
export const deleteDirectoryHandle = async (folderId) => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.delete(folderId);
      request.onsuccess = () => {
        console.log(`Deleted directory handle for folder: ${folderId}`);
        resolve(true);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error deleting directory handle:', error);
    throw error;
  }
};

/**
 * Get all stored folder IDs
 * @returns {Promise<string[]>}
 */
export const getAllFolderIds = async () => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.getAllKeys();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error getting all folder IDs:', error);
    return [];
  }
};

/**
 * Clear all stored directory handles
 */
export const clearAllDirectoryHandles = async () => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => {
        console.log('Cleared all directory handles');
        resolve(true);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error clearing directory handles:', error);
    throw error;
  }
};
