import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  LineChart, Line, PieChart, Pie,
  ResponsiveContainer
} from 'recharts';

import {
  fetchStatsCategories,
  fetchStatsCountries,
  fetchStatsYears
} from '../api';

export default function StatsChart() {
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [years, setYears] = useState([]);

  useEffect(() => {
    fetchStatsCategories().then(setCategories);
    fetchStatsCountries().then(setCountries);
    fetchStatsYears().then(setYears);
  }, []);

  return (
    <>
      <div style={{ width: '100%', height: 300, marginBottom: 24 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={categories}>
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ width: '100%', height: 300, marginBottom: 24 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={years}>
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Line dataKey="count" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ width: '100%', height: 300, marginBottom: 24 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={countries} dataKey="count" nameKey="_id" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}