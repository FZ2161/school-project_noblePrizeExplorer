import { TextField, Select, MenuItem, Box } from '@mui/material';

export default function FilterPanel({ filters, setFilters }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3, width: '100%' }}>
      <Select
        value={filters.category}
        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        displayEmpty
        sx={{ minWidth: 180, width: { xs: '100%', sm: 'auto' } }}
      >
        <MenuItem value="">All Categories</MenuItem>
        <MenuItem value="physics">Physics</MenuItem>
        <MenuItem value="chemistry">Chemistry</MenuItem>
        <MenuItem value="medicine">Medicine</MenuItem>
        <MenuItem value="literature">Literature</MenuItem>
        <MenuItem value="peace">Peace</MenuItem>
        <MenuItem value="economics">Economics</MenuItem>
      </Select>

      <TextField
        label="Search"
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        sx={{ width: '100%' }}
      />
    </Box>
  );
}
