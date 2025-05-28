export interface SendNotification {
  token: string;
  notification: Notification
  android: Android;
}

export interface Notification {
  title: string;
  body: string;
}

export interface Android {
  priority?: string;
  data: Data;
}

export interface Data {
  userId: string;
  meetingId?: string;
  type: string;
  name: string;
  userFrom: string;
}