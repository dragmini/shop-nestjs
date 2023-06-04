import { Prisma } from '@prisma/client'
import { returnCategoryObject } from 'src/category/return-category.object'
import { returnReviewObject } from 'src/review/return-review.object'

export const returnProguctObject: Prisma.ProductSelect = {
	images: true,
	description: true,
	id: true,
	name: true,
	price: true,
	createAt: true,
	slug: true
}

export const returnProguctObjectFullest: Prisma.ProductSelect = {
	...returnProguctObject,
	reviews: {
		select: returnReviewObject
	},
	category: {
		select: returnCategoryObject
	}
}
