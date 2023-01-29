import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { getGamesDto } from './dto';
import { headers, igdbURL } from '../Consts';
import { Game } from './interfaces';

@Injectable()
export class GameService {
  constructor(
    private readonly httpService: HttpService,
  ) {}

  async getGames(dto: getGamesDto) {
    try {
      const game: Game = await this.httpService
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
      // const coverURL = await this.httpService
      //   .axiosRef({
      //     url: `${igdbURL}/cover`,
      //     method: 'POST',
      //     headers: headers,
      //     data: `fields *; where id = ${game.cover};`,
      //   })
      //   .then((response) => {
      //     return response.data.url;
      //   });
      // return coverURL;
      return game;
    } catch (err) {
      console.error(err);
    }
    // return response;
  }
}
