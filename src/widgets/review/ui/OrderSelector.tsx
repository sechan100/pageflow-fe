import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, SxProps } from "@mui/material";
import { useCallback } from "react";
import { ReviewOrderBy, useReviewsStore, useReviewsStoreActions } from "../model/use-reviews-store";

const orderByOptions = [
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

  const handleChange = useCallback((event: SelectChangeEvent) => {
    const value = event.target.value as ReviewOrderBy;
    reorder(value);
  }, [reorder]);

  return (
    <Box>
      <FormControl>
        <InputLabel id="review-order-by-select-label">정렬</InputLabel>
        <Select
          labelId="review-order-by-select-label"
          value={orderBy}
          label="Order By"
          onChange={handleChange}
        >
          {orderByOptions.map(({ value, label }) => (
            <MenuItem key={value} value={value}>{label}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}