#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load every single vote

const votes = [];

const directory = path.join(process.cwd(), './content/population');
const files = fs.readdirSync(directory);

const years = files.map((filename) =>
  parseInt(path.basename(filename, '.json'), 10)
);

years.forEach((year) => {
  const dir = path.join(process.cwd(), `./content/votes/${year}`);
  const json = fs
    .readdirSync(dir)
    .map((file) => require(`../content/votes/${year}/${file}`));

  votes.push(...json);
});

votes.forEach((vote) => {
  const { total, positions, date, roll_call } = vote.results.votes.vote;

  const realTotal = positions.reduce(
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

  const valid = Object.keys(total).every(
    (key) => total[key] === realTotal[key]
  );

  if (!valid) {
    console.error(`[VALIDATION ERROR]: ${date} / ${roll_call}`);
  }

  if (positions.length === 0) {
    console.error(`[VALIDATION ERROR][POSITIONS]: ${date} / ${roll_call}`);
  }
});
