import { FC, ReactNode } from 'react';
import { ChannelType, MemberRole } from '@prisma/client';
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';

type MapIconObj<T extends MemberRole | ChannelType> = Record<NonNullable<T>, ReactNode>;
export type ChannelIconMapClassNames = Partial<Record<NonNullable<ChannelType>, string>>;
export type RoleIconMapClassNames = Partial<Record<NonNullable<MemberRole>, string>>;

const getChannelIconMap = (channelType: ChannelType, classNames?: ChannelIconMapClassNames) => {
  classNames = {
    [ChannelType.TEXT]: 'mr-2 h-4 w-4',
    [ChannelType.AUDIO]: 'mr-2 h-4 w-4',
    [ChannelType.VIDEO]: 'mr-2 h-4 w-4',
    ...classNames,
  }

  const ChannelIconMap: MapIconObj<ChannelType> = {
    [ChannelType.TEXT]: <Hash className={classNames.TEXT} />,
    [ChannelType.AUDIO]: <Mic className={classNames.AUDIO} />,
    [ChannelType.VIDEO]: <Video className={classNames.VIDEO} />,
  };

  return ChannelIconMap[channelType];
};

const getRoleIconMap = (role: MemberRole, classNames?: RoleIconMapClassNames) => {
  classNames = {
    [MemberRole.GUEST]: '',
    [MemberRole.ADMIN]: 'mr-2 h-4 w-4 text-rose-500',
    [MemberRole.MODERATOR]: 'mr-2 h-4 w-4 text-indigo-500',
    ...classNames,
  }

  const RoleIconMap: MapIconObj<MemberRole> = {
    [MemberRole.GUEST]: null,
    [MemberRole.ADMIN]: <ShieldAlert className={classNames.ADMIN} />,
    [MemberRole.MODERATOR]: <ShieldCheck className={classNames.MODERATOR} />,
  };

  return RoleIconMap[role];
};

interface BaseIconMapProps {
  type: 'role' | 'channel';
  className?: unknown;
}

interface ChannelIconMapProps extends BaseIconMapProps {
  type: 'channel'
  channelType: ChannelType;
  className?: ChannelIconMapClassNames;
}

interface RoleIconMapProps extends BaseIconMapProps {
  type: 'role'
  role: MemberRole;
  className?: RoleIconMapClassNames;
}

type IconMapProps = ChannelIconMapProps | RoleIconMapProps;

export const IconMap: FC<IconMapProps> = (props) => {
  switch (props.type) {
    case 'channel':
      return getChannelIconMap(props.channelType, props.className);
    case 'role':
      return getRoleIconMap(props.role, props.className);
    default:
      return null;
  }
};
