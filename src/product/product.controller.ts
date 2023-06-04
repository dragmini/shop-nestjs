import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { ProductService } from './product.service'
import { GetAllProductDto } from './dto/get-all.product.dto'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { ProductDto } from './dto/product.dto'

@Controller('products')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Get()
	@UsePipes(new ValidationPipe())
	async getAll(@Query() queryDto: GetAllProductDto) {
		return this.productService.getAll(queryDto)
	}

	@Get('similar/:id')
	async getSimilar(@Param('id') id: string) {
		return this.productService.getSimilar(+id)
	}

	@Get('by-slug/:slug')
	async getProductsBySlug(@Param('slug') slug: string) {
		return this.productService.bySlug(slug)
	}

	@Get('by-category/:categorySlug')
	@UsePipes(new ValidationPipe())
	async getProductsByCategory(@Param('categorySlug') categorySlug: string) {
		return this.productService.byCategory(categorySlug)
	}

	@Post()
	@Auth()
	@HttpCode(200)
	async createProduct() {
		return this.productService.create()
	}

	@Put(':id')
	@Auth()
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	async updateProduct(@Param('id') id: string, @Body() dto: ProductDto) {
		return this.productService.update(+id, dto)
	}

	@Delete(':id')
	@Auth()
	@HttpCode(200)
	async deleteProduct(@Param('id') id: string) {
		return this.productService.delete(+id)
	}

	@Get(':id')
	async setProduct(@Param('id') id: string) {
		return this.productService.byId(+id)
	}
}
