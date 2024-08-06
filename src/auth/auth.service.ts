import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/auth-schema';
import { Model } from 'mongoose';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import * as jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
// import { JwtPayload } from 'src/interface/jwt-payload';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private user: Model<User>) {}

  async registerUser(registerDto: RegisterDto) {
    const { email, fullName, photo, password } = registerDto;
    const isEmailExist = await this.user.findOne({ email });
    if (isEmailExist) throw new ConflictException('Email already exist');

    const hashPassword = await bcrypt.hashSync(password, 10);

    const newUser = new this.user({
      email,
      fullName,
      photo,
      password: hashPassword,
    });
    // await newUser.save();

    return { message: 'Registration successfull', data: newUser };
  }

  async login(userDto: LoginDto) {
    const { email, password } = userDto;

    const isEmailExist = await this.user.findOne({ email });

    if (!isEmailExist) throw new UnauthorizedException('Invalid Credentials');

    const isPasswordMatch: boolean = await bcrypt.compare(
      password,
      isEmailExist.password,
    );

    if (!isPasswordMatch)
      throw new UnauthorizedException('Invalid Credentials');

    const token = jwt.sign({ userID: isEmailExist._id }, process.env.JWT_KEY);

    return {
      token,
      data: {
        fullName: isEmailExist.fullName,
        photo: isEmailExist.photo,
        email: isEmailExist.email,
        _id: isEmailExist._id,
      },
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new ForbiddenException('Invalid object id');
    const user = await this.user.findById(id).select('-password');
    if (!user) throw new NotFoundException('User not found');

    return user;
  }
}
