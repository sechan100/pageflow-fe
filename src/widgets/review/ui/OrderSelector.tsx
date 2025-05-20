import { Selector, SelectorOption } from "@/shared/ui/Selector";
import { SxProps } from "@mui/material";
import { useCallback, useMemo } from "react";
import { ReviewOrderBy, useReviewsStore, useReviewsStoreActions } from "../model/use-reviews-store";

const orderByOptions: SelectorOption<ReviewOrderBy>[] = [
  { value: "latest", label: "최신순" },
  { value: "oldest", label: "오래된순" },
  { value: "score-asc", label: "평점 낮은순" },
  { value: "score-desc", label: "평점 높은순" },
];

type OrderSelectorProps = {
  sx?: SxProps;
}
export const OrderSelector = ({
  sx
}: OrderSelectorProps) => {
  const orderBy = useReviewsStore(s => s.orderBy);
  const { reorder } = useReviewsStoreActions();

  const currentOption = useMemo(() => {
    const option = orderByOptions.find(option => option.value === orderBy);
    if (!option) {
      throw new Error(`Invalid orderBy value: ${orderBy}`);
    }
    return option;
  }, [orderBy]);

  const handleChange = useCallback((newOrderBy: ReviewOrderBy) => {
    reorder(newOrderBy);
  }, [reorder]);

  return (
    <Selector
      title="정렬"
      option={currentOption}
      options={orderByOptions}
      onChange={handleChange}
    />
  );
}