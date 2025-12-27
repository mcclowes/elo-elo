import makeEloDataFromIndexData from "./makeEloDataFromIndexData";

describe("makeEloDataFromIndexData", () => {
  it("creates elo data for each key in index data", () => {
    const indexData = {
      player1: { metric1: 10 },
      player2: { metric1: 20 },
    };

    const result = makeEloDataFromIndexData(indexData, 1500);

    expect(Object.keys(result)).toEqual(["player1", "player2"]);
  });

  it("initializes elo to baseline value", () => {
    const indexData = { player1: { metric1: 10 } };

    const result = makeEloDataFromIndexData(indexData, 1200);

    expect(result.player1.elo).toBe(1200);
  });

  it("initializes all stats to zero", () => {
    const indexData = { player1: { metric1: 10 } };

    const result = makeEloDataFromIndexData(indexData, 1500);

    expect(result.player1).toEqual({
      elo: 1500,
      w: 0,
      l: 0,
      d: 0,
      games: 0,
      secondHalfGames: 0,
      attemptedGames: 0,
      totalElo: 0,
      totalSecondHalfElo: 0,
    });
  });

  it("handles empty index data", () => {
    const result = makeEloDataFromIndexData({}, 1500);
    expect(result).toEqual({});
  });
});
