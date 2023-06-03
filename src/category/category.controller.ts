import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { CategoryService } from './category.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CategoryDto } from './dto/category.dto'

@Controller('categories')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Get()
	async getCategories() {
		return this.categoryService.getAll()
	}

	@Get('by-slug/:slug')
	async getCategoryBySlug(@Param('slug') slug: string) {
		return this.categoryService.bySlug(slug)
	}

	@Get(':id')
	@Auth()
	async getCategoryById(@Param('id') id: string) {
		return this.categoryService.byId(+id)
	}

	@Put(':categoryId')
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	@Auth()
	async update(
		@Param('categoryId') categoryId: number,
		@Body() dto: CategoryDto
	) {
		return this.categoryService.update(+categoryId, dto)
	}

	@Post('')
	@HttpCode(200)
	@Auth()
	async create() {
		return this.categoryService.create()
	}

	@Delete(':categoryId')
	@HttpCode(200)
	@Auth()
	async delete(@Param('categoryId') categoryId: string) {
		return this.categoryService.delete(+categoryId)
	}
}
