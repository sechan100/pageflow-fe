import { createDataContext } from "@/shared/context";
import { PublishedBook } from "./published-book";

export const [PublishedBookContextProvider, usePublishedBookContext] = createDataContext<PublishedBook>();