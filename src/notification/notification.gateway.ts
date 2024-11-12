import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { Notification } from '@prisma/client';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private activeUsers = new Map<number, string>();

  constructor() {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.removeUserFromActiveList(client.id);
  }

  @SubscribeMessage('subscribe')
  registerUser(client: Socket, userId: number) {
    this.activeUsers.set(userId, client.id);
  }

  async sendRealTimeNotification(notification: Notification) {
    const socketId = this.activeUsers.get(notification.userId);
    if (socketId) {
      this.server.to(socketId).emit('notification', notification);
    }
  }

  private removeUserFromActiveList(socketId: string) {
    for (const [userId, id] of this.activeUsers.entries()) {
      if (id === socketId) {
        this.activeUsers.delete(userId);
        break;
      }
    }
  }
}
