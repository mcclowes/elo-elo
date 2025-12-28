import type { IndexData, EloData, Coefficients, SimulationProgress } from "./types";
import fight from "./fight";

export type { IndexData, EloData, Coefficients, EloStats, Player, SimulationProgress } from "./types";
export { EloValidationError, getExpectedScore } from "./getNewElo";

export default function* simulation(
  indexData: IndexData,
  coefficients: Coefficients
): Generator<SimulationProgress, EloData, unknown> {
  const { runs } = coefficients;

  const outputs: EloData[] = [];

  for (let i = 0; i < runs; i++) {
    outputs.push(fight(indexData, coefficients));

    yield {
      progress: i / runs,
      random: Math.random(),
    };
  }

  const averageOutput = outputs.reduce<EloData>(
    (acc, output) =>
      Object.keys(output).reduce<EloData>(
        (outputAcc, cityName) => ({
          ...outputAcc,
          [cityName]: Object.keys(output[cityName]).reduce(
            (cityEloStatsAcc, eloStat) => ({
              ...cityEloStatsAcc,
              [eloStat]:
                (output[cityName][eloStat as keyof typeof output[typeof cityName]] as number) /
                  outputs.length +
                (acc[cityName]
                  ? (acc[cityName][eloStat as keyof typeof acc[typeof cityName]] as number)
                  : 0),
            }),
            {} as EloData[string]
          ),
        }),
        {} as EloData
      ),
    {} as EloData
  );

  return averageOutput;
}
