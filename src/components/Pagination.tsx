import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalCount: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalCount,
    itemsPerPage,
    onPageChange,
}) => {
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    if (totalPages <= 1) return null;

    const pages = new Set<number>([1, totalPages]);

    // Calculate the central 3 pages window
    let start = Math.max(1, currentPage - 1);
    let end = Math.min(totalPages, currentPage + 1);

    // Shift window if at boundaries to show 3 if possible
    if (currentPage === 1) end = Math.min(totalPages, 3);
    if (currentPage === totalPages) start = Math.max(1, totalPages - 2);

    for (let i = start; i <= end; i++) {
        pages.add(i);
    }

    return (
        <div className="flex items-center justify-between px-2 py-4">
            <p className="text-sm text-[#617289] dark:text-slate-400">
                Showing {Math.min(itemsPerPage, totalCount)} of {totalCount} posts
            </p>
            <div className="flex gap-2">
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center w-10 h-10 rounded-lg border border-[#dbe0e6] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#617289] hover:bg-background-light dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>

                {Array.from(pages)
                    .sort((a, b) => a - b)
                    .map((page, index, array) => (
                        <React.Fragment key={page}>
                            {index > 0 && page !== array[index - 1] + 1 && (
                                <span className="flex items-center justify-center w-6 text-[#617289] font-bold">...</span>
                            )}
                            <button
                                onClick={() => onPageChange(page)}
                                className={`flex items-center justify-center w-10 h-10 rounded-lg font-bold transition-colors ${currentPage === page
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                        : 'border border-[#dbe0e6] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#617289] hover:bg-background-light dark:hover:bg-slate-800'
                                    }`}
                            >
                                {page}
                            </button>
                        </React.Fragment>
                    ))}

                <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center w-10 h-10 rounded-lg border border-[#dbe0e6] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#617289] hover:bg-background-light dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>
            </div>
        </div>
    );
};
