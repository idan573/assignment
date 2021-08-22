export type GQLStylistAttributes = Partial<{
  bio: string;
  instagramId: string;
  bioVideo: string;
  photos: string[];
  myOutfitPhotos: string[];
  greetingMessage: string;
  benefits: string[];
}>;

export type GQLStylistFeedback = Partial<{
  date: string;
  stylistId: string;
  taskId: string;
  userId: string;
  feedback: string;
  rate: number;
  taskName: string;
  taskType: string;
  tier: string;
  userName: string;
  userProfileImage: string;
}>;

export type GQLStylist = Partial<{
  id: string;
  stylistId: string;
  avgRate: number;
  reviewsCount: number;
  message: string;
  lastName: string;
  firstName: string;
  userName: string;
  profilePicture: string;
  city: string;
  stylistTier:
    | 'Bot'
    | 'Candidate'
    | 'Certified'
    | 'Expert'
    | 'Trainee'
    | 'Vacation'
    | 'Voided'
    | 'WhiteLabel'
    | 'Withdrawn';
  stylistAttributes: GQLStylistAttributes;
}>;
