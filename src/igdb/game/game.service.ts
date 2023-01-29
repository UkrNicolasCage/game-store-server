import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { getGamesDto } from './dto';
import { headers, igdbURL } from '../consts';
import { Game } from './interfaces';
import { buildGamesPrevsList } from './helpers';
import { GameCover } from './interfaces/game';

@Injectable()
export class GameService {
  constructor(
    private readonly httpService: HttpService,
  ) {}

  async getGames(dto: getGamesDto) {
    try {
      const games: Game[] = await this.httpService
        .axiosRef({
          url: `${igdbURL}/games`,
          method: 'POST',
          headers: headers,
          data: `fields *; offset ${dto.offset}; limit ${dto.limit};`,
        })
        .then((response) => {
          return response.data;
        });

      // get game cover
      let gamesCoversIds = games.map((game: Game) =>
        game.cover ? game.cover : null,
      );
      gamesCoversIds = gamesCoversIds.filter(
        (cover) => cover != null,
      );

      const gamesCoversIdsString =
        gamesCoversIds.join(',');

      const gamesCovers: GameCover[] =
        await this.httpService
          .axiosRef({
            url: `${igdbURL}/covers`,
            method: 'POST',
            headers: headers,
            data: `fields url; where id = (${gamesCoversIdsString});`,
          })
          .then((response) => {
            return response.data;
          });
          
      return buildGamesPrevsList(games, gamesCovers);
    } catch (err) {
      console.error(err);
    }
    // return response;
  }
}
