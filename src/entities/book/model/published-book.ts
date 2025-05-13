import { LocalDateTimeArray } from "@/shared/local-date-time";
import { SimpleBook } from './book';
import { ReadableToc } from "./readable-toc";
import { Review } from "./review";



export type PublishedRecord = {
  printingCount: number;
  edition: number;
  publishedAt: LocalDateTimeArray;
}


export type AuthorProfile = {
  id: string;
  penname: string;
  profileImageUrl: string;
  books: SimpleBook[];
  bio: string;
}

export type PublishedBook = {
  id: string;
  title: string;
  coverImageUrl: string;
  description: string;
  publishedRecords: PublishedRecord[];
  authorProfile: AuthorProfile;
  toc: ReadableToc;
  reviews: Review[];
  totalCharCount: number;
}