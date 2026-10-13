import { FormatSelection, Genre } from "@/lib/anilist/types";
import { create } from "zustand";

type FilterStore = {
    selectedGenres: Genre[];
    selectedFormat: FormatSelection;
    selectedMinScore: number;
    resetAll: () => void;
    setSelectedGenres: (genres: Genre[]) => void;
    toggleGenre: (genre: Genre) => void;
    setSelectedFormat: (format: FormatSelection) => void;
    setSelectedMinScore: (score: number) => void;
};

export const useFilterStore = create<FilterStore>((set, get) => ({
    selectedGenres: [],
    selectedFormat: "ALL",
    selectedMinScore: 0,

    resetAll: () => set({ selectedGenres: [], selectedFormat: "ALL", selectedMinScore: 0 }),

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

    setSelectedFormat: (format: FormatSelection) => set({ selectedFormat: format }),

    setSelectedMinScore: (score: number) => {
        const finalScore = Math.max(0, Math.min(10, score));
        set({ selectedMinScore: finalScore });
    },
}));
