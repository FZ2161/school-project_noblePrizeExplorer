import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchLaureates } from '../api';

const RESTCOUNTRIES_URL = 'https://restcountries.com/v3.1/all?fields=name,cca2,flags,latlng,altSpellings';

function normalizeString(value) {
  return value?.toLowerCase().trim() || '';
}

function getMostFrequentCategory(categories) {
  let best = 'Brak danych';
  let max = 0;

  Object.entries(categories).forEach(([category, count]) => {
    if (count > max) {
      max = count;
      best = category;
    }
  });

  return best;
}

export default function MapView() {
  const [mapData, setMapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const [laureates, countriesRes] = await Promise.all([
          fetchLaureates(),
          fetch(RESTCOUNTRIES_URL)
        ]);

        if (!countriesRes.ok) {
          throw new Error('Nie udało się pobrać danych krajów');
        }

        const countries = await countriesRes.json();
        const countryLookup = new Map();

        countries.forEach(country => {
          const variants = [
            country.name?.common,
            country.name?.official,
            ...(country.altSpellings || [])
          ];

          variants.forEach(name => {
            const key = normalizeString(name);
            if (!key) return;
            if (!countryLookup.has(key)) {
              countryLookup.set(key, {
                latlng: country.latlng,
                flag: country.flags?.svg || country.flags?.png,
                code: country.cca2?.toLowerCase() || ''
              });
            }
          });
        });

        const stats = {};

        (laureates || []).forEach(item => {
          const countryName = item.birth?.place?.country?.en;
          if (!countryName) return;

          const key = normalizeString(countryName);
          const meta = countryLookup.get(key);
          if (!meta) return;

          if (!stats[key]) {
            stats[key] = {
              country: countryName,
              latlng: meta.latlng,
              flag: meta.flag,
              code: meta.code,
              count: 0,
              categories: {},
              laureates: []
            };
          }

          const record = stats[key];
          record.count += 1;
          record.laureates.push(`${item.givenName?.en || ''} ${item.familyName?.en || ''}`.trim());

          const category = item.nobelPrizes?.[0]?.category?.en;
          if (category) {
            record.categories[category] = (record.categories[category] || 0) + 1;
          }
        });

        const prepared = Object.values(stats).map(record => ({
          ...record,
          topCategory: getMostFrequentCategory(record.categories)
        }));

        setMapData(prepared);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Nie udało się załadować danych mapy.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return <div style={{ padding: '1.5rem', textAlign: 'center' }}>Ładowanie mapy...</div>;
  }

  if (error) {
    return <div style={{ padding: '1.5rem', color: '#d32f2f' }}>{error}</div>;
  }

  return (
    <div style={{ width: '100%', height: '70vh', minHeight: '420px' }}>
      <MapContainer center={[20, 0]} zoom={2} style={{ width: '100%', height: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {mapData.map(country => (
          <CircleMarker
            key={country.country}
            center={country.latlng}
            radius={Math.max(6, Math.sqrt(country.count) * 3)}
            pathOptions={{
              color: '#1565c0',
              fillColor: '#42a5f5',
              fillOpacity: 0.7,
              weight: 1.5
            }}
          >
            <Popup>
              <div style={{ minWidth: 220, fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  {country.flag ? (
                    <img
                      src={country.flag}
                      alt={`${country.country} flag`}
                      width={36}
                      height={24}
                      style={{ border: '1px solid #ccc', objectFit: 'cover' }}
                    />
                  ) : null}
                  <div>
                    <strong>{country.country}</strong>
                    <div style={{ fontSize: '11px', color: '#555' }}>{country.code?.toUpperCase() || '---'}</div>
                  </div>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Number of Laureates:</strong> {country.count}
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Most Frequent Category:</strong> {country.topCategory}
                </div>
                <div>
                  <strong>Laureates:</strong>
                  <ul style={{ margin: '6px 0 0', paddingLeft: '18px', maxHeight: '120px', overflowY: 'auto' }}>
                    {country.laureates.slice(0, 8).map((name, index) => (
                      <li key={index} style={{ marginBottom: '2px' }}>{name}</li>
                    ))}
                    {country.laureates.length > 8 ? (
                      <li style={{ fontStyle: 'italic', color: '#555' }}>
                        + {country.laureates.length - 8} more
                      </li>
                    ) : null}
                  </ul>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
