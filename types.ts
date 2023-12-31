import { Server as NetServer, Socket } from 'net';
import { NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { DirectMessage, Member, Message, Profile, Server } from '@prisma/client';

export type ServerWithMemberWithProfiles = Server & {
  members: MemberWithProfile[];
};

export type MessageWithMemberWithProfile = Message & {
  member: MemberWithProfile;
};

export type DirectMessageWithMemberWithProfile = DirectMessage & {
  member: MemberWithProfile;
};

export type MemberWithProfile = Member & { profile: Profile };

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer,
    },
  },
};

export interface Emoji {
  emoticons: string[];
  id: string;
  keywords: string[];
  name: string;
  native: string;
  shortcodes: string;
  unified: string;
}
