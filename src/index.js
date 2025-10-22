import fight from "./fight";

const createAccumulator = referenceRun =>
  Object.keys(referenceRun).reduce(
    (accumulator, cityName) => ({
      ...accumulator,
      [cityName]: Object.keys(referenceRun[cityName]).reduce(
        (cityAccumulator, statKey) => ({
          ...cityAccumulator,
          [statKey]: 0,
        }),
        {},
      ),
    }),
    {},
  );

const addRunToAccumulator = (accumulator, run) => {
  Object.keys(run).forEach(cityName => {
    if (!accumulator[cityName]) {
      accumulator[cityName] = Object.keys(run[cityName]).reduce(
        (cityAccumulator, statKey) => ({
          ...cityAccumulator,
          [statKey]: 0,
        }),
        {},
      );
    }

    Object.keys(run[cityName]).forEach(statKey => {
      accumulator[cityName][statKey] += run[cityName][statKey];
    });
  });

  return accumulator;
};

const averageAccumulator = (accumulator, runs) =>
  Object.keys(accumulator).reduce(
    (average, cityName) => ({
      ...average,
      [cityName]: Object.keys(accumulator[cityName]).reduce(
        (cityAverage, statKey) => ({
          ...cityAverage,
          [statKey]: accumulator[cityName][statKey] / runs,
        }),
        {},
      ),
    }),
    {},
  );

export default function* simulation(indexData, coeficients) {
  const { runs } = coeficients;

  if (!Number.isInteger(runs) || runs <= 0) {
    throw new Error("runs must be a positive integer");
  }

  let accumulator;

  for (let i = 0; i < runs; i++) {
    const runResult = fight(indexData, coeficients);
    accumulator = accumulator
      ? addRunToAccumulator(accumulator, runResult)
      : addRunToAccumulator(createAccumulator(runResult), runResult);

    yield {
      progress: (i + 1) / runs,
      random: Math.random(),
    };
  }

  return averageAccumulator(accumulator, runs);
}
