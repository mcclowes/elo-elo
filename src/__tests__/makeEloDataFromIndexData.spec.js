import { makeEloDataFromIndexData } from "../utils";

describe("makeEloDataFromIndexData", () => {
  it("initialises each city with baseline stats", () => {
    const baseline = 1200;
    const data = {
      london: { a: 1 },
      bristol: { b: 2 }
    };

    const eloData = makeEloDataFromIndexData(data, baseline);

    expect(Object.keys(eloData)).toEqual(["london", "bristol"]);
    expect(eloData.london).toEqual(
      expect.objectContaining({
        elo: baseline,
        w: 0,
        l: 0,
        d: 0,
        games: 0,
        attemptedGames: 0,
        totalElo: 0
      })
    );
    expect(eloData.bristol).toEqual(
      expect.objectContaining({
        totalSecondHalfElo: 0
      })
    );
  });
});

