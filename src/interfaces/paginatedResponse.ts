import Pagination from "./pagination";

export default interface PaginatedResponse<T> {
  response: T[],
  pagination: Pagination
}