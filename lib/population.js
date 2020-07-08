import { getCoordinates, getState } from './states';
import { isNoVote, isYesVote } from './votes';

export function getTotalPopulation(population) {
  return Object.values(population).reduce((sum, value) => sum + value, 0);
}

export function getTotalPopulationVote(vote, population) {
  if (!vote.results) {
    console.log(vote);
  }

  return vote.results.votes.vote.positions.reduce(
    (totals, position) => {
      const value = Math.round(population[getState(position.state)] / 2);

      if (position.vote_position.toLowerCase() === 'yes') {
        totals.yes += value;
      } else if (position.vote_position.toLowerCase() === 'no') {
        totals.no += value;
      } else {
        totals.neutral += value;
      }

      return totals;
    },
    { yes: 0, no: 0, neutral: 0 }
  );
}

export function getStatePopulationVote(vote, population, bubbleSize = 200) {
  const results = [
    { label: 'Yes', data: [] },
    { label: 'No', data: [] },
    { label: 'Mixed', data: [] },
  ];

  const positionsByState = vote.results.votes.vote.positions.reduce(
    (byState, position) => {
      const state = getState(position.state);
      byState[state] = [...(byState[state] || []), position];
      return byState;
    },
    {}
  );

  Object.entries(positionsByState).forEach(([state, positions]) => {
    const entry = {
      ...getCoordinates(state),
      population: population[state],
      r: bubbleSize * (population[state] / getTotalPopulation(population)),
    };

    if (isYesVote(...positions)) {
      results[0].data.push(entry);
    } else if (isNoVote(...positions)) {
      results[1].data.push(entry);
    } else {
      results[2].data.push(entry);
    }
  });

  return results;
}
