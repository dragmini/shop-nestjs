import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { returnReviewObject } from './return-review.object'
import { ReviewDto } from './dto/review.dto'
import { generateSlug } from 'src/utils/generate-slug'

@Injectable()
export class ReviewService {
	constructor(private prismaService: PrismaService) {}

	async getAll() {
		return this.prismaService.review.findMany({
			orderBy: {
				createAt: 'desc'
			},
			select: returnReviewObject
		})
	}

	async create(userId: number, dto: ReviewDto, productId: number) {
		return this.prismaService.review.create({
			data: {
				...dto,
				product: {
					connect: {
						id: productId
					}
				},
				user: {
					connect: {
						id: userId
					}
				}
			}
		})
	}

	async getAverageValueByProductId(productId: number) {
		return this.prismaService.review
			.aggregate({
				where: { productId },
				_avg: { rating: true }
			})
			.then(data => data._avg)
	}
}
