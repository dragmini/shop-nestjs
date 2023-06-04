import { Controller, Get, HttpCode } from '@nestjs/common'
import { StatisticsService } from './statistics.service'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { Auth } from 'src/auth/decorators/auth.decorator'

@Controller('statistics')
export class StatisticsController {
	constructor(private readonly statisticsService: StatisticsService) {}

	@Get('')
	@Auth()
	@HttpCode(200)
	async getMain(@CurrentUser('id') id: number) {
		return await this.statisticsService.getMain(id)
	}
}
