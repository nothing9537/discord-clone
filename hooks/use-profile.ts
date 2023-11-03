import { redirectToSignIn } from '@clerk/nextjs';
import { Profile } from '@prisma/client';
import { currentProfile } from '@/lib/current-profile'

export const useProfile = async (): Promise<Profile> => {
  const profile = await currentProfile();

  if(!profile) {
    return redirectToSignIn();
  }

  return profile;
}