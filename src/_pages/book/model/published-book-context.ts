import { PublishedBook } from '@/entities/book';
import { createDataContext } from "@/shared/zustand/create-data-context";

export const [PublishedBookContextProvider, usePublishedBookContext] = createDataContext<PublishedBook>();