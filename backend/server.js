const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// 1. Frontend ෆෝල්ඩරය static ලෙස පෙන්වීමට Express වලට සැකසීම (Vercel එකට ගැලපෙන සේ process.cwd() යොදා ඇත)
app.use(express.static(path.join(process.cwd(), 'frontend')));

// Database connection (optional). When available we will use Sequelize models.
let db = null;
try {
  db = require('./db');
  // attempt to sync and seed in background (non-blocking)
  (async () => {
    try {
      await db.sequelize.authenticate();
      await db.sequelize.sync();
      // seed defaults if empty
      const count = await db.Boarding.count();
      if (count === 0) {
        await db.Boarding.bulkCreate(boardings.map(b => ({
          name: b.name,
          location: b.location,
          price: b.price,
          distance: b.distance,
          girlsOnly: b.girlsOnly,
          facilities: b.facilities,
          verified: b.verified,
          safetyScore: b.safetyScore,
          rating: b.rating,
          reviews: b.reviews,
          image: b.image,
          lat: b.lat,
          lng: b.lng
        })));
      }
    } catch (e) {
      console.warn('DB sync/seed failed:', e.message || e);
    }
  })();
} catch (e) {
  // db not configured; continue with in-memory mock data
}

// Mock Data
const boardings = [
  {
    id: 1,
    name: "Greenwood Female Residence",
    location: "Colombo Campus Zone",
    price: 15000,
    distance: 1.2,
    girlsOnly: true,
    facilities: ["WiFi", "Meals", "Laundry"],
    verified: true,
    safetyScore: 9.5,
    rating: 4.8,
    reviews: 120,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80",
    lat: 6.9271,
    lng: 79.8612
  },
  {
    id: 2,
    name: "Tech Hub Dorms",
    location: "Engineering College",
    price: 12000,
    distance: 0.5,
    girlsOnly: false,
    facilities: ["WiFi", "AC"],
    verified: true,
    safetyScore: 8.2,
    rating: 4.2,
    reviews: 85,
    image: "https://images.unsplash.com/photo-15555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80",
    lat: 6.9281,
    lng: 79.8622
  },
  {
    id: 3,
    name: "Serenity Stay (Girls)",
    location: "University West Gate",
    price: 18000,
    distance: 2.0,
    girlsOnly: true,
    facilities: ["WiFi", "AC", "Meals", "Gym"],
    verified: true,
    safetyScore: 9.8,
    rating: 4.9,
    reviews: 210,
    image: "https://images.unsplash.com/photo-1502672260266-1c1e541890e6?auto=format&fit=crop&w=600&q=80",
    lat: 6.9300,
    lng: 79.8600
  }
];

// API Routes
app.get('/api/boardings', async (req, res) => {
  const { maxPrice, maxDistance, girlsOnly } = req.query;
  if (db && db.Boarding) {
    try {
      const where = {};
      if (maxPrice) where.price = { [db.Sequelize.Op.lte]: parseInt(maxPrice) };
      if (maxDistance) where.distance = { [db.Sequelize.Op.lte]: parseFloat(maxDistance) };
      if (girlsOnly === 'true') where.girlsOnly = true;

      const rows = await db.Boarding.findAll({ where });
      return res.json(rows);
    } catch (err) {
      console.error('DB query failed:', err);
      return res.status(500).json({ error: 'Database error' });
    }
  }

  // Fallback to in-memory filter
  let filtered = boardings.slice();
  if (maxPrice) filtered = filtered.filter(b => b.price <= parseInt(maxPrice));
  if (maxDistance) filtered = filtered.filter(b => b.distance <= parseFloat(maxDistance));
  if (girlsOnly === 'true') filtered = filtered.filter(b => b.girlsOnly === true);
  res.json(filtered);
});

app.post('/api/bookings', async (req, res) => {
  const { boardingId, studentName, date, userEmail } = req.body;
  if (db && db.Booking) {
    try {
      let user = null;
      if (userEmail) user = await db.User.findOne({ where: { email: userEmail } });
      const booking = await db.Booking.create({ boardingId, userId: user ? user.id : null, studentName, date });
      return res.json({ success: true, booking });
    } catch (err) {
      console.error('Failed to create booking:', err);
      return res.status(500).json({ success: false, message: 'Failed to create booking' });
    }
  }

  // Fallback
  res.json({ success: true, message: `Booking request sent to boarding ${boardingId} for ${studentName}` });
});

// Mock Users
const users = [
  { email: "student@test.com", password: "password123", name: "Alex Student" }
];

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (db && db.User) {
    try {
      const user = await db.User.findOne({ where: { email, password } });
      if (user) return res.json({ success: true, message: 'Login successful', user: { name: user.name, email: user.email } });
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  // Fallback mock users
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    res.json({ success: true, message: 'Login successful', user: { name: user.name, email: user.email } });
  } else {
    res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
});

// 2. වෙනත් ඕනෑම Route එකකදී Frontend එකේ index.html එක Load කිරීම
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'frontend', 'index.html'));
});

// ✅ Vercel එකට අත්‍යවශ්‍ය Export එක (app.listen එකක් අවශ්‍ය නැත)
module.exports = app;