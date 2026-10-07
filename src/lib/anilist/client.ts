import { Client, cacheExchange, fetchExchange } from 'urql';

const baseUrl = "https://graphql.anilist.co";

export const client = new Client({
  url: baseUrl,
  exchanges: [cacheExchange, fetchExchange],
});
