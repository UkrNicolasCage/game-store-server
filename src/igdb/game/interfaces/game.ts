interface Game {
  readonly id: number;
  readonly age_ratings: number[];
  readonly category: number;
  readonly genres: number[];
  readonly involved_companies: number[];
  readonly similar_games: number[];
  readonly summary: string;
  readonly cover: number;
}

export { Game };
