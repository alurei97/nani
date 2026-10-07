export type Genre = "Action" | "Adventure" | "Comedy" | "Drama" | "Fantasy" | "Horror" | "Romance" | "Sci-Fi" | "Slice of Life" | "Thriller" | "Mystery" | "Psychological";

export type AnilistFormat = "TV" | "MOVIE" | "OVA";
export type FormatSelection = "ALL" | AnilistFormat;

export type AnilistAnime = {
    id: number;
    title: {
        romaji: string | null;
        english: string | null;
    };
    coverImage: {
        large: string;
    };
    averageScore: number | null;
};
