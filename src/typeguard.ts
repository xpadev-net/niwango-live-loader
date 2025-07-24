import type { ThreadsApiResponse } from "@/@types/threads";

const typeguard = {
  threadsApiResponse: (i: unknown): i is ThreadsApiResponse =>
    !!i &&
    typeof i === "object" &&
    (i as ThreadsApiResponse).meta.status === 200,
};

export { typeguard };
