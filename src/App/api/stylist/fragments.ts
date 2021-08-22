export const stylistAttributesFragment = `{
  bio
  instagramId
  bioVideo
  photos
  myOutfitPhotos
  greetingMessage
  benefits
}`;

export const stylistFeedbackFragment = `{
  stylistId
  taskId
  userId
  feedback
  rate
  taskName
  taskType
  tier
  userName
  userProfileImage
}`;

export const stylistFragment = `{
  stylistId
  avgRate
  reviewsCount
  message
  lastName
  firstName
  userName
  profilePicture
  city
  stylistTier
  stylistAttributes ${stylistAttributesFragment}
}`;
