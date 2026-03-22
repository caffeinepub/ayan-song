export interface Song {
  id: string;
  title: string;
  artist: string;
  audioBase64: string;
  uploadedAt: number;
  gradient: [string, string];
}

export interface Comment {
  id: string;
  name: string;
  text: string;
  createdAt: number;
}

export interface Message {
  id: string;
  name: string;
  dob?: string;
  text: string;
  likes: number;
  comments: Comment[];
  createdAt: number;
}
