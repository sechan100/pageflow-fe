

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

const convertToLocalDateTime = (javaLocalDateTimeArray: number[]): LocalDateTime => {
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

const equalLocalDateTime = (a: LocalDateTime, b: LocalDateTime): boolean => {
  return a.year === b.year &&
    a.month === b.month &&
    a.day === b.day &&
    a.hour === b.hour &&
    a.minute === b.minute &&
    a.second === b.second &&
    a.nano === b.nano
}

const compareLocalDateTime = (a: LocalDateTime, b: LocalDateTime): number => {
  const getComparableValue = (date: LocalDateTime): number => {
    return date.year * 7 +
      date.month * 6 +
      date.day * 5 +
      date.hour * 4 +
      date.minute * 3 +
      date.second * 2 +
      date.nano * 1
  }
  const aValue = getComparableValue(a);
  const bValue = getComparableValue(b);
  return aValue - bValue;
}

export const LocalDateTimeService = {
  convert: convertToLocalDateTime,
  equalLocalDateTime,
  compareLocalDateTime: compareLocalDateTime,
  compare: (a: LocalDateTimeArray, b: LocalDateTimeArray): number => {
    return compareLocalDateTime(
      convertToLocalDateTime(a),
      convertToLocalDateTime(b)
    )
  }
}