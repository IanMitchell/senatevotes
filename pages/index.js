import Link from 'next/link';
import dynamic from 'next/dynamic';
import React from 'react';
import Heading from '../components/Heading';
import Main from '../components/Main';
import Paragraph from '../components/Paragraph';
import Social from '../components/Social';
import Spinner from '../components/Spinner';
import { getYearAnalysis } from '../lib/votes';
import { getYears, getVotesInYear } from '../lib/pages';

const DynamicChartFigure = dynamic(() => import('../components/ChartFigure'), {
  loading: () => <Spinner />,
});

export default function Home({ vote, unpopularPercentage, population }) {
  return (
    <Main>
      <Social
        title="Senate Votes"
        description="Senate Votes tracks the U.S. Senate votes and compares the outcome with the represented population"
      />

      <Heading className="mt-10 lg:mt-20">Over the past twenty years,</Heading>

      <Heading className="mb-10">
        <span className="font-black">{unpopularPercentage}%</span> of the Senate
        votes did not reflect the majority of represented population.
      </Heading>

      <Paragraph>
        The United States of America Senate is a legistlative body consisting of
        100 members. Each state in the union is given two votes, no matter how
        many people live in that state. This creates an unfair system - all{' '}
        <strong>{population.California.toLocaleString()}</strong> Californians
        have the same say as{' '}
        <strong>{population.Wyoming.toLocaleString()}</strong> Wyomingites.
      </Paragraph>

      <Paragraph>
        On February 6, 2020 the Senate voted to acquit President Trump in his
        impeachment trial. This brought the discussions about the Senate's
        unequal representation and distribution of power into the forefront of
        political dialogue again. Even though the represented votes wouldn't
        have crossed the 60% threshold, this vote was notable in that &gt;50% of
        the population represented supported impeachment while &lt;50% of
        Senators did. This was compounded by the manner in which the Senate
        failed to thoroughly consider the impeachment.
      </Paragraph>

      <DynamicChartFigure
        id="impeachment"
        population={population}
        vote={vote}
      />

      <Paragraph className="mt-10">
        There have been several requests for a tool to help visualize the
        inconsistency between Senate votes and the populations represented. The
        hope is that this website will help illuminate the unfairness and
        inequality that exist within our current structure.
      </Paragraph>

      <section className="flex justify-center m-10">
        <Link href="/votes">
          <a className="bg-blue-500 hover:bg-blue-700 text-xl md:text-2xl text-white text-center font-bold py-2 px-4 rounded">
            View All Senate Votes
          </a>
        </Link>
      </section>
    </Main>
  );
}

export async function getStaticProps() {
  const vote = await import('../content/impeachment.json');
  const population = await import('../content/population/2019.json');

  const years = getYears();

  const tallies = await Promise.all(
    years.map(async (year) => {
      const population = await import(`../content/population/${year}.json`);
      const votes = await getVotesInYear(year);
      const analysis = getYearAnalysis(votes, population);

      return {
        total: votes.length,
        unpopular: analysis.unpopular,
      };
    })
  );

  const total = tallies.reduce(
    (sum, tally) => {
      return {
        unpopular: sum.unpopular + tally.unpopular,
        votes: sum.votes + tally.total,
      };
    },
    { unpopular: 0, votes: 0 }
  );

  return {
    props: {
      population: population.default,
      unpopularPercentage: Math.round(100 * (total.unpopular / total.votes)),
      vote: vote.default,
    },
  };
}
