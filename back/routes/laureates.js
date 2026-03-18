const express = require('express');
const router = express.Router();
const { getDB } = require('../db');

router.get('/', async (req, res) => {
  const { category, year, country, search } = req.query;

  const filter = {};

  // category
  if (category) {
    filter["nobelPrizes.category.en"] = new RegExp(category, 'i');
  }

  // year
  if (year) {
    filter["nobelPrizes.awardYear"] = year;
  }

  // country
  if (country) {
    filter["birth.place.country.en"] = new RegExp(country, 'i');
  }

  // search (imię + nazwisko)
  if (search) {
    filter["$or"] = [
      { "givenName.en": new RegExp(search, 'i') },
      { "familyName.en": new RegExp(search, 'i') }
    ];
  }

  const db = getDB();

  const laureates = await db
    .collection('laureates')
    .find(filter)
    .limit(100)
    .toArray();

  res.json(laureates);
});


// GET by ID
router.get('/:id', async (req, res) => {
  const { ObjectId } = require('mongodb');
  const db = getDB();

  try {
    const laureate = await db
      .collection('laureates')
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!laureate) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json(laureate);
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID' });
  }
});

module.exports = router;