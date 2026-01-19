"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    showFirstLast?: boolean;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    showFirstLast = false,
}: PaginationProps) {
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 7;

        if (totalPages <= maxVisible) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            if (currentPage > 3) {
                pages.push("...");
            }

            // Show pages around current page
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push("...");
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    };

    const pages = getPageNumbers();

    return (
        <div className="flex items-center justify-center gap-3">
            {/* Previous Button */}
            <Button
                variant="secondary"
                size="medium"
                shape="circular"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <ChevronLeft className="size-5" strokeWidth={2.5} />
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
                {showFirstLast && currentPage > 3 && (
                    <Button
                        variant="ghost"
                        size="medium"
                        shape="rounded"
                        onClick={() => onPageChange(1)}
                    >
                        First
                    </Button>
                )}

                {pages.map((page, index) =>
                    typeof page === "number" ? (
                        <Button
                            key={index}
                            variant={page === currentPage ? "primary" : "ghost"}
                            size="medium"
                            shape="circular"
                            onClick={() => onPageChange(page)}
                        >
                            {page}
                        </Button>
                    ) : (
                        <span
                            key={index}
                            className="px-2 text-gray-400 select-none font-medium"
                        >
                            {page}
                        </span>
                    )
                )}

                {showFirstLast && currentPage < totalPages - 2 && (
                    <Button
                        variant="ghost"
                        size="medium"
                        shape="rounded"
                        onClick={() => onPageChange(totalPages)}
                    >
                        Last
                    </Button>
                )}
            </div>

            {/* Next Button */}
            <Button
                variant="secondary"
                size="medium"
                shape="circular"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <ChevronRight className="size-5" strokeWidth={2.5} />
            </Button>
        </div>
    );
}

export function PaginationInfo({
    currentPage,
    pageSize,
    totalCount,
}: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
}) {
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalCount);

    return (
        <p className="text-[15px] text-gray-700">
            Showing{" "}
            <span className="font-semibold text-gray-900">
                {start}–{end}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">
                {totalCount.toLocaleString()}
            </span>
        </p>
    );
}

