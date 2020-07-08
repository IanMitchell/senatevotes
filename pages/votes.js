import React from 'react';
import Link from 'next/link';
import Anchor from '../components/Anchor';
import Card from '../components/Card';
import Heading from '../components/Heading';
import Main from '../components/Main';
import Navigation from '../components/Navigation';
import Social from '../components/Social';
import { getYears, getVotesInYear } from '../lib/pages';
import {
  getYearAnalysis,
  getPopularVotePercentage,
  getVoteYear,
  getVoteTotals,
  getVoteTitleAndNumber,
  isVotePopular,
} from '../lib/votes';
import { getTotalPopulationVote } from '../lib/population';

export default function Senate({ years, leaderboard }) {
  return (
    <Main>
      <Social />

      <Navigation href="/" as="/" text="Home" />

      <Heading className="mt-10 border-b-2 border-black mb-4">
        US Senate Votes
      </Heading>

      <section className="flex flex-wrap -mx-2">
        <div className="block p-2 w-full md:w-1/2 lg:w-1/3">
          <Card title="2020" className="shadow-none bg-gray-200 h-full">
            <p>Coming soon...</p>
          </Card>
        </div>

        {years.map(({ year, total, percentage }) => (
          <Link key={year} href="/votes/[year]" as={`/votes/${year}`}>
            <a className="block p-2 w-full md:w-1/2 lg:w-1/3">
              <Card
                title={year}
                className="h-full border-solid border-2 border-gray-400"
              >
                <p className="text-2xl text-gray-700 text-base">
                  <strong className="text-black">{total}</strong> votes.
                  <br />
                  <strong className="text-black">{100 - percentage}%</strong> of
                  votes were unpopular.
                </p>
              </Card>
            </a>
          </Link>
        ))}
      </section>

      <Heading className="mt-10 border-b-2 border-black mb-4">
        Notable Votes
      </Heading>

      <section className="flex flex-wrap -mx-2">
        <ol className="ml-2">
          {leaderboard.map((entry) => (
            <li key={`${entry.year}-${entry.rollcall}`} className="p-2">
              <Link
                href="/votes/[year]/[vote]"
                as={`/votes/${entry.year}/${entry.rollcall}`}
                passHref
              >
                <Anchor>
                  {entry.year} Rollcall {entry.rollcall} &bull; {entry.title}
                </Anchor>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </Main>
  );
}

export async function getStaticProps() {
  const years = getYears();

  const votesByYear = await Promise.all(
    years.map(async (year) => getVotesInYear(year))
  );

  const populationByYear = await Promise.all(
    years.map(async (year) => import(`../content/population/${year}.json`))
  );

  const pages = await Promise.all(
    years.map(async (year, index) => {
      const population = populationByYear[index];
      const votes = votesByYear[index];
      const analysis = getYearAnalysis(votes, population);

      return {
        year,
        total: votes.length,
        percentage: getPopularVotePercentage(analysis),
      };
    })
  );

  // Get all votes
  const leaderboard = votesByYear
    .flat()
    .filter((vote) => {
      // I am a fantastic coder
      const year = getVoteYear(vote);
      const index = years.indexOf(year);
      const population = populationByYear[index];

      return !isVotePopular(vote, population);
    })
    .map((vote) => {
      // I am a fantastic coder
      const year = getVoteYear(vote);
      const index = years.indexOf(year);
      const population = populationByYear[index];

      // Calculate yes percentage
      const totals = getVoteTotals(vote);
      const popularity = getTotalPopulationVote(vote, population);

      return {
        ...getVoteTitleAndNumber(vote),
        year,
        rollcall: vote.results.votes.vote.roll_call,
        pass:
          totals.yes /
          (totals.yes + totals.no + totals.present + totals.not_voting),
        popularity:
          popularity.yes /
          (popularity.yes + popularity.no + popularity.neutral),
      };
    })
    .sort(
      (a, b) =>
        Math.abs(b.pass - b.popularity) - Math.abs(a.pass - a.popularity)
    )
    .slice(0, 10);

  return {
    props: {
      years: pages.sort((a, b) => b.year - a.year),
      leaderboard,
    },
  };
}
