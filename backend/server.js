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
app.get('/api/boardings', (req, res) => {
  let filtered = boardings;
  
  // Basic filtering
  const { maxPrice, maxDistance, girlsOnly } = req.query;
  
  if (maxPrice) {
    filtered = filtered.filter(b => b.price <= parseInt(maxPrice));
  }
  if (maxDistance) {
    filtered = filtered.filter(b => b.distance <= parseFloat(maxDistance));
  }
  if (girlsOnly === 'true') {
    filtered = filtered.filter(b => b.girlsOnly === true);
  }
  
  res.json(filtered);
});

app.post('/api/bookings', (req, res) => {
  const { boardingId, studentName, date } = req.body;
  // Mock booking logic
  res.json({ success: true, message: `Booking request sent to boarding ${boardingId} for ${studentName}` });
});

// Mock Users
const users = [
  { email: "student@test.com", password: "password123", name: "Alex Student" }
];

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    res.json({ success: true, message: "Login successful", user: { name: user.name, email: user.email } });
  } else {
    res.status(401).json({ success: false, message: "Invalid email or password" });
  }
});

// 2. වෙනත් ඕනෑම Route එකකදී Frontend එකේ index.html එක Load කිරීම
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'frontend', 'index.html'));
});

// ✅ Vercel එකට අත්‍යවශ්‍ය Export එක (app.listen එකක් අවශ්‍ය නැත)
module.exports = app;