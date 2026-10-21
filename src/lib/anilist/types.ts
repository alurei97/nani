export const GENRES = [
    "Action",
    "Adventure",
    "Comedy",
    "Drama",
    "Ecchi",
    "Fantasy",
    "Hentai",
    "Horror",
    "Mahou Shoujo",
    "Mecha",
    "Music",
    "Mystery",
    "Psychological",
    "Romance",
    "Sci-Fi",
    "Slice of Life",
    "Sports",
    "Supernatural",
    "Thriller",
] as const;

export type Genre = (typeof GENRES)[number];

export type AnilistFormat = "TV" | "MOVIE" | "OVA";
export type FormatSelection = "ALL" | AnilistFormat;

export type AnilistAnime = {
    id: number;
    title: {
        romaji: string | null;
        english: string | null;
    };
    coverImage: {
        extraLarge: string;
    };
    averageScore: number | null;
};
