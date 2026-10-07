import { Anime } from "@/types/anime";
import { create } from "zustand";

type SwipeStore = {
    isFetching: boolean;
    currentIndex: number;
    animePool: Anime[];
    nextCard: () => void;
    setAnimePool: (animePool: Anime[]) => void;
    appendAnimeBatch: (animeBatch: Anime[]) => void;
};

export const useSwipeStore = create<SwipeStore>((set, get) => ({
    isFetching: false,
    currentIndex: 0,
    animePool: [],

    nextCard: () => {
        const currentIndex = get().currentIndex;
        const animePoolLength = get().animePool.length;
        const updatedIndex = currentIndex + 1;

        if (updatedIndex >= animePoolLength - 5) {
            //TODO: start fetching
        }

        set({ currentIndex: Math.min(updatedIndex, animePoolLength - 1) });
    },

    setAnimePool: (animePool: Anime[]) => {
        set({ isFetching: false, currentIndex: 0, animePool, });
    },

    appendAnimeBatch: (animeBatch: Anime[]) => {
        const updatedAnimePool = [...get().animePool, ...animeBatch];
        set({ isFetching: false, animePool: updatedAnimePool });
    },
}));
