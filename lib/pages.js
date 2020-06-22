import fs from 'fs';
import path from 'path';

export function getYears() {
  const directory = path.join(process.cwd(), './content/population');
  const files = fs.readdirSync(directory);

  return files.map((filename) =>
    parseInt(path.basename(filename, '.json'), 10)
  );
}

export async function getVotesInYear(year) {
  const directory = path.join(process.cwd(), `./content/votes/${year}`);
  const files = fs
    .readdirSync(directory)
    .sort((a, b) => parseInt(a.split('.')[0], 10) - parseInt(b.split('.')[0]));

  const votes = await Promise.all(
    files.map((filename) => import(`../content/votes/${year}/${filename}`))
  );

  return votes.map((vote) => vote.default);
}
