import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MinLength, } from "class-validator";

export class RegisterDto {
    @IsNotEmpty({ message: "Full name is required" })
    @IsString({ message: "Full name must be string" })
    fullName: string;


    @IsNotEmpty({ message: "Email is required" })
    @IsEmail()
    email: string;

    @IsString({ message: "Photo must be in string format" })
    photo: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @IsStrongPassword({ minLength: 8, minLowercase: 1, minNumbers: 1, minSymbols: 1, minUppercase: 1 })
    password: string
}