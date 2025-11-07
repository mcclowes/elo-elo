import getNewElo from "../getNewElo";

describe("getNewElo", () => {
  it("awards the winning player more Elo and conserves total rating", () => {
    const baseline = 1500;
    const [winnerElo, loserElo] = getNewElo(
      { elo: 1600, score: 1 },
      { elo: 1500, score: 0 },
      32,
      0,
      400,
      baseline
    );

    expect(winnerElo).toBeGreaterThan(1600);
    expect(loserElo).toBeLessThan(1500);
    expect(winnerElo + loserElo).toBeCloseTo(3100, 5);
  });

  it("applies gravity towards the baseline when configured", () => {
    const [player1Elo] = getNewElo(
      { elo: 1500, score: 0.5 },
      { elo: 1500, score: 0.5 },
      32,
      0.5,
      400,
      1200
    );

    expect(player1Elo).toBeCloseTo(1350, 5);
  });
});

