const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db.js');

const router = express.Router();

const app = express();


app.use(cors());
app.use(express.json());

app.use('/api', router);
app.use('/api/stats', router)

const laureatesRoutes = require('./routes/laureates');
app.use('/api/laureates', laureatesRoutes);

const statsRoutes = require('./routes/stats')
app.use('/api/stats', statsRoutes)


const { getDB } = require('./db');

app.get("/", (req, res) => {
  res.redirect('/api')
})


router.get('/', async (req, res) => {
  const { category, year, country, search } = req.query;
  const filter = {}
  if (category) filter['prizes.category'] = category;
  if (country) filter['bornCountry'] = new RegExp(country, 'i');
  if (search) filter['$or'] = [
    { firstname: new RegExp(search, 'i') },
    { surname: new RegExp(search, 'i') }
  ];
  const db = getDB();
  const laureates = await db
    .collection('laureates')
    .find(filter).toArray();
  res.json(laureates);
});



const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`działa na porcie ${PORT}`);
  });
});
