import React from 'react';
import { Search, CheckCircle2, User, SortAsc, Calendar, LayoutGrid } from 'lucide-react';
import type { SearchPopupProps } from '../types';



const SearchPopup: React.FC<SearchPopupProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 bg-black/20 backdrop-blur-[1px]" onClick={onClose}>
            <div
                className="w-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                    <Search className="text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search, run a command or ask a question..."
                        className="flex-1 outline-none text-gray-700 placeholder:text-gray-400 text-[15px]"
                        autoFocus
                    />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded text-gray-600 text-sm hover:border-gray-300 transition-colors">
                        <SortAsc size={14} />
                        <span>Sort</span>
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded text-blue-600 text-sm hover:bg-blue-100 transition-colors">
                        <User size={14} />
                        <span>Created by: Yauhen Rymaszewski</span>
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded text-gray-600 text-sm hover:border-gray-300 transition-colors">
                        <LayoutGrid size={14} />
                        <span>Projects</span>
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded text-gray-600 text-sm hover:border-gray-300 transition-colors">
                        <Calendar size={14} />
                        <span>Date</span>
                    </button>
                </div>

                {/* Recent Section */}
                <div className="py-2">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500">Recent</div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {/* Item 1 */}
                        <div className="px-4 py-3 flex items-start gap-3 hover:bg-gray-50 cursor-pointer group">
                            <div className="mt-0.5 text-gray-400 group-hover:text-blue-500">
                                <CheckCircle2 size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium text-gray-900 truncate">Contact customers with failed new payents or who churned</h4>
                                    <img src="https://i.pravatar.cc/150?u=a" className="w-5 h-5 rounded-full" alt="User" />
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">Dev/Directions-2 days ago</p>
                            </div>
                        </div>

                        {/* Item 2 */}
                        <div className="px-4 py-3 flex items-start gap-3 hover:bg-gray-50 cursor-pointer group">
                            <div className="mt-0.5 text-gray-400 group-hover:text-blue-500">
                                <CheckCircle2 size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium text-gray-900 truncate">Reporting: Design concept of visual dashboard</h4>
                                    <img src="https://i.pravatar.cc/150?u=b" className="w-5 h-5 rounded-full" alt="User" />
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">Marketing2 days ago</p>
                            </div>
                        </div>

                        {/* Item 3 */}
                        <div className="px-4 py-3 flex items-start gap-3 hover:bg-gray-50 cursor-pointer group">
                            <div className="mt-0.5 text-gray-400 group-hover:text-blue-500">
                                <CheckCircle2 size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium text-gray-900 truncate">Task detail modal: ideas</h4>
                                    <img src="https://i.pravatar.cc/150?u=c" className="w-5 h-5 rounded-full" alt="User" />
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">Dev / Directions - 2 days ago</p>
                            </div>
                        </div>

                        {/* Item 4 */}
                        <div className="px-4 py-3 flex items-start gap-3 hover:bg-gray-50 cursor-pointer group">
                            <div className="mt-0.5 text-gray-400 group-hover:text-blue-500">
                                <CheckCircle2 size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium text-gray-900 truncate">Add Projects to templates and layouts [draft 2025]</h4>
                                    {/* No avatar for this one in example or generic */}
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">Landing [empty] - 2 days ago</p>
                            </div>
                        </div>

                        {/* Item 5 */}
                        <div className="px-4 py-3 flex items-start gap-3 hover:bg-gray-50 cursor-pointer group">
                            <div className="mt-0.5 text-gray-400 group-hover:text-blue-500">
                                <CheckCircle2 size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium text-gray-900 truncate">Reporting: Design concept of visual dashboard</h4>
                                    <img src="https://i.pravatar.cc/150?u=d" className="w-5 h-5 rounded-full" alt="User" />
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">QA progress 2 days ago</p>
                            </div>
                        </div>

                        {/* Item 6 */}
                        <div className="px-4 py-3 flex items-start gap-3 hover:bg-gray-50 cursor-pointer group">
                            <div className="mt-0.5 text-gray-400 group-hover:text-blue-500">
                                <CheckCircle2 size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium text-gray-900 truncate">Help Docs: update screenshot</h4>
                                    {/* No avatar */}
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">Design drafts - 2 days ago</p>
                            </div>
                        </div>

                        {/* Item 7 */}
                        <div className="px-4 py-3 flex items-start gap-3 hover:bg-gray-50 cursor-pointer group">
                            <div className="mt-0.5 text-gray-400 group-hover:text-blue-500">
                                <CheckCircle2 size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium text-gray-900 truncate">Reporting: Design concept of visual dashboard</h4>
                                    {/* No avatar */}
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">Dev/Directions-2 days ago</p>
                            </div>
                        </div>


                    </div>
                </div>

                {/* Footer */}
                <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">Select <kbd className="font-sans px-1 bg-white border border-gray-200 rounded">↵</kbd></span>
                        <span className="flex items-center gap-1">Open <kbd className="font-sans px-1 bg-white border border-gray-200 rounded">Ctrl</kbd> + <kbd className="font-sans px-1 bg-white border border-gray-200 rounded">↵</kbd></span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SearchPopup;
