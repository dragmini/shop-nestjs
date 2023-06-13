import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Patch,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { UserService } from './user.service'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { UserDto } from './dto/user.dto'

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	@Auth()
	async getProfile(@CurrentUser('id') id: number) {
		return this.userService.byId(id)
	}

	@Put('profile')
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	@Auth()
	async updateProfile(@CurrentUser('id') id: number, @Body() dto: UserDto) {
		return this.userService.updateProfile(id, dto)
	}

	@Get('profile/favorites')
	@Auth()
	async getProfileFavorites(@CurrentUser('id') id: number) {
		return this.userService.favorites(id)
	}

	@Patch('profile/favorites/:productId')
	@Auth()
	@HttpCode(200)
	async toggleFavorite(
		@CurrentUser('id') id: number,
		@Param('productId') productId: number
	) {
		return this.userService.toggleFavorite(+productId, id)
	}
}
