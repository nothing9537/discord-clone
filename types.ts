import { Member, Profile, Server } from '@prisma/client';

export type ServerWithMemberWithProfiles = Server & {
  members: (Member & { profile: Profile })[];
};