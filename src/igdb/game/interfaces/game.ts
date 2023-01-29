interface Game {
  readonly id: number;
  readonly name: string;
  readonly age_ratings: number[];
  readonly category: number;
  readonly genres: number[];
  readonly involved_companies: number[];
  readonly similar_games: number[];
  readonly summary: string;
  readonly cover?: number;
}

interface GamePreview {
  readonly id: number;
  readonly name: string;
  readonly cover: string;
}

interface GameCover {
  readonly id: number;
  readonly url: string;
}

export { Game, GamePreview, GameCover };
