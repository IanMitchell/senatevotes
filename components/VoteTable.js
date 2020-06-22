import React from 'react';
import { getState } from '../lib/states';
import TD from './TD';
import TH from './TH';
import TR from './TR';

export default function VoteTable({ vote, population }) {
  return (
    <table className="table-auto w-full mt-8">
      <thead>
        <TR>
          <TH>Name</TH>
          <TH>Party</TH>
          <TH>Vote</TH>
          <TH>State</TH>
          <TH>Population Represented</TH>
        </TR>
      </thead>
      <tbody>
        {vote.results.votes.vote.positions.map((position, idx) => (
          <TR offset={Boolean(idx % 2)} key={idx}>
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
