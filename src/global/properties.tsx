import { PlainApiResponse } from "@/shared/res/api-response";
import axios from "axios";
import { create } from "zustand";
import { getProxyBaseUrl } from "./proxy";
import { createStoreContext } from "@/shared/zustand/create-store-context";
import { useEffect, useState } from "react";




type ServerProperties = {
  user: {
    // refresh token 만료 기간
    refreshTokenExpireDays: number;

    // 아이디
    usernameMinLength: number;
    usernameMaxLength: number;
    usernameRegex: string;
    usernameRegexMessage: string;

    // 비밀번호
    passwordMinLength: number;
    passwordMaxLength: number;
    passwordRegex: string;
    passwordRegexMessage: string;

    // 필명
    pennameMinLength: number;
    pennameMaxLength: number;
    pennameRegex: string;
    pennameRegexMessage: string;
  }
}

/**
 * 서버가 응답하지 않음.
 */
class ServerNotResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ServerNotResponseError';
  }
}

/**
 * 서버에서 필요한 프로퍼티를 가져온다.
 */
const fetchServerProperties = async () => {
  try {
    const res = await axios.get<PlainApiResponse<ServerProperties>>(getProxyBaseUrl() + '/server-properties');
    const code = res.data.code;
    if (code === "SUCCESS") {
      return res.data.data;
    } else {
      throw new ServerNotResponseError(res.data.description);
    }
  } catch (Error) {
    // client가 최초로 전송하는 proxy api 요청이므로, 응답이 없으면 서버가 죽은겨
    throw new ServerNotResponseError('서버가 응답하지 않습니다.');
  }
}

export type ApplicationProperties = ServerProperties & {
  xUrl: string;
}

export const [Provider, useApplicationProperties] = createStoreContext<ServerProperties, ApplicationProperties>((serverProperties) => ({
  // 트위터(X) url
  xUrl: 'https://x.pageflow.com',
  ...serverProperties,
}));

type ApplicationPropertiesProviderProps = {
  children: React.ReactNode;
}
export const ApplicationPropertiesProvider = ({ children }: ApplicationPropertiesProviderProps) => {
  const [serverProperties, setServerProperties] = useState<ServerProperties | null>(null);

  useEffect(() => {
    fetchServerProperties().then(setServerProperties);
  }, []);

  if (!serverProperties) return <></>

  return (
    <Provider
      data={serverProperties}
      onDataChange={(store, data) => store.setState((prev) => ({ ...prev, ...data }))}
    >
      {serverProperties ? children : null}
    </Provider>
  )
}