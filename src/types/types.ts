// return type of data coming from route api
interface MarkdownWithMetaDataType {
  _id: number;
  title: string;
  difficulty: number;
  str: string; // this is the actual prompt text that goes in the container
}

export interface ErrorType {
  message: any;
  status: number;
  location: string;
}

export interface UserType {
  _id: number | null;
  sub: string; // This is a unique key for each google acount
  picture: string; // html link to picture
  email: string;
  email_verified: boolean;
}

export interface MarkdownType {
  _id: number;
  str: string;
}

export type MarkdownsWithMetaDataType = MarkdownWithMetaDataType[];

export interface RoomType {
  _id: number;
  roomid: string;
  countusers: number;
  title: string;
  users: string;
}
