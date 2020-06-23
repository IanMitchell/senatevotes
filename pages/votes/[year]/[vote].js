import React from 'react';
import dynamic from 'next/dynamic';
import Main from '../../../components/Main';
import Navigation from '../../../components/Navigation';
import Social from '../../../components/Social';
import Spinner from '../../../components/Spinner';
import VoteTable from '../../../components/VoteTable';
import { getYears, getVotesInYear } from '../../../lib/pages';

const DynamicChartFigure = dynamic(
  () => import('../../../components/ChartFigure'),
  {
    loading: () => <Spinner />,
  }
);

export default function SenateVote({ year, population, vote }) {
  return (
    <Main>
      <Social />

      {year && (
        <Navigation
          href="/votes/[year]"
          as={`/votes/${year}`}
          text={`All ${year} Votes`}
        />
      )}

      <DynamicChartFigure id={vote} population={population} vote={vote} />

      <VoteTable vote={vote} population={population} />
    </Main>
  );
}

export async function getStaticProps(context) {
  const { year, vote } = context.params;

  const [data, population] = await Promise.all([
    import(`../../../content/votes/${year}/${vote}.json`),
    import(`../../../content/population/${year}.json`),
  ]);

  return {
    props: {
      year,
      vote: data.default,
      population: population.default,
    },
  };
}

export async function getStaticPaths() {
  const paths = [];

  const years = getYears();

  await Promise.all(
    years.map(async (year) => {
      const votes = await getVotesInYear(year);

      votes.forEach((vote) => {
        paths.push({
          params: {
            year: year.toString(),
            vote: vote.results.votes.vote.roll_call.toString(),
          },
        });
      });
    })
  );

  return {
    paths,
    fallback: false,
  };
}
