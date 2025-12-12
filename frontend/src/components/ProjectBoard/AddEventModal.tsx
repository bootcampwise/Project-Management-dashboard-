import React from 'react';
import { X, Calendar, Clock, AlignLeft, Type } from 'lucide-react';

import type { CalendarEvent } from '../../types';

import { useAddEventModal } from '../../hooks/useAddEventModal';

interface AddEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd?: (event: CalendarEvent) => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, onClose, onAdd }) => {
    const {
        eventType, setEventType,
        date, setDate,
        startTime, setStartTime,
        endTime, setEndTime,
        description, setDescription,
        handleSubmit
    } = useAddEventModal({ onClose, onAdd });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 flex flex-col max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Add Event in Calendar</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto space-y-5">

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
                            >
                                <option value="Meeting">Meeting</option>
                                <option value="Holiday">Holiday</option>
                                <option value="Event">Event</option>
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
                            Date
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all text-gray-700"
                        />
                    </div>

                    {/* Time Range */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                                <Clock size={16} className="text-gray-400" />
                                Start Time
                            </label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all text-gray-700"
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
                        />
                    </div>

                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-white border boundary-transparent hover:border-gray-200 rounded-lg transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm hover:shadow-md transition-all"
                    >
                        Add Event
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddEventModal;
