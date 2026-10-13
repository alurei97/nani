import type { Anime } from "@/types/anime";
import { useSwipeStore } from "./swipe-store";

const anime = (id: number): Anime => ({
    id,
    title: `Anime ${id}`,
    coverImage: `cover-${id}`,
    averageScore: 80,
});

describe("swipe store", () => {
    beforeEach(() => {
        useSwipeStore.setState({
            swipeState: "filter",
            isFetching: false,
            currentIndex: 0,
            animePool: [],
        });
    });

    describe("setSwipeState", () => {
        it("sets the swipe state", () => {
            useSwipeStore.getState().setSwipeState("swipe");

            expect(useSwipeStore.getState().swipeState).toBe("swipe");
        });
    });

    describe("nextCard", () => {
        it("advances to the next anime", () => {
            const pool = [anime(1), anime(2), anime(3), anime(4)];
            useSwipeStore.setState({ currentIndex: 1, animePool: pool });

            useSwipeStore.getState().nextCard();

            expect(useSwipeStore.getState()).toMatchObject({
                currentIndex: 2,
                animePool: pool,
            });
        });

        it("does not advance beyond the last anime", () => {
            const pool = [anime(1), anime(2), anime(3), anime(4)];
            useSwipeStore.setState({ currentIndex: 3, animePool: pool });

            useSwipeStore.getState().nextCard();

            expect(useSwipeStore.getState().currentIndex).toBe(3);
        });

        it("sets the index to -1 when the pool is empty", () => {
            useSwipeStore.getState().nextCard();

            expect(useSwipeStore.getState().currentIndex).toBe(-1);
        });
    });

    describe("setAnimePool", () => {
        it("replaces the pool, resets the index, and stops fetching", () => {
            const previousPool = [anime(1), anime(2), anime(3)];
            const replacement = [anime(4)];
            useSwipeStore.setState({
                isFetching: true,
                currentIndex: 1,
                animePool: previousPool,
            });

            useSwipeStore.getState().setAnimePool(replacement);

            expect(useSwipeStore.getState()).toMatchObject({
                isFetching: false,
                currentIndex: 0,
                animePool: replacement,
            });
        });
    });

    describe("appendAnimeBatch", () => {
        it("appends anime and stops fetching", () => {
            const existing = [anime(1)];
            const batch = [anime(2), anime(3)];
            useSwipeStore.setState({ isFetching: true, animePool: existing });

            useSwipeStore.getState().appendAnimeBatch(batch);

            expect(useSwipeStore.getState()).toMatchObject({
                isFetching: false,
                animePool: [...existing, ...batch],
            });
        });
    });
});
