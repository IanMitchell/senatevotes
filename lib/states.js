import locations from '../public/state-locations.json';
import STATES from '../public/states.json';

export function getState(identifier) {
  if (Object.keys(STATES).includes(identifier)) {
    return identifier;
  }

  return Object.keys(STATES).find(key =>
    Object.values(STATES[key]).includes(identifier)
  );
}

export function getCoordinates(state) {
  return {
    latitude: locations[state][0],
    longitude: locations[state][1],
  };
}
