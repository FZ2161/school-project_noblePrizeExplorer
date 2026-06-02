import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { fetchLaureates } from '../api';
import LaureateCard from './LaureateCard';
import FilterPanel from './FilterPanel';

export default function LaureateList() {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    search: ''
  });

  useEffect(() => {
    fetchLaureates(filters).then(setData);
  }, [filters]);

  return (
    <>
      <FilterPanel filters={filters} setFilters={setFilters} />

      <Grid container spacing={2} justifyContent="space-between" alignItems="stretch">
        {data.map(l => (
          <Grid item xs={12} sm={6} md={4} key={l._id} sx={{ display: 'flex' }}>
            <LaureateCard laureate={l} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}