import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as ServerIo } from 'socket.io';
import { NextApiResponseServerIo } from '@/types';

export const config = {
  api: {
    bodyParser: false,
  },
};

export const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if(!res.socket.server.io) {
    const path = '/api/socket/io';
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIo(httpServer, {
      path,
      addTrailingSlash: false,
    });

    res.socket.server.io = io;
  }

  res.end();
}

export default ioHandler;