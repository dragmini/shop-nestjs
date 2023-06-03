import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

export class UserDto {
	@IsOptional()
	@IsEmail()
	email: string

	@MinLength(8, {
		message: 'Пароль должен быть не менее 8 символов'
	})
	@IsOptional()
	@IsString()
	password?: string

	@IsOptional()
	@IsString()
	avatarPath: string

	@IsOptional()
	@IsString()
	name: string

	@IsOptional()
	@IsString()
	phone?: string
}
