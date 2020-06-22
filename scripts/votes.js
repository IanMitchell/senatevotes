#!/usr/bin/env node

require('dotenv').config();
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');

function getDateUrl(year, month) {
  return `https://api.propublica.org/congress/v1/senate/votes/${year}/${month}.json`;
}

function getRollCallUrl(congress, session, rollCall) {
  return `https://api.propublica.org/congress/v1/${congress}/senate/sessions/${session}/votes/${rollCall}.json`;
}

function getPropublicaResponse(url) {
  return fetch(url, {
    headers: {
      'X-API-Key': process.env.PROPUBLICA_KEY,
    },
  }).then((response) => response.json());
}

function downloadVotes(year) {
  const directory = path.resolve(__dirname, '../content/votes/', year);

  if (!fs.existsSync(directory)) {
    console.log('Creating directory...');
    fs.mkdirSync(directory);
    console.log(`\tCreated ${directory}`);
  }

  const requests = [
    getPropublicaResponse(getDateUrl(year, '01')),
    getPropublicaResponse(getDateUrl(year, '02')),
    getPropublicaResponse(getDateUrl(year, '03')),
    getPropublicaResponse(getDateUrl(year, '04')),
    getPropublicaResponse(getDateUrl(year, '05')),
    getPropublicaResponse(getDateUrl(year, '06')),
    getPropublicaResponse(getDateUrl(year, '07')),
    getPropublicaResponse(getDateUrl(year, '08')),
    getPropublicaResponse(getDateUrl(year, '09')),
    getPropublicaResponse(getDateUrl(year, '10')),
    getPropublicaResponse(getDateUrl(year, '11')),
    getPropublicaResponse(getDateUrl(year, '12')),
  ];

  const rollcalls = [];

  Promise.all(requests).then((data) => {
    data.forEach((month) => {
      console.log(`Queuing ${month.results.month}/${month.results.year}...`);
      month.results.votes.forEach((vote) => {
        console.log(`\tDownloading ${vote.roll_call}`);

        rollcalls.push(
          getPropublicaResponse(
            getRollCallUrl(vote.congress, vote.session, vote.roll_call)
          ).then((rollcall) => {
            fs.writeFileSync(
              path.resolve(directory, `${vote.roll_call}.json`),
              JSON.stringify(rollcall)
            );
          })
        );
      });
    });
  });

  Promise.all(rollcalls).then(() => console.log('Done!'));
}

downloadVotes(process.argv[2]);
