import * as mongoose from 'mongoose';
import { config } from '../config';

export const dbconnect = async (): Promise<void> => {
  mongoose.set('useCreateIndex', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useUnifiedTopology', true);
  try {
    await mongoose.connect(config.database.mongo_url, { useNewUrlParser: true });
    (mongoose as any).Promise = Promise;
    console.log('Connection established to database');
  } catch (err) {
    console.log(err);
    throw err;
  }
};
