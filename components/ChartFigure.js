import React, { useContext } from 'react';
import { VictoryPie, VictoryTooltip } from 'victory';
import ColorContext from '../contexts/ColorContext';
import useLocalStorage from '../hooks/useLocalStorage';
import { getTotalPopulationVote } from '../lib/population';
import {
  getVoteTitleAndNumber,
  isVotePopular,
  isResultSuccessful,
  getVoteTotals,
} from '../lib/votes';
import FigCaption from './FigCaption';
import Figure from './Figure';
import MapFigure from './MapFigure';
import Pill from './Pill';
import VictoryTooltipAndLabel from './VictoryTooltipAndLabel';

function getPercentage(value, entries) {
  return Math.round((100 * value) / entries.reduce((sum, val) => sum + val, 0));
}

export default function ChartFigure({
  id,
  vote,
  population,
  showTable = false,
}) {
  const [overlay, setOverlay] = useLocalStorage('overlay', true);
  const colors = useContext(ColorContext);

  const { title, number } = getVoteTitleAndNumber(vote);
  const totals = getVoteTotals(vote);
  const pop = getTotalPopulationVote(vote, population);
  const summary = {
    outcome: vote.results.votes.vote.result,
    popular: isVotePopular(vote, population),
  };

  return (
    <section className="mt-10 mb-10">
      <div className="flex flex-col md:flex-row justify-start border-b-2 pb-1">
        <h3 className="mr-6 font-bold">
          {number} &bull; {vote.results.votes.vote.vote_type} to pass
        </h3>
        <div className="flex flex-row border-b-2 pb-2 md:border-b-0 md:pb-0">
          <Pill
            type={isResultSuccessful(summary.outcome) ? 'success' : 'failure'}
            className="flex self-center"
          >
            {isResultSuccessful(summary.outcome) ? 'Pass' : 'Fail'}
          </Pill>
          <Pill
            type={summary.popular ? 'success' : 'failure'}
            className="flex self-center "
          >
            {summary.popular ? '✅ Popular Outcome' : '❌ Unpopular Outcome'}
          </Pill>
        </div>
        <div className="pt-4 pb-4 flex flex-row-reverse justify-end md:pt-0 md:pb-0 md:flex-row md:ml-auto">
          <label
            className="inline-block align-top cursor-pointer text-sm ml-2 md:mr-2"
            htmlFor={`${id}-overlay-toggle`}
          >
            Overlay Charts
          </label>
          <input
            type="checkbox"
            className="switch"
            name={`${id}-overlay-toggle`}
            id={`${id}-overlay-toggle`}
            defaultChecked={overlay}
            onClick={() => setOverlay(!overlay)}
          />
        </div>
      </div>
      <header className="border-b-4 pt-2 pb-2 mb-2">
        <h4 className="mr-auto text-lg font-bold">{title}</h4>
      </header>

      {!overlay && (
        <div className="flex flex-col md:flex-row flex-auto">
          <Figure>
            <VictoryPie
              categories={{ x: ['Yes', 'No', 'Abstain'] }}
              data={[
                { x: 'Yes', y: totals.yes, label: totals.yes },
                { x: 'No', y: totals.no, label: totals.no },
                {
                  x: 'Abstain',
                  y: totals.present + totals.not_voting,
                  label: totals.present + totals.not_voting,
                },
              ]}
              colorScale={Object.values(colors)}
              labelComponent={<VictoryTooltipAndLabel />}
              style={{ data: { stroke: 'white', strokeWidth: 2 } }}
            />
            <FigCaption>Senate Vote</FigCaption>
          </Figure>

          <Figure>
            <VictoryPie
              categories={{ x: ['Yes', 'No', 'Abstain'] }}
              data={[
                {
                  x: 'Yes',
                  y: pop.yes,
                  label: `${pop.yes.toLocaleString()} (${getPercentage(
                    pop.yes,
                    Object.values(pop)
                  )}%)`,
                },
                {
                  x: 'No',
                  y: pop.no,
                  label: `${pop.no.toLocaleString()} (${getPercentage(
                    pop.no,
                    Object.values(pop)
                  )}%)`,
                },
                {
                  x: 'Abstain',
                  y: pop.neutral,
                  label: `${pop.neutral.toLocaleString()} (${getPercentage(
                    pop.neutral,
                    Object.values(pop)
                  )}%)`,
                },
              ]}
              colorScale={Object.values(colors)}
              labelComponent={<VictoryTooltipAndLabel />}
              style={{ data: { stroke: 'white', strokeWidth: 2 } }}
            />
            <FigCaption>Population Represented</FigCaption>
          </Figure>
        </div>
      )}

      {overlay && (
        <figure>
          {/* TODO! */}
          <FigCaption>
            Inner: Senate Vote. Outer: Population Represented
          </FigCaption>
        </figure>
      )}

      <MapFigure className="mt-10" vote={vote} population={population} />
    </section>
  );
}
