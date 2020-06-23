import React from 'react';
import Anchor from './Anchor';

export default function Footer() {
  return (
    <footer className="mt-6 border-t-4 pt-2 pb-6 text-xs">
      <p>
        Vote data comes from{' '}
        <Anchor href="https://www.propublica.org/datastore/">ProPublica</Anchor>
        . Population data comes from the{' '}
        <Anchor href="https://www.census.gov/developers/">US Census</Anchor>.
        Website source code can be found on{' '}
        <Anchor href="https://github.com/ianmitchell/senatevotes">
          GitHub
        </Anchor>
        .
      </p>
      <p className="mt-4 md:mt-0">
        An interesting idea to fix this problem was published in the{' '}
        <Anchor href="https://harvardlawreview.org/2020/01/pack-the-union-a-proposal-to-admit-new-states-for-the-purpose-of-amending-the-constitution-to-ensure-equal-representation/">
          Harvard Law Review.
        </Anchor>
      </p>
      <p className="mt-4">
        Project by{' '}
        <Anchor
          className="font-bold no-underline"
          href="https://twitter.com/IanMitchel1"
        >
          @IanMitchel1
        </Anchor>
      </p>
    </footer>
  );
}
