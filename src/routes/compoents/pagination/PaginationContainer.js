import React from "react";
import PaginationPresenter from "./PaginationPresenter";

const PaginationContainer = ({ totalPages, currentPage, onPageChange }) => {
  return (
    <PaginationPresenter
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={onPageChange}
    />
  );
};

export default PaginationContainer;
