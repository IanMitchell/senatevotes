import React from 'react';
import { getState } from '../lib/states';
import TD from './TD';
import TH from './TH';
import TR from './TR';

export default function VoteTable({ vote, population }) {
  const { positions } = vote.results.votes.vote;

  return (
    <table className="w-full text-xs md:text-base flex flex-row flex-no-wrap overflow-hidden my-5 mt-8 responsive-table">
      <thead>
        {positions.map((position, idx) => (
          <TR key={idx} offset={Boolean(idx % 2)} className="border text-left">
            <TH className="border-b-2 md:border-0">Name</TH>
            <TH className="border-b-2 md:border-0">Party</TH>
            <TH className="border-b-2 md:border-0">Vote</TH>
            <TH className="border-b-2 md:border-0">State</TH>
            <TH>Pop. Represented</TH>
          </TR>
        ))}
      </thead>
      <tbody className="flex-1 sm:flex-none">
        {positions.map((position, idx) => (
          <TR key={idx} offset={Boolean(idx % 2)}>
            <TD>{position.name}</TD>
            <TD>{position.party}</TD>
            <TD>{position.vote_position}</TD>
            <TD>{getState(position.state)}</TD>
            <TD>
              {Math.round(
                population[getState(position.state)] / 2
              ).toLocaleString()}
            </TD>
          </TR>
        ))}
      </tbody>
    </table>
  );
}
