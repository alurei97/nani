import { useFilterStore } from "./filter-store";

describe("filter store", () => {
    beforeEach(() => {
        useFilterStore.setState({
            selectedGenres: [],
            selectedFormat: "ALL",
            selectedMinScore: 0,
        });
    });

    describe("setSelectedGenres", () => {
        it("sets multiple selected genres", () => {
            useFilterStore.getState().setSelectedGenres(["Action", "Adventure"]);

            expect(useFilterStore.getState().selectedGenres).toEqual(["Action", "Adventure"]);
        });
    });

    describe("toggleGenre", () => {
        it("adds a genre when it is not selected", () => {
            useFilterStore.getState().toggleGenre("Action");

            expect(useFilterStore.getState().selectedGenres).toEqual(["Action"]);
        });

        it("removes a genre when it is already selected", () => {
            useFilterStore.setState({ selectedGenres: ["Action"] });
            useFilterStore.getState().toggleGenre("Action");

            expect(useFilterStore.getState().selectedGenres).toEqual([]);
        });
    });

    describe("setSelectedFormat", () => {
        it("updates the selected format", () => {
            useFilterStore.getState().setSelectedFormat("TV");

            expect(useFilterStore.getState().selectedFormat).toBe("TV");
        });
    });

    describe("setSelectedMinScore", () => {
        it("sets a score within the allowed range", () => {
            useFilterStore.getState().setSelectedMinScore(10);

            expect(useFilterStore.getState().selectedMinScore).toBe(10);
        });

        it("clamps a score below the allowed range to zero", () => {
            useFilterStore.getState().setSelectedMinScore(-5);

            expect(useFilterStore.getState().selectedMinScore).toBe(0);
        });

        it("clamps a score above the allowed range to ten", () => {
            useFilterStore.getState().setSelectedMinScore(15);

            expect(useFilterStore.getState().selectedMinScore).toBe(10);
        });
    });
});
