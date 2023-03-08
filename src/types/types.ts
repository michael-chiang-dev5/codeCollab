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

export type MarkdownsWithMetaDataType = MarkdownWithMetaDataType[];
