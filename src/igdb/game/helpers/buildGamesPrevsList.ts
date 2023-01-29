import { Game } from '../interfaces';
import {
  GameCover,
  GamePreview,
} from '../interfaces/game';

export const buildGamesPrevsList = (
  games: Game[],
  covers: GameCover[],
): GamePreview[] => {
  const gamesPrevs: GamePreview[] = games.map(
    (game: Game) => {
      let currentCover = covers.find(
        (cover: GameCover) => cover.id === game.cover,
      );
      const coverUrl = currentCover
        ? currentCover.url
        : 'https://via.placeholder.com/150';
      return {
        id: game.id,
        name: game.name,
        cover: coverUrl,
      };
    },
  );
  return gamesPrevs;
};
