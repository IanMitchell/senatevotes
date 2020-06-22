import { getTotalPopulationVote } from './population';

export const SUCCESSFUL_VOTE_TERMS = new Set([
  'Amendment Agreed to',
  'Concurrent Resolution Agreed to',
  'Nomination Confirmed',
  'Motion Agreed to',
  'Bill Passed',
  'Motion to Table Agreed to',
  'Cloture Motion Agreed to',
  'Motion to Proceed Agreed to',
  'Conference Report Agreed to',
  'Cloture on the Motion to Proceed Agreed to',
  'Motion for Attendance Agreed to',
  'Joint Resolution Passed',
  'Veto Sustained',
  'Resolution Agreed to',
  'Motion to Reconsider Agreed to',
  'Decision of Chair Sustained',
  'Resolution of Ratification Agreed to',
  'Motion to Discharge Agreed to',
  'Point of Order Well Taken',
  'Motion to Table Motion to Recommit Agreed to',
  'Motion to Adjourn Agreed to',
  'Guilty',
  'Agreed to',
  'Passed',
  'Confirmed',
  'Held Germane',
  'Sustained',
]);

export const UNSUCCESSFUL_VOTE_TERMS = new Set([
  'Amendment Rejected',
  'Motion Rejected',
  'Cloture Motion Rejected',
  'Cloture on the Motion to Proceed Rejected',
  'Motion to Table Failed',
  'Veto Overridden',
  'Motion to Postpone Rejected',
  'Motion to Adjourn Rejected',
  'Decision of Chair Not Sustained',
  'Motion to Proceed Rejected',
  'Motion to Discharge Rejected',
  'Joint Resolution Defeated',
  'Bill Defeated',
  'Resolution Rejected',
  'Motion to Refer Rejected',
  'Motion to Recommit Rejected',
  'Point of Order Not Well Taken',
  'Not Guilty',
  'Concurrent Resolution Rejected',
  'Resolution of Ratification Rejected',
  'Rejected',
  'Not Well Taken',
  'Point of Order Not Sustained',
  'Not Sustained',
  'Held Nongermane',
]);

/**
 * Helper functions when working with API Responses
 */

export function getTotalVotes(analysis) {
  return analysis.popular + analysis.unpopular;
}

export function isYesVote(...positions) {
  return positions.every(
    (position) => position.vote_position.toLowerCase() === 'yes'
  );
}

export function isNoVote(...positions) {
  return positions.every(
    (position) => position.vote_position.toLowerCase() === 'no'
  );
}

export function isStateYes(vote, state) {
  return isYesVote(
    ...vote.results.votes.vote.positions.filter((position) =>
      isState(position.state, state)
    )
  );
}

export function isStateNo(vote, state) {
  return isNoVote(
    ...vote.results.votes.vote.positions.filter((position) =>
      isState(position.state, state)
    )
  );
}

export function isStateTie(vote, state) {
  return !isStateYes(vote, state) && !isStateNo(vote, state);
}

// There are problems with the Propublica "Total" summary.
// See: https://github.com/propublica/congress-api-docs/issues/260
export function getVoteTotals(vote) {
  return vote.results.votes.vote.positions.reduce(
    (summary, position) => {
      const key = position.vote_position.toLowerCase().replace(' ', '_');
      summary[key] += 1;
      return summary;
    },
    {
      yes: 0,
      no: 0,
      present: 0,
      not_voting: 0,
    }
  );
}

function getVotePassPercentage(vote) {
  const type = vote.results.votes.vote.vote_type;

  switch (type) {
    case '1/2':
      return 1 / 2;
    case '3/5':
      return 3 / 5;
    case '2/3':
      return 2 / 3;
  }

  throw new Error(`Unknown Vote Type ${type}`);
}

export function isResultSuccessful(outcome) {
  if (SUCCESSFUL_VOTE_TERMS.has(outcome)) {
    return true;
  }

  if (UNSUCCESSFUL_VOTE_TERMS.has(outcome)) {
    return false;
  }

  throw new Error(`Unknown Result ${outcome}`);
}

function isVoteSuccessful(vote) {
  return isResultSuccessful(vote.results.votes.vote.result);
}

export function getVoteTitleAndNumber(vote) {
  const exists = (str) => str !== null && str !== undefined && str !== '';

  const details = vote.results.votes.vote;

  if (details.bill && exists(details.bill.number)) {
    return {
      title: details.bill.title || details.question_text || details.description,
      number: details.bill.number,
    };
  }

  if (details.nomination && details.nomination.number) {
    return {
      title: details.description,
      number: details.nomination.number,
    };
  }

  return {
    title: details.question_text || details.description,
    number: details.question,
  };
}

/**
 * Analysis Functions
 */

export function getPopularVotePercentage(analysis) {
  return Math.round(
    100 * (analysis.popular / (analysis.popular + analysis.unpopular))
  );
}

function isSupportedByPopulation(vote, population) {
  const percentage = getVotePassPercentage(vote);
  return (
    population.yes / (population.yes + population.no + population.neutral) >=
    percentage
  );
}

export function isVotePopular(vote, population) {
  const populationVote = getTotalPopulationVote(vote, population);

  if (isVoteSuccessful(vote)) {
    if (isSupportedByPopulation(vote, populationVote)) {
      return true;
    } else {
      return false;
    }
  } else {
    if (isSupportedByPopulation(vote, populationVote)) {
      return false;
    } else {
      return true;
    }
  }
}

export function getYearAnalysis(votes, population) {
  const counts = {
    popular: 0,
    unpopular: 0,
  };

  votes.forEach((vote) => {
    if (isVotePopular(vote, population)) {
      counts.popular += 1;
    } else {
      counts.unpopular += 1;
    }
  });

  return counts;
}
