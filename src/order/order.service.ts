import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class OrderService {
	constructor(private prismaServices: PrismaService) {}

	async getAll(userId: number) {
		return this.prismaServices.order.findMany({
			where: {
				userId
			},
			orderBy: {
				createAt: 'desc'
			}
		})
	}
}
