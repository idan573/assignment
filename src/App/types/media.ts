export type PresigenUrlParameters = Partial<{
  presignedUrl: string;
  endpoint: string;
  headers: {
    [key: string]: string;
  };
}>;
