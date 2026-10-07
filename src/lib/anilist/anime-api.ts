
import { Anime } from "@/types/anime";
import { CombinedError } from "urql";
import {  client } from "./client";
import { AnilistAnime, AnilistFormat, Genre } from "./types";

export type Variables = {
  page: number;
  genres?: Genre[];
  format?: AnilistFormat;
  score?: number;
};

export type AnimeSearchData = {
  Page: {
    media: AnilistAnime[];
    pageInfo: {
      lastPage: number;
    };
  };
};

function toAnime(anilistAnime: AnilistAnime): Anime {
    return {
        id: anilistAnime.id,
        title: anilistAnime.title.english ?? anilistAnime.title.romaji ?? "Unknown Title",
        coverImage: anilistAnime.coverImage.large,
        averageScore: anilistAnime.averageScore,
    };
}

export async function fetchAnimes(variables: Variables): Promise<{ animes: Anime[]; lastPage: number, error?: CombinedError }> {
    //TODO: delete
    // variables = {
    //     page: 1,
    //     genres: ["Fantasy"],
    //     format: "TV",
    //     score: 70,
    // };

    const animeQuery = `
        query ($page: Int, $genres: [String], $format: MediaFormat, $score: Int) {
            Page(page: $page, perPage: 25) {
            media(
                type: ANIME
                genre_in: $genres
                format: $format
                averageScore_greater: $score
            ) {
                id
                title { romaji english }
                coverImage { large }
                averageScore
            }
            pageInfo { lastPage }
            }
        }
    `;

    const result = await client.query<AnimeSearchData>(animeQuery, variables).toPromise();
    const animes = result.data?.Page.media.map(toAnime) ?? [];
    const lastPage = result.data?.Page.pageInfo.lastPage ?? 0;
    const error = result.error;

    return { animes, lastPage, error };
}
