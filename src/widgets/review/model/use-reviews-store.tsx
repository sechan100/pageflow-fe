import { Review } from "@/entities/book";
import { useSessionQuery } from "@/entities/user";
import { useCallback, useEffect, useMemo } from "react";
import { create } from "zustand";


type ReviewOrderBy = "latest" | "oldest" | "score-asc" | "score-desc";

export type ReviewsStore = {
  reviews: Review[];
  canWriteReview: boolean;
  orderBy: ReviewOrderBy;
}
export const useReviewsStore = create<ReviewsStore>(() => ({
  reviews: [],
  canWriteReview: true,
  orderBy: "latest",
}));


const checkCanWriteReview = (uid: string, reviews: Review[]) => {
  const canWriteReview = reviews.find(r => r.writer.id === uid) === undefined;
  return canWriteReview;
}


type UseReviewsStoreActions = {
  updateCanWriteReview: () => boolean;
  addReview: (review: Review) => void;
  removeReview: (reviewId: string) => void;
  updateReview: (reviewId: string, updateFn: (current: Review) => Review) => void;
  reorder: (orderBy: ReviewOrderBy) => void;
}
export const useReviewsStoreActions = (): UseReviewsStoreActions => {
  const sessionQuery = useSessionQuery();
  const uid = useMemo<string | null>(() => {
    if (sessionQuery.data === undefined) return null;
    return sessionQuery.data.user.uid;
  }, [sessionQuery.data]);

  const updateCanWriteReview = useCallback(() => {
    const reviews = useReviewsStore.getState().reviews;
    if (uid === null) return false;
    const canWriteReview = checkCanWriteReview(uid, reviews);
    useReviewsStore.setState({ canWriteReview });
    return canWriteReview;
  }, [uid]);

  const reorder = useCallback((orderBy: ReviewOrderBy) => {
    const reviews = useReviewsStore.getState().reviews;
    const sortedReviews = [...reviews].sort((a, b) => {
      switch (orderBy) {
        // case "latest":
        //   return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        // case "oldest":
        //   return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        // case "score-asc":
        //   return a.score - b.score;
        // case "score-desc":
        //   return b.score - a.score;
        default:
          return 0;
      }
    });
    useReviewsStore.setState({
      orderBy,
      reviews: sortedReviews
    });
  }, []);

  const addReview = useCallback((review: Review) => {
    useReviewsStore.setState(s => ({
      reviews: [...s.reviews, review]
    }));
    reorder(useReviewsStore.getState().orderBy);
    updateCanWriteReview();
  }, [reorder, updateCanWriteReview]);

  const removeReview = useCallback((reviewId: string) => {
    useReviewsStore.setState(s => ({
      reviews: s.reviews.filter(r => r.id !== reviewId)
    }));
    updateCanWriteReview();
  }, [updateCanWriteReview]);

  const updateReview = useCallback((reviewId: string, updateFn: (current: Review) => Review) => {
    const reviews = useReviewsStore.getState().reviews;
    const newReviews = reviews.map(r => r.id === reviewId ? updateFn(r) : r);
    useReviewsStore.setState({
      reviews: newReviews
    });
    reorder(useReviewsStore.getState().orderBy);
    updateCanWriteReview();
  }, [reorder, updateCanWriteReview]);

  return {
    updateCanWriteReview,
    addReview,
    removeReview,
    updateReview,
    reorder
  }
}

type InitReviewsStoreConfigProps = {
  reviews: Review[];
}
export const InitReviewsStoreConfig = ({ reviews }: InitReviewsStoreConfigProps) => {
  const sessionQuery = useSessionQuery();

  useEffect(() => {
    if (sessionQuery.data === undefined) return;
    const uid = sessionQuery.data.user.uid;
    const canWriteReview = checkCanWriteReview(uid, reviews);
    useReviewsStore.setState({
      reviews,
      canWriteReview
    });
  }, [reviews, sessionQuery.data]);

  return <></>
}