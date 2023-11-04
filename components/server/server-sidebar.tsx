import { FC, ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { Channel, ChannelType, MemberRole } from '@prisma/client';
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { currentProfile } from '@/lib/current-profile';
import { ServerWithMemberWithProfiles } from '@/types';
import { db } from '@/lib/db';

import { ServerHeader } from './server-header';
import { ServerSearch } from './server-search';
import { ServerSection } from './server-section';
import { ServerChannel } from './server-channel';
import ServerMember from './server-member';

interface ServerSidebarProps {
  serverId: string;
}
interface RenderChannelProps {
  data: Channel[];
  role?: MemberRole;
  label: string;
  channelType: ChannelType;
  server: ServerWithMemberWithProfiles;
}

type MapIconObj<T extends MemberRole | ChannelType> = Record<NonNullable<T>, ReactNode>;

const iconMap: MapIconObj<ChannelType> = {
  [ChannelType.TEXT]: <Hash className='mr-2 h-4 w-4' />,
  [ChannelType.AUDIO]: <Mic className='mr-2 h-4 w-4' />,
  [ChannelType.VIDEO]: <Video className='mr-2 h-4 w-4' />,
};

const roleIconMap: MapIconObj<MemberRole> = {
  [MemberRole.GUEST]: null,
  [MemberRole.ADMIN]: <ShieldAlert className='mr-2 h-4 w-4 text-rose-500' />,
  [MemberRole.MODERATOR]: <ShieldCheck className='mr-2 h-4 w-4 text-indigo-500' />,
};

const RenderChannelsSection: FC<RenderChannelProps> = ({ data, role, label, channelType, server }) => {
  const content = !!data?.length && (
    <div className='mb-2'>
      <ServerSection
        sectionType='channels'
        channelType={channelType}
        role={role}
        server={server}
        label={label}
      />
      <div className='space-y-2'>
        {data.map((channel) => (
          <ServerChannel
            key={channel.id}
            channel={channel}
            server={server}
            role={role}
          />
        ))}
      </div>
    </div>
  )

  return content;
}


export const ServerSidebar: FC<ServerSidebarProps> = async ({ serverId }) => {
  const profile = await currentProfile();

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: 'asc',
        }
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: 'asc',
        }
      },
    }
  });

  if (!profile) {
    return redirect('/')
  }

  if (!server) {
    return redirect('/');
  }

  const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT);
  const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO);
  const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO);
  const members = server?.members.filter((member) => member.profileId !== profile?.id);

  const role = server.members.find((member) => member.profileId === profile.id)?.role;

  return (
    <div className='flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5]'>
      <ServerHeader server={server} role={role} />
      <ScrollArea className='flex-1 px-3'>
        <div className='mt-2'>
          <ServerSearch
            data={[
              {
                label: 'Text Channels',
                type: 'channel',
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                }))
              },
              {
                label: 'Voice Channels',
                type: 'channel',
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                }))
              },
              {
                label: 'Video Channels',
                type: 'channel',
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                }))
              },
              {
                label: 'Member',
                type: 'member',
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                }))
              },
            ]}
          />
        </div>
        <Separator className='bg-zinc-200 dark:bg-zinc-700 rounded-md my-2' />
        <RenderChannelsSection
          channelType={ChannelType.TEXT}
          label="Text Channels"
          data={textChannels}
          server={server}
          role={role}
        />
        <RenderChannelsSection
          channelType={ChannelType.AUDIO}
          label="Voice Channels"
          data={audioChannels}
          server={server}
          role={role}
        />
        <RenderChannelsSection
          channelType={ChannelType.VIDEO}
          label="Video Channels"
          data={videoChannels}
          server={server}
          role={role}
        />
        {!!members?.length && (
          <div className='mb-2'>
            <ServerSection
              sectionType='members'
              role={role}
              label='Members'
              server={server}
            />
            <div className='space-y-2'>
              {members.map((member) => (
                <ServerMember
                  key={member.id}
                  member={member}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
