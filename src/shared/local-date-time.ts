

export type LocalDateTimeArray = [number, number, number, number, number, number, number]

export type LocalDateTime = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

export const convertToLocalDateTime = (javaLocalDateTimeArray: number[]): LocalDateTime => {
  const [year, month, day, hour, minute, second, nano] = javaLocalDateTimeArray;
  return {
    year,
    month,
    day,
    hour,
    minute,
    second,
    nano
  }
}