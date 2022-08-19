import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private model: Model<UserDocument>) {}

  create(email: string, password: string): Promise<User> {
    const newUser = new this.model({ email, password });
    return newUser.save();
  }

  findOne(id: string): Promise<User> {
    if (!id) {
      return null;
    }
    return this.model.findById(id).exec();
  }

  find(email: string): Promise<User> {
    return this.model.findOne({ email }).exec();
  }
}
