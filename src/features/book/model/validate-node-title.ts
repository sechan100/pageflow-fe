

type ErrorString = string | null;

export const validateNodeTitle = (title: string): ErrorString => {
  if(title.length < 1) {
    return '제목을 입력해주세요.';
  }
  return null;
}