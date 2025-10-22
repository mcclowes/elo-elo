import * as utils from "./utils";
import getNewElo from "./getNewElo";

const ensureDifferentPlayers = (players, currentPlayer) => {
  if (Object.keys(players).length <= 1) {
    return currentPlayer;
  }

  let opponent = utils.randomKey(players);

  while (opponent === currentPlayer) {
    opponent = utils.randomKey(players);
  }

  return opponent;
};

const calculateOutcomeScores = (player1Score, player2Score) => {
  if (player1Score < player2Score) {
    return {
      outcome: 1,
      scores: [1, 0],
    };
  }

  if (player1Score > player2Score) {
    return {
      outcome: -1,
      scores: [0, 1],
    };
  }

  return {
    outcome: 0,
    scores: [0.5, 0.5],
  };
};

const updateOutcomeTallies = (player1, player2, outcome) => {
  if (outcome === 1) {
    player1.w += 1;
    player2.l += 1;
    return;
  }

  if (outcome === -1) {
    player2.w += 1;
    player1.l += 1;
    return;
  }

  player1.d += 1;
  player2.d += 1;
};

const updateEloForMatch = (
  player1,
  player2,
  scores,
  kFactor,
  gravity,
  energy,
  baseline,
  secondHalf,
) => {
  const [newPlayer1Elo, newPlayer2Elo] = getNewElo(
    {
      elo: player1.elo,
      score: scores[0],
    },
    {
      elo: player2.elo,
      score: scores[1],
    },
    kFactor,
    gravity,
    energy,
    baseline,
  );

  player1.elo = newPlayer1Elo;
  player2.elo = newPlayer2Elo;

  player1.totalElo += newPlayer1Elo;
  player2.totalElo += newPlayer2Elo;

  if (secondHalf) {
    player1.totalSecondHalfElo += newPlayer1Elo;
    player2.totalSecondHalfElo += newPlayer2Elo;
  }
};

const fight = (indexData, coeficients) => {
  const { kFactor, gravity, energy, baseline, fights } = coeficients;

  const eloData = utils.makeEloDataFromIndexData(indexData, baseline);
  let secondHalf = false;

  for (let i = 0; i < fights; i++) {
    secondHalf = secondHalf || i >= fights / 2;

    const player1Name = utils.randomKey(eloData);
    const player2Name = ensureDifferentPlayers(eloData, player1Name);
    const player1Indexes = indexData[player1Name];

    if (!player1Indexes) {
      continue;
    }

    let indexName;

    try {
      indexName = utils.randomKey(player1Indexes);
    } catch (error) {
      continue;
    }

    if (player1Name === player2Name) {
      continue;
    }

    const player2Indexes = indexData[player2Name];

    if (!player2Indexes || !(indexName in player2Indexes)) {
      continue;
    }

    const player1Score = player1Indexes[indexName];
    const player2Score = player2Indexes[indexName];

    const player1 = eloData[player1Name];
    const player2 = eloData[player2Name];

    player1.attemptedGames += 1;
    player2.attemptedGames += 1;

    if (player1Score == null || player2Score == null) {
      continue;
    }

    player1.games += 1;
    player2.games += 1;

    if (secondHalf) {
      player1.secondHalfGames += 1;
      player2.secondHalfGames += 1;
    }

    const { outcome, scores } = calculateOutcomeScores(player1Score, player2Score);

    updateOutcomeTallies(player1, player2, outcome);

    updateEloForMatch(
      player1,
      player2,
      scores,
      kFactor,
      gravity,
      energy,
      baseline,
      secondHalf,
    );
  }

  return eloData;
};

export default fight;
