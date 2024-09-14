import { compare, hash } from 'bcrypt';
import { Document, Model, model, Schema } from 'mongoose';
import * as mongoose_delete from 'mongoose-delete';
import { randomNumber } from '../helpers';
import { duplicateKeyError } from '../middlewares/duplicate-key-error';

export interface IUser extends Document {
  first_name: string;
  last_name: string;
  email: string;
  email_verified: boolean;
  email_verification_code: string;
  password: string;
  business_type: string;
}

const schema: Schema<IUser> = new Schema(
  {
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email_verified: { type: Boolean },
    email_verification_code: { type: String },
    business_type: { type: String },
    password: { type: String }
  },
  { timestamps: true },
);

schema.set('toJSON', {
  versionKey: false,
  transform: (doc, ret, options) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.password;
    delete ret.email_verification_code;
    return ret;
  },
});

schema.pre('save', async function (next): Promise<void> {
  if (this.isNew) {
    const doc: any = this;
    doc.email_verification_code = randomNumber();
    if (doc && doc.password) {
      try {
        if (doc.password !== '') {
          const hashedpw = await hash(doc.password, 10);
          doc.password = hashedpw;
        }
      } catch (err) {
        throw new Error('Error hashing password');
      }
    } else {
      throw new Error('Password is required');
    }
  }
  next();
});

schema.post('save', duplicateKeyError);
schema.post('update', duplicateKeyError);
schema.post('findOneAndUpdate', duplicateKeyError);

schema.plugin(mongoose_delete, {
  overrideMethods: ['count', 'find', 'findOne', 'findById', 'update'],
  deletedAt: true,
  deletedBy: true,
  indexFields: true,
});

schema.methods.comparePassword = async function (password): Promise<boolean> {
  return await compare(password, this.password);
};

schema.index({ createdAt: 1 });
schema.index({ updatedAt: 1 });

export interface IUserModel extends Model<IUser> {}

export const User: IUserModel = model<IUser, IUserModel>('user', schema);