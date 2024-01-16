type Pagination = {
    skip: number,
    limit: number
}

export function getPagination(limit: number = 0, page: number = 0): Pagination {
    const limitAbs = Math.abs(+limit);
    const pageAbs = Math.abs(+page);

    return {
        skip: limitAbs * (pageAbs - 1),
        limit: limitAbs
    }
}