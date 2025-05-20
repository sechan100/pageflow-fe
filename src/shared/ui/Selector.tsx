import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, SxProps } from "@mui/material";
import { useCallback, useId } from "react";

const orderByOptions = [
  { value: "latest", label: "최신순" },
  { value: "oldest", label: "오래된순" },
  { value: "score-asc", label: "평점 낮은순" },
  { value: "score-desc", label: "평점 높은순" },
];

export type SelectorOption<T> = {
  label: string;
  value: T;
}
type SelectorProps<T> = {
  option: SelectorOption<T>;
  options: SelectorOption<T>[];
  title: string;
  onChange: (value: T) => void;
  sx?: SxProps;
}
export const Selector = <T,>({
  onChange,
  option,
  options,
  title,
  sx
}: SelectorProps<T>) => {
  const id = useId();

  const handleChange = useCallback((event: SelectChangeEvent) => {
    const value = event.target.value as T;
    onChange(value);
  }, [onChange]);

  return (
    <Box sx={sx}>
      <FormControl>
        <InputLabel id={id}>{title}</InputLabel>
        <Select
          labelId={id}
          value={String(option.value)}
          label={option.label}
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