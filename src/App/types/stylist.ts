export enum STYLIST_TIER {
  BOT = 'Bot',
  CANDIDATE = 'Candidate',
  CERTIFIED = 'Certified',
  EXPERT = 'Expert',
  TRAINEE = 'Trainee',
  VACATION = 'Vacation',
  VOIDED = 'Voided',
  WHITE_LABEL = 'WhiteLabel',
  WIDTHDRAW = 'Withdrawn'
}

export type StylistAttributes = Partial<{
  bio: string;
  instagramId: string;
  bioVideo: string;
  photos: string[];
  myOutfitPhotos: string[];
  greetingMessage: string;
  benefits: string[];
}>;

export type StylistFeedback = Partial<{
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

export type Stylist = Partial<{
  stylistId: string;
  avgRate: number;
  reviewsCount: number;
  message: string;
  lastName: string;
  firstName: string;
  userName: string;
  profilePicture: string;
  city: string;
  stylistTier: STYLIST_TIER;
  stylistAttributes: StylistAttributes;
}>;
