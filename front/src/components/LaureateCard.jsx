import { Card, CardContent, Typography } from '@mui/material';

export default function LaureateCard({ laureate }) {
  const name = `${laureate.givenName?.en || ''} ${laureate.familyName?.en || ''}`;

  const prize = laureate.nobelPrizes?.[0];

  const country = laureate.birth?.place?.country?.en || 'Unknown';

  const countryCode = country.toLowerCase().slice(0, 2);

  return (
    <Card sx={{ width: '100%', display: 'flex', flexDirection: 'column', minHeight: 240 }}>
      <CardContent >
        <div>
          <Typography variant="h5" gutterBottom >
            {name}
          </Typography>
          <Typography color="text.secondary">{prize?.category?.en}</Typography>
          <Typography color="text.secondary" sx={{ mb: 1 }}>
            {prize?.awardYear}
          </Typography>
        </div>

        <img
          src={`https://flagcdn.com/w40/${countryCode}.png`}
          alt={country}
          style={{ width: '40px', height: 'auto', marginBottom: '1rem' }}
        />

        <Typography variant="body2" color="text.secondary">
          {prize?.motivation?.en}
        </Typography>
      </CardContent>
    </Card>
  );
}