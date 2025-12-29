import React from 'react';
import { showToast } from '../../ui';

/**
 * Hook for showing delete task confirmation toast
 */
export const useDeleteTaskToast = (
    taskName: string,
    onConfirm: () => void
) => {
    return () => {
        showToast.custom((t) => (
            <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 min-w-[280px] border border-gray-100 dark:border-gray-700`}>
                <div className="mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-base">Delete Task?</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Are you sure you want to delete <span className="font-semibold text-gray-700 dark:text-gray-300">"{taskName}"</span>? This action cannot be undone.
                    </p>
                </div>
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => showToast.dismiss(t.id)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            showToast.dismiss(t.id);
                            onConfirm();
                        }}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>
        ), {
            duration: 5000,
            position: "top-center"
        });
    };
};
