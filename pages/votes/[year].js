import React, { Fragment } from 'react';
import Link from 'next/link';
import Anchor from '../../components/Anchor';
import Heading from '../../components/Heading';
import Main from '../../components/Main';
import Navigation from '../../components/Navigation';
import Pill from '../../components/Pill';
import Social from '../../components/Social';
import SubHeading from '../../components/SubHeading';
import useBoolean from '../../hooks/useBoolean';
import {
  getVoteTitleAndNumber,
  isVotePopular,
  isResultSuccessful,
} from '../../lib/votes';
import { getYears, getVotesInYear } from '../../lib/pages';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function summarizeByMonth(votes, population) {
  return votes.reduce((group, vote) => {
    const month = new Date(
      vote.results.votes.vote.date
    ).toLocaleString('default', { month: 'long' });

    if (!(month in group)) {
      group[month] = [];
    }

    group[month].push({
      ...getVoteTitleAndNumber(vote),
      outcome: vote.results.votes.vote.result,
      rollcall: vote.results.votes.vote.roll_call,
      popular: isVotePopular(vote, population),
    });

    return group;
  }, {});
}

export default function SenateVote({ year, votes }) {
  const { value: unpopularFilter, toggle: toggleUnpopularFilter } = useBoolean(
    false
  );

  const months = MONTHS.filter(
    (month) =>
      votes[month] &&
      votes[month].some((summary) =>
        unpopularFilter ? !summary.popular : true
      )
  );

  return (
    <Main>
      <Social />

      <Navigation href="/votes" as="/votes" text="All Senate Votes" />

      <Heading className="mt-10 border-b-2 border-black mb-4">
        US Senate Votes in {year}
      </Heading>

      <div className="mb-6">
        <input
          type="checkbox"
          className="switch"
          name="popular-toggle"
          id="popular-toggle"
          defaultChecked={unpopularFilter}
          onClick={toggleUnpopularFilter}
        />
        <label
          className="inline-block align-top cursor-pointer text-sm mr-2"
          htmlFor="popular-toggle"
        >
          Only Display Unpopular Votes
        </label>
      </div>

      <section className="mt-2 mb-4">
        {months.map((month) => (
          <Fragment key={month}>
            <SubHeading className="mt-8">{month}</SubHeading>
            <ol className="ml-2">
              {votes[month]
                .filter((summary) =>
                  unpopularFilter ? !summary.popular : true
                )
                .map((summary) => (
                  <li key={summary.rollcall} className="p-2">
                    <Pill
                      type={
                        isResultSuccessful(summary.outcome)
                          ? 'success'
                          : 'failure'
                      }
                    >
                      {isResultSuccessful(summary.outcome) ? 'Pass' : 'Fail'}
                    </Pill>
                    <Pill type={summary.popular ? 'success' : 'failure'}>
                      {summary.popular
                        ? '✅ Popular Outcome'
                        : '❌ Unpopular Outcome'}
                    </Pill>
                    <Link
                      href="/votes/[year]/[vote]"
                      as={`/votes/${year}/${summary.rollcall}`}
                      passHref
                    >
                      <Anchor>
                        Rollcall {summary.rollcall} &bull; {summary.title}
                      </Anchor>
                    </Link>
                  </li>
                ))}
            </ol>
          </Fragment>
        ))}
      </section>
    </Main>
  );
}

export async function getStaticProps(context) {
  const population = await import(
    `../../content/population/${context.params.year}.json`
  );

  const votes = await getVotesInYear(context.params.year);

  return {
    props: {
      year: context.params.year,
      votes: summarizeByMonth(votes, population),
    },
  };
}

export async function getStaticPaths() {
  const years = getYears();

  return {
    paths: years.map((year) => ({ params: { year: year.toString() } })),
    fallback: false,
  };
}
