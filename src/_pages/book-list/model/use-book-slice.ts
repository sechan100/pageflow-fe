import { useCallback } from "react";
import { create } from "zustand";
import { getBooksApi } from "../api/get-books";
import { PublishedListBook } from "./published-list-book";



export type SortBy = "PUBLISHED_ASC" | "PUBLISHED_DESC";

const BOOK_SLICE_SIZE = 10;

export type BookSliceStore = {
  page: number;
  size: number;
  sortBy: SortBy;
  books: PublishedListBook[];
  isLoading: boolean;
}

export const useBookSlice = create<BookSliceStore>((set) => ({
  page: -1,
  size: BOOK_SLICE_SIZE,
  sortBy: "PUBLISHED_DESC",
  books: [],
  isLoading: false,
}));


export type BookSliceActions = {
  loadNextSlice: () => void;
  setSortBy: (sortBy: SortBy) => void;
}
export const useBookSliceActions = () => {

  const loadNextSlice = useCallback(async () => {
    const { page, size, sortBy, isLoading } = useBookSlice.getState();
    if (isLoading) return;
    useBookSlice.setState({ isLoading: true });
    const nextPage = page + 1;
    const newBooks = await getBooksApi(nextPage, size, sortBy);
    useBookSlice.setState(prev => ({
      page: nextPage,
      isLoading: false,
      books: [...prev.books, ...newBooks]
    }));
  }, []);

  const setSortBy = useCallback((sortBy: SortBy) => {
    useBookSlice.setState({
      page: -1,
      books: [],
      sortBy
    });
    loadNextSlice();
  }, [loadNextSlice]);

  return {
    loadNextSlice,
    setSortBy
  }
}