const express = require('express');
const router = express.Router();
const { getDB } = require('../db');

// 📊 Kategorie
router.get('/categories', async (req, res) => {
  const db = getDB();

  const result = await db.collection('laureates').aggregate([
    { $addFields: { prizes: { $ifNull: ['$prizes', '$nobelPrizes'] } } },
    { $unwind: '$prizes' },
    {
      $group: {
        _id: { $ifNull: ['$prizes.category.en', '$prizes.category'] },
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]).toArray();

  res.json(result);
});

// 🌍 Kraje (TOP 10)
router.get('/countries', async (req, res) => {
  const db = getDB();

  const result = await db.collection('laureates').aggregate([
    { $addFields: {
        countryName: {
            $ifNull: [
                '$bornCountry',
                '$birth.place.country.en',
                '$birth.place.country',
                '$bith.country'
            ]
          }
        } 
    },
    { $match: { countryName: { $ne: null } } },
    {
      $group: {
        _id: '$countryName',
        count: { $sum: 1 }
        //maybe add rank position 1, 2, 3, ..., 10
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]).toArray();

  res.json(result);
});

// 📅 Lata
router.get('/years', async (req, res) => {
  const db = getDB();

  const result = await db.collection('laureates').aggregate([
    { $addFields: { prizes: { $ifNull: ['$prizes', '$nobelPrizes'] } } },
    { $unwind: '$prizes' },
    {
      $group: {
        _id: '$prizes.awardYear',
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]).toArray();

  res.json(result);
});

// zrobić /api/map

module.exports = router;