import React from 'react';
import { VictoryLabel, VictoryTooltip } from 'victory';

export default function VictoryTooltipAndLabel(props) {
  const labelProps = { ...props };
  const tooltipProps = { ...props };

  return (
    <g>
      <VictoryLabel {...props} text={({ datum }) => datum.x} />
      <VictoryTooltip {...props} text={({ datum }) => datum.label ?? datum.x} />
    </g>
  );
}

VictoryTooltipAndLabel.defaultEvents = VictoryTooltip.defaultEvents;
