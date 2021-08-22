export type GQLPresigenUrlParameters = Partial<{
  uploadParameters: {
    url: string;
    fields: {
      name: string;
      value: string;
    }[];
  };
  fileUrl: string;
}>;
