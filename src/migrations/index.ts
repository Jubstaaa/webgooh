import * as migration_20261119_215621_baseline from './20261119_215621_baseline';

export const migrations = [
  {
    up: migration_20261119_215621_baseline.up,
    down: migration_20261119_215621_baseline.down,
    name: '20261119_215621_baseline'
  },
];
