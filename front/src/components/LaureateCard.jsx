import { Card, CardContent, Typography, CardActionArea } from '@mui/material';

export default function LaureateCard({ laureate, onClick }) {
  const name = `${laureate.givenName?.en || ''} ${laureate.familyName?.en || ''}`.trim();
  const prize = laureate.nobelPrizes?.[0];
  const countryLabel = laureate.birth?.place?.country?.en || 'No data available';
  const countryCode = laureate.bornCountryCode || (laureate.birth?.place?.country?.en ? countryLabel.toLowerCase().slice(0, 2) : '');

  return (
    <Card sx={{ width: '100%', display: 'flex', flexDirection: 'column', minHeight: 240 }}>
      <CardActionArea
        onClick={onClick}
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', height: '100%' }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <div>
            <Typography variant="h5" gutterBottom>
              {name}
            </Typography>
            <Typography color="text.secondary">{prize?.category?.en || 'No data available'}</Typography>
            <Typography color="text.secondary" sx={{ mb: 1 }}>
              {prize?.awardYear || 'No data available'}
            </Typography>
          </div>

          {countryCode ? (
            <img
              src={`https://flagcdn.com/w40/${countryCode}.png`}
              alt={countryLabel}
              style={{ width: '40px', height: 'auto', marginBottom: '1rem' }}
            />
          ) : null}

          <Typography variant="body2" color="text.secondary">
            {prize?.motivation?.en || 'No data available'}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
