import { compare, hash } from 'bcrypt';
import { Document, Model, model, Schema } from 'mongoose';
import * as mongoose_delete from 'mongoose-delete';
import { duplicateKeyError } from '../middlewares/duplicate-key-error';

export interface IAdmin extends Document {
  first_name: string;
  last_name: string;
  email: string;
  email_verified: boolean;
  email_verification_code: string;
  password: string;
  level: number; //admin level should be determined by an enum, level of access can be controlled using this field
}

const schema: Schema<IAdmin> = new Schema(
  {
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: { type: String, required: true },
    level: { type: Number, default: 1 },
    email_verified: { type: Boolean },
    email_verification_code: { type: String }
  },
  { timestamps: true },
);

schema.set('toJSON', {
  versionKey: false,
  transform: (doc, ret, options) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.password;
    return ret;
  },
});

schema.pre('save', async function (next): Promise<void> {
  if (this.isNew) {
    const doc: any = this;
    if (doc.password !== '') {
      doc.password = await hash(doc.password, 10);
    }
  }
  next();
});

schema.post('save', duplicateKeyError);
schema.post('update', duplicateKeyError);
schema.post('findOneAndUpdate', duplicateKeyError);

schema.plugin(mongoose_delete, {
  overrideMethods: true,
  deletedAt: true,
  deletedBy: true,
  indexFields: true,
});

schema.methods.comparePassword = async function (password): Promise<boolean> {
  return await compare(password, this.password);
};

schema.index({ createdAt: 1 });
schema.index({ updatedAt: 1 });

export interface IAdminModel extends Model<IAdmin> {}

export const Admin: IAdminModel = model<IAdmin, IAdminModel>('admin', schema);