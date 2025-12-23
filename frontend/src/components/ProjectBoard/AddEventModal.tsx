import React from 'react';
import { X, Calendar, Clock, AlignLeft, Type, FileText } from 'lucide-react';

import type { AddEventModalProps } from '../../types';


import { useAddEventModal } from '../../hooks/projectboard/useAddEventModal';


const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, onClose, onAdd, onUpdate, projectId, event }) => {
  const {
    title, setTitle,
    eventType, setEventType,
    date, setDate,
    startTime, setStartTime,
    endTime, setEndTime,
    description, setDescription,
    isLoading,
    isEditMode,
    handleSubmit
  } = useAddEventModal({ onClose, onAdd, onUpdate, projectId, event });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            {isEditMode ? 'Edit Event' : 'Add Event in Calendar'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" disabled={isLoading}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
              <FileText size={16} className="text-gray-400" />
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all text-gray-700 placeholder-gray-400"
              disabled={isLoading}
            />
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
              <Type size={16} className="text-gray-400" />
              Event Type
            </label>
            <div className="relative">
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm appearance-none bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all cursor-pointer text-gray-700"
                disabled={isLoading}
              >
                <option value="MEETING">Meeting</option>
                <option value="HOLIDAY">Holiday</option>
                <option value="EVENT">Event</option>
                <option value="DEADLINE">Deadline</option>
                <option value="REMINDER">Reminder</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all text-gray-700"
              disabled={isLoading}
            />
          </div>

          {/* Time Range - Optional for holidays, required for other types */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                <Clock size={16} className="text-gray-400" />
                Start Time {eventType !== 'HOLIDAY' && <span className="text-red-500">*</span>}
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all text-gray-700"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                <Clock size={16} className="text-gray-400" />
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all text-gray-700"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
              <AlignLeft size={16} className="text-gray-400" />
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Enter about your event or meeting etc"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all resize-none placeholder-gray-400"
              disabled={isLoading}
            />
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-white border boundary-transparent hover:border-gray-200 rounded-lg transition-all"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>{isEditMode ? 'Saving...' : 'Adding...'}</span>
              </>
            ) : (
              <span>{isEditMode ? 'Save Changes' : 'Add Event'}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEventModal;

