import * as utils from "./utils";
import getNewElo from "./getNewElo";

const fight = (indexData, coeficients) => {
	const { kFactor, gravity, energy, baseline, fights } = coeficients;

	const eloData = utils.makeEloDataFromIndexData(indexData, baseline);

	let secondHalf = false;

	for (let i = 0; i < fights; i++) {
		secondHalf = secondHalf || i > fights / 2;

		const player1 = utils.randomKey(eloData);
		const player2 = utils.randomKey(eloData);
		const indexName = utils.randomKey(indexData[player1]);

		const player1score = indexData[player1][indexName];
		const player2score = indexData[player2][indexName];

		eloData[player1].attemptedGames++;
		eloData[player2].attemptedGames++;

		if (player1score && player2score) {
			eloData[player1].games++;
			eloData[player2].games++;

			if (secondHalf) {
				eloData[player1].secondHalfGames++;
				eloData[player2].secondHalfGames++;
			}

			if (player1score < player2score) {
				// player1 wins
				eloData[player1].w++;
				eloData[player2].l++;

				const [newPlayer1Elo, newPlayer2Elo] = getNewElo(
					{
						elo: eloData[player1].elo,
						score: 1
					},
					{
						elo: eloData[player2].elo,
						score: 0
					},
					kFactor,
					gravity,
					energy,
					baseline
				);

				eloData[player1].elo = newPlayer1Elo;
				eloData[player2].elo = newPlayer2Elo;

				eloData[player1].totalElo += newPlayer1Elo;
				eloData[player2].totalElo += newPlayer2Elo;

				if (secondHalf) {
					eloData[player1].totalSecondHalfElo += newPlayer1Elo;
					eloData[player2].totalSecondHalfElo += newPlayer2Elo;
				}
			} else if (player1score > player2score) {
				// player2 wins
				eloData[player2].w++;
				eloData[player1].l++;

				const [newPlayer1Elo, newPlayer2Elo] = getNewElo(
					{
						elo: eloData[player1].elo,
						score: 0
					},
					{
						elo: eloData[player2].elo,
						score: 1
					},
					kFactor,
					gravity,
					energy,
					baseline
				);

				eloData[player1].elo = newPlayer1Elo;
				eloData[player2].elo = newPlayer2Elo;
				eloData[player1].totalElo += newPlayer1Elo;
				eloData[player2].totalElo += newPlayer2Elo;

				if (secondHalf) {
					eloData[player1].totalSecondHalfElo += newPlayer1Elo;
					eloData[player2].totalSecondHalfElo += newPlayer2Elo;
				}
			} else {
				// draw
				eloData[player1].d++;
				eloData[player2].d++;

				const [newPlayer1Elo, newPlayer2Elo] = getNewElo(
					{
						elo: eloData[player1].elo,
						score: 0.5
					},
					{
						elo: eloData[player2].elo,
						score: 0.5
					},
					kFactor,
					gravity,
					energy,
					baseline
				);

				eloData[player1].elo = newPlayer1Elo;
				eloData[player2].elo = newPlayer2Elo;
				eloData[player1].totalElo += newPlayer1Elo;
				eloData[player2].totalElo += newPlayer2Elo;

				if (secondHalf) {
					eloData[player1].totalSecondHalfElo += newPlayer1Elo;
					eloData[player2].totalSecondHalfElo += newPlayer2Elo;
				}
			}
		}
	}

	return eloData;
};

export default fight;
