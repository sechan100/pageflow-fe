import { AccessToken } from "./AccessToken";


// accessToken 저장소 추상화
export interface AccessTokenStorage {
  store(accessToken: AccessToken): void;
  clear(): void;
  isTokenExist(): boolean;
  isTokenExpired(): boolean;
  getToken(): string;
}




// private property에 토큰을 저장하는 방식
class PrivatePropertyAccessTokenStorage implements AccessTokenStorage {

  #token: AccessToken | null = null;


  // storage에 새로운 토큰을 저장한다. 기존 토큰이 남아있다면 덮어쓴다.
  store(accessToken: AccessToken): void {
    this.#token = accessToken;
  }

  // Storage를 비운다
  clear(): void {
    this.#token = null;
  }

  // 토큰의 만료여부와 관계없이, 존재하는지만을 확인한다. 
  isTokenExist(): boolean {
    return this.#token ? true : false;
  }

  // 토큰의 만료 여부를 확인
  isTokenExpired(): boolean {
    if(!this.#token){
      throw new Error("accessToken이 존재하지 않습니다. exp를 확인할 수 없습니다.");
    }
    return Date.now() > this.#token.exp;
  }

  // 토큰을 반환
  getToken(): string {
    if(!this.#token){
      throw new Error("accessToken이 존재하지 않습니다. compact를 반환할 수 없습니다.");
    }
    return this.#token.compact;
  }
}


export { PrivatePropertyAccessTokenStorage }