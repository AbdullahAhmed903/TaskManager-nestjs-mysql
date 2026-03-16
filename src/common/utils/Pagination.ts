
export interface PaginationResult<T> {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  
}

export const getPaginationParams = (page?: number, limit?: number) => {
  const currentPage = Math.max(1, page || 1);
  const pageSize = Math.min(100, Math.max(1, limit || 10));
  const skip = (currentPage - 1) * pageSize;

  return {
    page: currentPage,
    limit: pageSize,
    skip,
    take: pageSize,
  };
};


export const createPaginationResult = <T>(
  total: number,
  page: number,
  limit: number,
): PaginationResult<T> => {
  const totalPages = Math.ceil(total / limit);

  return {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
  };
};