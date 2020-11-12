const applyGravity = (elo, gravity, baseline) =>
	elo - (elo - baseline) * gravity;

const getExpectedScore = (playerElo, opponentElo, energy) =>
	Math.pow(1 + Math.pow(10, (opponentElo - playerElo) / energy), -1);

const getNewElo = (player1, player2, kFactor, gravity, energy, baseline) => {
	return [
		applyGravity(
			player1.elo +
				kFactor *
					(player1.score - getExpectedScore(player1.elo, player2.elo, energy)),
			gravity,
			baseline
		),
		applyGravity(
			player2.elo +
				kFactor *
					(player2.score - getExpectedScore(player2.elo, player1.elo, energy)),
			gravity,
			baseline
		)
	];
};

export default getNewElo;
