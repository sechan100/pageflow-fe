import { StoreApi, UseBoundStore } from "zustand";


export type ZustandStore<T> = UseBoundStore<StoreApi<T>>;