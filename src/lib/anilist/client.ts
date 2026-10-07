import { AnilistAnime, AnilistFormat, Genre } from "./types";

const baseUrl = "https://graphql.anilist.co";

export type GraphQLError = {
  message: string;
};

type GraphQLResponse<TData> = {
  data?: TData;
  errors?: GraphQLError[];
};

export type Variables = {
  page: number;
  genres?: Genre[];
  format?: AnilistFormat;
  score?: number;
};

type AnimeSearchData = {
  Page: {
    media: AnilistAnime[];
    pageInfo: {
      lastPage: number;
    };
  };
};

export async function getAnimes(query: string, variables?: Variables): Promise<GraphQLResponse<AnimeSearchData>> {
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  const result = (await response.json()) as GraphQLResponse<AnimeSearchData>;

  if (!response.ok && !result.errors?.length) {
    throw new Error(`AniList request failed: ${response.status}`);
  }

  return result;
}
