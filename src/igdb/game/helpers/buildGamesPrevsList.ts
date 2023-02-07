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
      let coverUrl = '';
      if (currentCover) {
        // change url size from 90 x 90 to 264 x 374
        const urlNormalSize = currentCover.url.replace(
          'thumb',
          'cover_big',
        );
        //
        coverUrl = urlNormalSize;
      } else {
        coverUrl = 'https://via.placeholder.com/150';
      }

      return {
        id: game.id,
        name: game.name,
        cover: coverUrl,
      };
    },
  );
  return gamesPrevs;
};
