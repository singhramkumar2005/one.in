import React from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

/**
 * Component to show permission status for a folder
 */
const PermissionStatus = ({ hasPermission, onRequestPermission }) => {
  if (hasPermission) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-start gap-3">
        <FiCheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-1">
            Folder Access Granted
          </h4>
          <p className="text-xs text-green-700 dark:text-green-300">
            You can play videos and view PDFs without needing to grant permission again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
      <div className="flex items-start gap-3 mb-3">
        <FiAlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
            Folder Access Required
          </h4>
          <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-2">
            To play videos and view PDFs, you need to grant access to the folder on your computer.
          </p>
        </div>
      </div>
      
      <button
        onClick={onRequestPermission}
        className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium transition-colors"
      >
        Grant Folder Access
      </button>

      <div className="mt-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <FiInfo className="h-4 w-4 text-yellow-700 dark:text-yellow-300 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-800 dark:text-yellow-200">
            <strong>Note:</strong> You only need to grant permission once. After that, you can access files anytime without being asked again.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PermissionStatus;
