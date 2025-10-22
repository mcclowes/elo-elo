import getNewElo from "./getNewElo";

describe("getNewElo", () => {
  it("updates Elo using the classic formula when gravity is zero", () => {
    const [player1Elo, player2Elo] = getNewElo(
      { elo: 1000, score: 1 },
      { elo: 1000, score: 0 },
      32,
      0,
      400,
      1000,
    );

    expect(player1Elo).toBeCloseTo(1016);
    expect(player2Elo).toBeCloseTo(984);
  });

  it("pulls the ratings towards the baseline when gravity is applied", () => {
    const [player1Elo, player2Elo] = getNewElo(
      { elo: 1200, score: 0 },
      { elo: 900, score: 1 },
      40,
      0.1,
      400,
      1000,
    );

    expect(player1Elo).toBeLessThan(1200);
    expect(player1Elo).toBeGreaterThan(1100);
    expect(player2Elo).toBeGreaterThan(900);
    expect(player2Elo).toBeLessThan(1100);
  });
});
