export type StatusResponseDataType = {
  title: string;
  description: string;
};

export type StatusResponseType = {
  success?: StatusResponseDataType;
  error?: StatusResponseDataType;
};
