import { Body, Controller, Get, Post } from '@nestjs/common';
import { SerializeArray } from 'src/interceptors/serialize-array.interceptor';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateTeamResponseDto } from './dtos/create-team-response.dto';
import { CreateTeamDto } from './dtos/create-team.dto';
import { ShowTeamDto } from './dtos/show-team.dto';
import { TeamsService } from './teams.service';

@Controller('teams')
export class TeamsController {
  constructor(private teamsService: TeamsService) {}

  @Get('/')
  @SerializeArray(ShowTeamDto)
  async getTeams() {
    const teams = await this.teamsService.getTeams();
    console.log(teams);
    return teams;
  }

  @Post('/createTeam')
  @Serialize(CreateTeamResponseDto)
  async createTeam(@Body() { owner, name }: CreateTeamDto) {
    const team = await this.teamsService.createTeam(owner, name);
    return team;
  }
}
