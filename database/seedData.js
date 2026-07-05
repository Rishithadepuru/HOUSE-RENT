const path = require('path');
const fs = require('fs');

// Allow resolution from backend's node_modules
const backendModulesPath = path.join(__dirname, '../backend/node_modules');
process.env.NODE_PATH = backendModulesPath;
require('module').Module._initPaths();

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from backend folder
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const User = require('../backend/models/User');
const Property = require('../backend/models/Property');
const Booking = require('../backend/models/Booking');
const Review = require('../backend/models/Review');
const Wishlist = require('../backend/models/Wishlist');

// Read JSON sample data
const sampleProperties = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'sampleProperties.json'), 'utf-8')
);

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/househunt';
    console.log(`Connecting to database: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('Database connection successful!');

    // Clear old data
    console.log('Clearing old collections...');
    await User.deleteMany();
    await Property.deleteMany();
    await Booking.deleteMany();
    await Review.deleteMany();
    await Wishlist.deleteMany();
    console.log('Data cleared successfully.');

    // 1. Create Default Users
    console.log('Seeding baseline users...');
    const users = await User.create([
      {
        name: 'John Tenant',
        email: 'tenant@househunt.com',
        password: 'password123',
        phone: '+91 98765 43210',
        role: 'tenant',
        profileImage: '',
      },
      {
        name: 'Jane Landlord',
        email: 'landlord@househunt.com',
        password: 'password123',
        phone: '+91 87654 32109',
        role: 'landlord',
        profileImage: '',
      },
      {
        name: 'Alex Admin',
        email: 'admin@househunt.com',
        password: 'password123',
        phone: '+91 76543 21098',
        role: 'admin',
        profileImage: '',
      },
    ]);

    const tenant = users[0];
    const landlord = users[1];
    const admin = users[2];

    console.log(`Users created:`);
    console.log(`- Tenant: ${tenant.email} (password: password123)`);
    console.log(`- Landlord: ${landlord.email} (password: password123)`);
    console.log(`- Admin: ${admin.email} (password: password123)`);

    // 2. Initialize Empty Wishlists for users
    await Wishlist.create([
      { user: tenant._id, properties: [] },
      { user: landlord._id, properties: [] },
      { user: admin._id, properties: [] },
    ]);

    // 3. Create Sample Properties owned by Jane Landlord
    console.log('Seeding sample property listings...');
    const propertiesData = sampleProperties.map((property) => {
      return {
        ...property,
        owner: landlord._id,
      };
    });

    // Let's add one property as "pending" for admin approval testing
    propertiesData.push({
      title: "Charming Lakefront Cottage",
      description: "Escape to nature in this gorgeous wooden cottage situated directly on the lake. Perfect weekend getaway with a large boat dock, wood-burning stove, and glass-paneled sunroom.",
      address: "12 Whispering Pines Route",
      city: "bangalore",
      state: "karnataka",
      price: 5200,
      propertyType: "house",
      bedrooms: 2,
      bathrooms: 1.5,
      area: 1100,
      amenities: ["AC", "Parking", "Pets Allowed", "Garden", "Waterfront", "Fireplace"],
      images: [
        "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80"
      ],
      furnished: "semi",
      parking: true,
      petsAllowed: true,
      virtualTourUrl: "",
      status: "pending", // Pending approval!
      owner: landlord._id,
      views: 12
    });

    const seededProperties = await Property.create(propertiesData);
    console.log(`${seededProperties.length} property listings seeded.`);

    // 4. Seed a Review
    console.log('Seeding sample review...');
    await Review.create({
      user: tenant._id,
      property: seededProperties[0]._id, // first property
      rating: 5,
      comment: "Absolutely breathtaking penthouse! The view is incredible, the marble finishes are exquisite, and Jane was a fantastic landlord. Highly recommended!",
    });

    // 5. Seed a Booking Request
    console.log('Seeding sample visit booking request...');
    await Booking.create({
      tenant: tenant._id,
      property: seededProperties[1]._id, // second property
      visitDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days in future
      visitTime: '11:00 AM',
      message: 'Hello, I would love to check out this villa. I am a software engineer and looking for a quiet workspace.',
      status: 'pending',
    });

    console.log('\n\x1b[32m🌟 [Database Seeding Completed Successfully!] 🌟\x1b[0m\n');
    process.exit(0);
  } catch (error) {
    console.error('\x1b[31mError seeding database:\x1b[0m', error);
    process.exit(1);
  }
};

seedData();
