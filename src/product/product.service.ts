import { Injectable, NotFoundException } from '@nestjs/common'
import {
	returnProguctObject,
	returnProguctObjectFullest
} from './return-product.object'
import { PrismaService } from 'src/prisma.service'
import { ProductDto } from './dto/product.dto'
import { generateSlug } from 'src/utils/generate-slug'
import { EnumProductSort, GetAllProductDto } from './dto/get-all.product.dto'
import { PaginationService } from 'src/pagination/pagination.service'
import { Prisma } from '@prisma/client'
import { contains } from 'class-validator'

@Injectable()
export class ProductService {
	constructor(
		private prismaService: PrismaService,
		private paginationService: PaginationService
	) {}

	async getAll(dto: GetAllProductDto = {}) {
		const { sort, searchTerm } = dto

		const prismaSort: Prisma.ProductOrderByWithRelationInput[] = []

		switch (sort) {
			case EnumProductSort.LOW_PRICE: {
				prismaSort.push({ price: 'asc' })
				break
			}
			case EnumProductSort.HIGH_PRICE: {
				prismaSort.push({ price: 'desc' })
			}
			case EnumProductSort.OLDEST: {
				prismaSort.push({ createAt: 'asc' })
				break
			}
			default: {
				prismaSort.push({ price: 'desc' })
				break
			}
		}

		const prismaSearchTermFilter: Prisma.ProductWhereInput = searchTerm
			? {
					OR: [
						{
							category: {
								name: {
									contains: searchTerm,
									mode: 'insensitive'
								}
							}
						},
						{
							name: {
								contains: searchTerm,
								mode: 'insensitive'
							}
						},
						{
							description: {
								contains: searchTerm,
								mode: 'insensitive'
							}
						}
					]
			  }
			: {}

		const { perPage, skip } = this.paginationService.getPagination(dto)

		const products = await this.prismaService.product.findMany({
			where: prismaSearchTermFilter,
			orderBy: prismaSort,
			skip,
			take: perPage
		})

		return {
			products,
			length: await this.prismaService.product.count({
				where: prismaSearchTermFilter
			})
		}
	}

	async byId(id: number) {
		const product = await this.prismaService.product.findUnique({
			where: {
				id
			},
			select: returnProguctObjectFullest
		})

		if (!product) throw new NotFoundException('Product not found')

		return product
	}

	async bySlug(slug: string) {
		const product = await this.prismaService.product.findUnique({
			where: {
				slug
			},
			select: returnProguctObjectFullest
		})

		if (!product) throw new NotFoundException('Product not found')

		return product
	}

	async byCategory(categorySlug: string) {
		const products = await this.prismaService.product.findMany({
			where: {
				category: {
					slug: categorySlug
				}
			},
			select: returnProguctObjectFullest
		})

		if (!products) throw new NotFoundException('Product not found')

		return products
	}

	async getSimilar(id: number) {
		const currentProduct = await this.byId(id)

		if (!currentProduct)
			throw new NotFoundException('Current product not found')

		const products = await this.prismaService.product.findMany({
			where: {
				category: {
					slug: currentProduct.category.name
				},
				NOT: {
					id: currentProduct.id
				}
			},
			orderBy: {
				createAt: 'desc'
			},
			select: returnProguctObjectFullest
		})

		return products
	}

	async create() {
		const product = await this.prismaService.product.create({
			data: {
				description: '',
				name: '',
				price: 0,
				slug: ''
			}
		})

		return product.id
	}

	async update(id: number, dto: ProductDto) {
		const { description, name, images, price, categoryId } = dto

		return this.prismaService.product.update({
			where: {
				id
			},
			data: {
				name,
				description,
				images,
				price,
				slug: generateSlug(dto.name),
				category: {
					connect: {
						id: categoryId
					}
				}
			}
		})
	}

	async delete(id: number) {
		return this.prismaService.product.delete({
			where: {
				id
			}
		})
	}
}
