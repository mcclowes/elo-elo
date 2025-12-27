import getNewElo, { getExpectedScore } from "./getNewElo";

describe("getExpectedScore", () => {
  it("returns 0.5 for equal ratings", () => {
    const result = getExpectedScore(1500, 1500, 400);
    expect(result).toBeCloseTo(0.5);
  });

  it("returns higher score for higher rated player", () => {
    const result = getExpectedScore(1600, 1400, 400);
    expect(result).toBeGreaterThan(0.5);
    expect(result).toBeCloseTo(0.76, 1);
  });

  it("returns lower score for lower rated player", () => {
    const result = getExpectedScore(1400, 1600, 400);
    expect(result).toBeLessThan(0.5);
    expect(result).toBeCloseTo(0.24, 1);
  });

  it("expected scores of both players sum to 1", () => {
    const scoreA = getExpectedScore(1800, 1600, 400);
    const scoreB = getExpectedScore(1600, 1800, 400);
    expect(scoreA + scoreB).toBeCloseTo(1);
  });

  it("handles different energy values", () => {
    const standardEnergy = getExpectedScore(1600, 1400, 400);
    const lowerEnergy = getExpectedScore(1600, 1400, 200);
    // Lower energy means same rating difference has more impact
    expect(lowerEnergy).toBeGreaterThan(standardEnergy);
  });
});

describe("getNewElo", () => {
  const kFactor = 32;
  const gravity = 0;
  const energy = 400;
  const baseline = 1500;

  it("winner gains points, loser loses points", () => {
    const [newP1, newP2] = getNewElo(
      { elo: 1500, score: 1 },
      { elo: 1500, score: 0 },
      kFactor,
      gravity,
      energy,
      baseline
    );

    expect(newP1).toBeGreaterThan(1500);
    expect(newP2).toBeLessThan(1500);
  });

  it("rating changes are symmetric with no gravity", () => {
    const [newP1, newP2] = getNewElo(
      { elo: 1500, score: 1 },
      { elo: 1500, score: 0 },
      kFactor,
      gravity,
      energy,
      baseline
    );

    const p1Gain = newP1 - 1500;
    const p2Loss = 1500 - newP2;
    expect(p1Gain).toBeCloseTo(p2Loss);
  });

  it("draw between equal players causes no rating change", () => {
    const [newP1, newP2] = getNewElo(
      { elo: 1500, score: 0.5 },
      { elo: 1500, score: 0.5 },
      kFactor,
      gravity,
      energy,
      baseline
    );

    expect(newP1).toBeCloseTo(1500);
    expect(newP2).toBeCloseTo(1500);
  });

  it("upset victory gives larger rating change", () => {
    // Lower rated player wins
    const [upsetWinner, upsetLoser] = getNewElo(
      { elo: 1400, score: 1 },
      { elo: 1600, score: 0 },
      kFactor,
      gravity,
      energy,
      baseline
    );

    // Higher rated player wins (expected result)
    const [expectedWinner, expectedLoser] = getNewElo(
      { elo: 1600, score: 1 },
      { elo: 1400, score: 0 },
      kFactor,
      gravity,
      energy,
      baseline
    );

    const upsetGain = upsetWinner - 1400;
    const expectedGain = expectedWinner - 1600;

    expect(upsetGain).toBeGreaterThan(expectedGain);
  });

  it("gravity pulls ratings toward baseline", () => {
    const gravityValue = 0.1;

    const [newP1, newP2] = getNewElo(
      { elo: 1800, score: 1 },
      { elo: 1200, score: 0 },
      kFactor,
      gravityValue,
      energy,
      baseline
    );

    // Player above baseline should be pulled down toward 1500
    // Player below baseline should be pulled up toward 1500
    const [noGravP1, noGravP2] = getNewElo(
      { elo: 1800, score: 1 },
      { elo: 1200, score: 0 },
      kFactor,
      0,
      energy,
      baseline
    );

    expect(newP1).toBeLessThan(noGravP1);
    expect(newP2).toBeGreaterThan(noGravP2);
  });

  it("higher K-factor means larger rating changes", () => {
    const [lowK_P1] = getNewElo(
      { elo: 1500, score: 1 },
      { elo: 1500, score: 0 },
      16,
      gravity,
      energy,
      baseline
    );

    const [highK_P1] = getNewElo(
      { elo: 1500, score: 1 },
      { elo: 1500, score: 0 },
      32,
      gravity,
      energy,
      baseline
    );

    expect(highK_P1 - 1500).toBeGreaterThan(lowK_P1 - 1500);
  });
});
