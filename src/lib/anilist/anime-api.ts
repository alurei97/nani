
import { Anime } from "@/types/anime";
import { getAnimes, GraphQLError, Variables } from "./client";
import { AnilistAnime } from "./types";

function toAnime(anilistAnime: AnilistAnime): Anime {
    return {
        id: anilistAnime.id,
        title: anilistAnime.title.english ?? anilistAnime.title.romaji ?? "Unknown Title",
        coverImage: anilistAnime.coverImage.large,
        averageScore: anilistAnime.averageScore,
    };
}

export async function fetchAnimes(variables: Variables): Promise<{ animes: Anime[]; errors?: GraphQLError[] }> {
    //TODO: delete
    variables = {
        page: 1,
        genres: ["Fantasy"],
        format: "TV",
        score: 70,
    };

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

    const result = await getAnimes(animeQuery, variables);
    const animes = result.data?.Page.media.map(toAnime) ?? [];
    const errors = result.errors;

    return { animes, errors };
}
