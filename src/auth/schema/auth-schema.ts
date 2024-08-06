import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class User extends Document {
    @Prop({ required: true })
    fullName: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: false, default: '' })
    photo: string;

    @Prop({ required: true })
    password: string
}

export const UserSchema = SchemaFactory.createForClass(User) 