import { Anime } from "@/types/anime";
import { create } from "zustand";

export type SwipeState = "filter" | "swipe";

type SwipeStore = {
    swipeState: SwipeState;
    isFetching: boolean;
    currentIndex: number;
    animePool: Anime[];
    setSwipeState: (swipeState: SwipeState) => void;
    nextCard: () => void;
    setAnimePool: (animePool: Anime[]) => void;
    appendAnimeBatch: (animeBatch: Anime[]) => void;
};

export const useSwipeStore = create<SwipeStore>((set, get) => ({
    swipeState: "filter",
    isFetching: false,
    currentIndex: 0,
    animePool: [],

    setSwipeState: (swipeState: SwipeState) => set({ swipeState }),

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
