import { Controller, Get } from '@nestjs/common'
import { OrderService } from './order.service'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { Auth } from 'src/auth/decorators/auth.decorator'

@Controller('orders')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@Get()
	@Auth()
	async getOrder(@CurrentUser('id') userId: number) {
		return await this.orderService.getAll(userId)
	}
}
