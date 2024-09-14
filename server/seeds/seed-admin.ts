import * as mongoose from 'mongoose';
import { Admin } from '../models/admin';
import { config } from '../config';
import { randomNumber } from '../helpers';

const connectDB = async () => {
  try {
    await mongoose.connect(config.database.mongo_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Admin seeding process started: connected to db successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ email: 'admin@poixel.com' });
    
    if (existingAdmin) {
      console.log('Admin already exists, returning to application boot process...');
      return;
    }

    const adminData = {
      first_name: "Admin",
      last_name: "User",
      email: "admin@poixel.com",
      password: "$trongAdminP@ssword123",
      level: 10,
      email_verified: false,
      email_verification_code: randomNumber()
    };

    const admin = new Admin(adminData);
    await admin.save();

    console.log('Admin user seeded successfully');
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
};

export const runSeeder = async () => {
  await connectDB();
  await seedAdmin();
  mongoose.disconnect();
};