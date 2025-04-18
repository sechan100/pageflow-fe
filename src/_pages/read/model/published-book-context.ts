import { PublishedBook } from '@/entities/book';
import { createDataContext } from "@/shared/context";

export const [PublishedBookContextProvider, usePublishedBookContext] = createDataContext<PublishedBook>();