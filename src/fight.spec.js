jest.mock("./utils", () => {
  const actual = jest.requireActual("./utils");

  return {
    ...actual,
    randomKey: jest.fn(),
  };
});

import fight from "./fight";
import * as utils from "./utils";

describe("fight", () => {
  const coefficients = {
    kFactor: 32,
    gravity: 0,
    energy: 400,
    baseline: 1000,
    fights: 1,
  };

  afterEach(() => {
    utils.randomKey.mockReset();
  });

  it("records games where a player has a score of zero", () => {
    utils.randomKey
      .mockImplementationOnce(() => "alpha")
      .mockImplementationOnce(() => "beta")
      .mockImplementationOnce(() => "metric")
      .mockImplementation(() => {
        throw new Error("Unexpected call to randomKey");
      });

    const indexData = {
      alpha: { metric: 0 },
      beta: { metric: 1 },
    };

    const result = fight(indexData, coefficients);

    expect(result.alpha.games).toBe(1);
    expect(result.beta.games).toBe(1);
    expect(result.alpha.w).toBe(1);
    expect(result.beta.l).toBe(1);
    expect(result.alpha.attemptedGames).toBe(1);
    expect(result.beta.attemptedGames).toBe(1);
    expect(result.alpha.elo).toBeGreaterThan(result.beta.elo);
  });

  it("skips rounds when an opponent lacks the requested index", () => {
    utils.randomKey
      .mockImplementationOnce(() => "alpha")
      .mockImplementationOnce(() => "beta")
      .mockImplementationOnce(() => "metric")
      .mockImplementation(() => {
        throw new Error("Unexpected call to randomKey");
      });

    const indexData = {
      alpha: { metric: 1 },
      beta: {},
    };

    const result = fight(indexData, coefficients);

    expect(result.alpha.games).toBe(0);
    expect(result.beta.games).toBe(0);
    expect(result.alpha.attemptedGames).toBe(0);
    expect(result.beta.attemptedGames).toBe(0);
  });
});
