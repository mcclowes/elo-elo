const makeEloDataFromIndexData = (data, baseline) => {
	return Object.keys(data).reduce(
		(acc, k) => ({
			...acc,
			[k]: {
				elo: 0 + baseline,
				w: 0,
				l: 0,
				d: 0,
				games: 0,
				secondHalfGames: 0,
				attemptedGames: 0,
				totalElo: 0,
				totalSecondHalfElo: 0
			}
		}),
		{}
	);
};

export default makeEloDataFromIndexData;
