import "regenerator-runtime/runtime";

import simulation from "./index";
import fight from "./fight";

jest.mock("./fight", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("simulation", () => {
  const originalRandom = Math.random;

  afterEach(() => {
    Math.random = originalRandom;
    jest.clearAllMocks();
  });

  it("aggregates Elo data across multiple runs", () => {
    const runOne = {
      Alpha: {
        elo: 1100,
        w: 2,
        l: 0,
        d: 0,
        games: 2,
        secondHalfGames: 0,
        attemptedGames: 2,
        totalElo: 2200,
        totalSecondHalfElo: 0,
      },
    };

    const runTwo = {
      Alpha: {
        elo: 1200,
        w: 3,
        l: 0,
        d: 0,
        games: 3,
        secondHalfGames: 1,
        attemptedGames: 3,
        totalElo: 3600,
        totalSecondHalfElo: 1200,
      },
    };

    fight
      .mockReturnValueOnce(runOne)
      .mockReturnValueOnce(runTwo);

    Math.random = jest.fn(() => 0.5);

    const iterator = simulation({}, { runs: 2 });

    const firstStep = iterator.next();
    expect(firstStep.done).toBe(false);
    expect(firstStep.value.progress).toBeCloseTo(0.5);
    expect(firstStep.value.random).toBe(0.5);

    const secondStep = iterator.next();
    expect(secondStep.done).toBe(false);
    expect(secondStep.value.progress).toBeCloseTo(1);

    const completion = iterator.next();
    expect(completion.done).toBe(true);

    expect(completion.value.Alpha).toEqual({
      elo: 1150,
      w: 2.5,
      l: 0,
      d: 0,
      games: 2.5,
      secondHalfGames: 0.5,
      attemptedGames: 2.5,
      totalElo: 2900,
      totalSecondHalfElo: 600,
    });

    expect(fight).toHaveBeenCalledTimes(2);
  });

  it("throws when runs is not a positive integer", () => {
    const iterator = simulation({}, { runs: 0 });

    expect(() => iterator.next()).toThrow("runs must be a positive integer");
  });
});
