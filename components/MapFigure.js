import * as ChartGeo from 'chartjs-chart-geo';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import classnames from 'classnames';
import React, { useContext, useEffect, useRef } from 'react';
import ColorContext from '../contexts/ColorContext';
import { getStatePopulationVote, getTotalPopulation } from '../lib/population';
import MapData from '../public/usa-map';
import FigCaption from './FigCaption';

export default function MapFigure({ className, vote, population }) {
  const mapRef = useRef();
  const colors = useContext(ColorContext);
  const states = ChartGeo.topojson.feature(MapData, MapData.objects.states);

  useEffect(() => {
    if (mapRef.current) {
      const context = mapRef.current.getContext('2d');

      const size = window.matchMedia('(max-width: 768px)').matches ? 100 : 200;
      const votes = getStatePopulationVote(vote, population, size);
      const totalPopulation = getTotalPopulation(population);

      Chart.plugins.unregister(ChartDataLabels);
      new Chart(context, {
        type: 'bubbleMap',
        data: {
          datasets: votes.map((information, index) => ({
            data: information.data,
            label: information.label,
            backgroundColor: Object.values(colors)[index],
            showOutline: true,
            outline: states,
          })),
        },
        options: {
          legend: {
            position: 'bottom',
          },
          scale: {
            projection: 'albersUsa',
          },
          tooltips: {
            callbacks: {
              label: (tooltipItem, data) => {
                const bubble =
                  data.datasets[tooltipItem.datasetIndex].data[
                    tooltipItem.index
                  ];

                return `${bubble.population.toLocaleString()} (${
                  Math.round(10000 * (bubble.population / totalPopulation)) /
                  100
                })%`;
              },
            },
          },
        },
        plugins: [],
      });
    }
  }, [population, vote, mapRef, colors, states]);

  return (
    <figure className={classnames(className)}>
      <canvas ref={mapRef} aria-label="Map Vote">
        <p>
          A visual representation of state population size and their
          representative votes.
        </p>
      </canvas>
      <FigCaption>Map of Popular Vote</FigCaption>
    </figure>
  );
}
