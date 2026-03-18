const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

const laureatesRoutes = require('./routes/laureates');

app.use('/api/laureates', laureatesRoutes);

// stats endpoints będą tutaj 



const { getDB } = require('./db');

app.get('/api/stats/categories', async (req, res) => {
  const db = getDB();

  const result = await db.collection('laureates').aggregate([
    { $unwind: "$nobelPrizes" },
    {
      $group: {
        _id: "$nobelPrizes.category.en",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]).toArray();

  res.json(result);
});

app.get('/api/stats/countries', async (req, res) => {
  const db = getDB();

  const result = await db.collection('laureates').aggregate([
    {
      $group: {
        _id: "$birth.place.country.en",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]).toArray();

  res.json(result);
});

app.get('/api/stats/years', async (req, res) => {
  const db = getDB();

  const result = await db.collection('laureates').aggregate([
    { $unwind: "$nobelPrizes" },
    {
      $group: {
        _id: "$nobelPrizes.awardYear",
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]).toArray();

  res.json(result);
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server działa na porcie ${PORT}`);
  });
});