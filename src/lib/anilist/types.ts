export type Genre =
    "Action" |
    "Adventure" |
    "Comedy" |
    "Drama" |
    "Ecchi" |
    "Fantasy" |
    "Hentai" |
    "Horror" |
    "Mahou Shoujo" |
    "Mecha" |
    "Music" |
    "Mystery" |
    "Psychological" |
    "Romance" |
    "Sci-Fi" |
    "Slice of Life" |
    "Sports" |
    "Supernatural" |
    "Thriller";

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
