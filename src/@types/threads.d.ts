export type ThreadsApiResponse = {
  meta: {
    status: 200;
  };
  data: {
    threads: ThreadsApiThread[];
  };
};

export type ThreadsApiThread = {
  id: string;
  fork: string;
  commentCount: number;
  comments: ThreadsApiComment[];
};

export type ThreadsApiComment = {
  id: string;
  no: number;
  vposMs: number;
  body: string;
  commands: string[];
  userId: string;
  isPremium: boolean;
  score: number;
  postedAt: string;
  nicoruCount: number;
  nicoruId: null;
  source: string;
  isMyPost: boolean;
};
