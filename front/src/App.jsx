import { useState } from 'react';
import { AppBar, Tabs, Tab, Container } from '@mui/material';
import LaureateList from './components/LaureateList';
import MapView from './components/MapView';
import StatsChart from './components/StatsChart';

export default function App() {
  const [tab, setTab] = useState(0);

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#0d47a1', color: '#fff' }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)}>
          <Tab label="Lista" />
          <Tab label="Mapa" />
          <Tab label="Statystyki" />
        </Tabs>
      </AppBar>

      <Container
        maxWidth="lg"
        sx={{
          mt: 4,
          backgroundColor: '#ffffff',
          color: '#111111',
          borderRadius: 3,
          p: 3,
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.08)',
          width: '100%',
        }}
      >
        {tab === 0 && <LaureateList />}
        {tab === 1 && <MapView />}
        {tab === 2 && <StatsChart />}
      </Container>
    </>
  );
}