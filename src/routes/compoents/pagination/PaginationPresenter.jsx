import React from "react";
import "./Pagination.css";

const PaginationPresenter = ({ totalPages, currentPage, onPageChange }) => {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <nav className="pagination-container">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="pagination-button"
      >
        &lt;
      </button>
      {pages.map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => onPageChange(pageNum)}
          className={`pagination-button ${pageNum === currentPage ? "active" : ""}`}
        >
          {pageNum}
        </button>
      ))}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="pagination-button"
      >
        &gt;
      </button>
    </nav>
  );
};

export default PaginationPresenter;
