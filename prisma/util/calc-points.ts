import type {
  PassingStats,
  RushingStats,
  RecievingStats,
} from '@prisma/client';

export function calculatePassingPoints({
  yards,
  touchdowns,
  interceptions,
}: PassingStats) {
  return yards / 25 + touchdowns * 6 - interceptions * 2;
}

export function calculateRushingPoints({
  yards,
  touchdowns,
  fumblesLost,
}: RushingStats) {
  return yards / 10 + touchdowns * 6 - fumblesLost * 2;
}

export function calculateRecievingPoints({
  yards,
  receptions,
  touchdowns,
}: RecievingStats) {
  return yards / 10 + touchdowns * 6 + receptions;
}
