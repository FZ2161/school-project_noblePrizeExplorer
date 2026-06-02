import { useEffect, useState } from 'react';
import { Grid, Drawer, Box, Typography, IconButton, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { fetchLaureates } from '../api';
import LaureateCard from './LaureateCard';
import FilterPanel from './FilterPanel';

export default function LaureateList() {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    search: ''
  });
  const [selectedLaureate, setSelectedLaureate] = useState(null);

  useEffect(() => {
    fetchLaureates(filters).then(setData);
  }, [filters]);

  return (
    <>
      <FilterPanel filters={filters} setFilters={setFilters} />

      <Grid container spacing={2} justifyContent="space-between" alignItems="stretch">
        {data.map(l => (
          <Grid item xs={12} sm={6} md={4} key={l._id} sx={{ display: 'flex' }}>
            <LaureateCard laureate={l} onClick={() => setSelectedLaureate(l)} />
          </Grid>
        ))}
      </Grid>

      {data.length === 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography>No laureates match the current filters.</Typography>
        </Box>
      )}

      <Drawer
        anchor="right"
        open={Boolean(selectedLaureate)}
        onClose={() => setSelectedLaureate(null)}
      >
        <Box sx={{ width: { xs: '100vw', sm: 420 }, p: 3 }}>
          {selectedLaureate && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">
                  {`${selectedLaureate.givenName?.en || ''} ${selectedLaureate.familyName?.en || ''}`.trim() || 'No data available'}
                </Typography>
                <IconButton onClick={() => setSelectedLaureate(null)}>
                  <CloseIcon />
                </IconButton>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Typography sx={{ mb: 1 }}><strong>Birth Country:</strong> {selectedLaureate.birth?.place?.country?.en || 'No data available'}</Typography>
              <Typography sx={{ mb: 1 }}><strong>Birth Date:</strong> {selectedLaureate.birth?.date || 'No data available'}</Typography>
              <Typography sx={{ mb: 1 }}><strong>Award Year:</strong> {selectedLaureate.nobelPrizes?.[0]?.awardYear || 'No data available'}</Typography>
              <Typography sx={{ mb: 1 }}><strong>Category:</strong> {selectedLaureate.nobelPrizes?.[0]?.category?.en || 'No data available'}</Typography>
              <Typography sx={{ mb: 1 }}><strong>Motivation:</strong> {selectedLaureate.nobelPrizes?.[0]?.motivation?.en || 'No data available'}</Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" sx={{ mb: 1 }}>Awards</Typography>
              {selectedLaureate.nobelPrizes?.map((prize, index) => (
                <Box key={index} sx={{ mb: 1, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="body2"><strong>{prize.category?.en || 'No data available'}</strong> • {prize.awardYear || 'No data available'}</Typography>
                  <Typography variant="body2" color="text.secondary">{prize.motivation?.en || 'No data available'}</Typography>
                </Box>
              ))}
            </>
          )}
        </Box>
      </Drawer>
    </>
  );
}
