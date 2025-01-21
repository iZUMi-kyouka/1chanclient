import { BASE_URL } from "@/app/layout"

export const makeProfilePictureURL = (filename: string): string => {
  return `${BASE_URL}/files/profile_pictures/${filename}`
}