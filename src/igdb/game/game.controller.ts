import {
  Body,
  Controller,
  Get,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GameService } from './game.service';
import { getGamesDto } from './dto/';

@Controller('games')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get('')
  @UsePipes(new ValidationPipe({ transform: true }))
  getGames(@Body() dto: getGamesDto) {
    return this.gameService.getGames(dto);
  }

  
}
