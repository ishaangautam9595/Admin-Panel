

import * as _ from 'underscore';

const PagerService = (totalItems: number, currentPage: number = 1, pageSize: number = 20): any => {
    // calculates total pages
    const totalPages = Math.ceil(totalItems / pageSize);
    let startPage: number;
    let endPage: number;

    if (totalPages <= 5) {
        startPage = 1;
        endPage = totalPages;
    } else {
        if (currentPage <= 3) {
            startPage = 1;
            endPage = 5;
        } else if (currentPage + 1 >= totalPages) {
            startPage = totalPages - 4;
            endPage = totalPages;
        } else {
            startPage = currentPage - 2;
            endPage = currentPage + 2;
        }
    }

    // calculates start and end item indexes
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // creates an array of pages to ng-repeat in the pager control
    const pages = _.range(startPage, endPage + 1);

    // returns object with all pager properties required by the view
    return {
        totalItems,
        currentPage,
        pageSize,
        totalPages,
        startPage,
        endPage,
        startIndex,
        endIndex,
        pages
    };
}

export default PagerService;