const { MongoClient } = require('mongodb');
require('dotenv').config();

async function importData() {

  const response = await fetch("https://api.nobelprize.org/2.1/laureates");
  const data = await response.json();

  const rawLaureates = data.laureates;

  const laureates = rawLaureates.map(l => {

    const prizes = l.prizes.map(p => ({
        // to do
    }))

    return {
        firstname: l.givenName?.en ||"",
        surname: l.familyName?.en || "",
        bornCountry: l.birth?.place?.country?.en || "",
        bornCity: l.birth?.place?.city?.en || "",
        born: l.birth?.date || "",  
        bornYear: l.birth?.year || "",

    }
  })

  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();

  const db = client.db('nobel');

  await db.collection('laureates').deleteMany({});

  await db.collection('laureates').insertMany(laureates);

  console.log("Laureates imported:", laureates.length);

  await client.close();
}

importData();