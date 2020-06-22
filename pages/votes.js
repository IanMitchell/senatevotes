import React from 'react';
import Link from 'next/link';
import Card from '../components/Card';
import Heading from '../components/Heading';
import Main from '../components/Main';
import Navigation from '../components/Navigation';
import Social from '../components/Social';
import { getYears, getVotesInYear } from '../lib/pages';
import { getYearAnalysis, getPopularVotePercentage } from '../lib/votes';

export default function Senate({ years }) {
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
    </Main>
  );
}

export async function getStaticProps() {
  const years = getYears();

  const pages = await Promise.all(
    years.map(async (year) => {
      const population = await import(`../content/population/${year}.json`);
      const votes = await getVotesInYear(year);
      const analysis = getYearAnalysis(votes, population);

      return {
        year,
        total: votes.length,
        percentage: getPopularVotePercentage(analysis),
      };
    })
  );

  return {
    props: {
      years: pages.sort((a, b) => b.year - a.year),
    },
  };
}
