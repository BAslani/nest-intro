export interface Paginated<T> {
  data: T[];
  mata: {
    itemsPerpage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
  };
  links: {
    first: string;
    last: string;
    prev: string;
    next: string;
    current: string;
  };
}
