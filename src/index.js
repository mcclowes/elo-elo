import fight from "./fight";

export default function* simulation(indexData, coeficients) {
	const { runs } = coeficients;

	const outputs = [];

	for (var i = 0; i < runs; i++) {
		outputs.push(fight(indexData, coeficients));

		yield {
			progress: i / runs,
			random: Math.random()
		};
	}

	const averageOutput = outputs.reduce(
		(acc, output) =>
			Object.keys(output).reduce(
				(outputAcc, cityName) => ({
					...outputAcc,
					[cityName]: Object.keys(output[cityName]).reduce(
						(cityEloStatsAcc, eloStat) => ({
							...cityEloStatsAcc,
							[eloStat]:
								output[cityName][eloStat] / outputs.length +
								(acc[cityName] ? acc[cityName][eloStat] : 0)
						}),
						{}
					)
				}),
				{}
			),
		{}
	);

	return averageOutput;
}
