
// "/https?://${domain}.${TLD}/${NEXT_PUBLIC_PROXY_PREFIX}" 형식의 기본 url을 반환한다.

export const getProxyBaseUrl: () => string = () => {
  if (!process.env.NEXT_PUBLIC_CLIENT_HOST) {
    throw new Error("NEXT_PUBLIC_CLIENT_HOST 환경변수가 설정되지 않았습니다.");
  }
  if (!process.env.NEXT_PUBLIC_PROXY_PREFIX) {
    throw new Error("NEXT_PUBLIC_PROXY_PREFIX 환경변수가 설정되지 않았습니다.");
  }
  return process.env.NEXT_PUBLIC_CLIENT_HOST + process.env.NEXT_PUBLIC_PROXY_PREFIX;
};
