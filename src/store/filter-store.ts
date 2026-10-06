import { create } from "zustand";

type Genre = "Action" | "Adventure" | "Comedy" | "Drama" | "Fantasy" | "Horror" | "Romance" | "Sci-Fi" | "Slice of Life" | "Thriller" | "Mystery" | "Psychological";
type Format = "ALL" | "TV" | "MOVIE" | "OVA";

type FilterStore = {
    selectedGenres: Genre[];
    selectedFormat: Format;
    selectedMinScore: number;
    setSelectedGenres: (genres: Genre[]) => void;
    toggleGenre: (genre: Genre) => void;
    setSelectedFormat: (format: Format) => void;
    setSelectedMinScore: (score: number) => void;
};

export const useFilterStore = create<FilterStore>((set, get) => ({
    selectedGenres: [],
    selectedFormat: "ALL",
    selectedMinScore: 0,

    setSelectedGenres: (genres: Genre[]) => set({ selectedGenres: genres }),
    toggleGenre: (genre: Genre) => {
        const selectedGenres = get().selectedGenres;

        if (selectedGenres.includes(genre)) {
            const updatedGenres = selectedGenres.filter((g) => g !== genre);
            return set({ selectedGenres: updatedGenres });
        }

        const updatedGenres = [...selectedGenres, genre];
        return set({ selectedGenres: updatedGenres });
    },

    setSelectedFormat: (format: Format) => set({ selectedFormat: format }),

    setSelectedMinScore: (score: number) => {
        const finalScore = Math.max(0, Math.min(10, score));
        set({ selectedMinScore: finalScore });
    },
}));