import type { IndexData, EloData } from "../types";

const makeEloDataFromIndexData = (data: IndexData, baseline: number): EloData => {
  return Object.keys(data).reduce<EloData>(
    (acc, k) => ({
      ...acc,
      [k]: {
        elo: baseline,
        w: 0,
        l: 0,
        d: 0,
        games: 0,
        secondHalfGames: 0,
        attemptedGames: 0,
        totalElo: 0,
        totalSecondHalfElo: 0,
      },
    }),
    {}
  );
};

export default makeEloDataFromIndexData;
