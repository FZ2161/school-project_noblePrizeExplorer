import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  LineChart, Line, PieChart, Pie, Legend,
  ResponsiveContainer, Cell
} from 'recharts';

import {
  fetchStatsCategories,
  fetchStatsCountries,
  fetchStatsYears
} from '../api';

const PIE_COLORS = ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f', '#edc948', '#b07aa1', '#ff9da7'];

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
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12 }}>Laureate count by category</h3>
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categories} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <XAxis dataKey="_id" angle={-20} textAnchor="end" interval={0} height={60} />
              <YAxis label={{ value: 'Laureate count', angle: -90, position: 'insideLeft', dy: 70 }} />
              <Tooltip formatter={(value) => [value, 'Laureates']} />
              <Bar dataKey="count" fill="#4e79a7" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12 }}>Awards by year</h3>
        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={years} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <XAxis dataKey="_id" label={{ value: 'Year', position: 'insideBottomRight', offset: -10 }} />
              <YAxis label={{ value: 'Laureate count', angle: -90, position: 'insideLeft', dy: 70 }} />
              <Tooltip formatter={(value) => [value, 'Laureates']} />
              <Line type="monotone" dataKey="count" stroke="#e15759" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12 }}>Prize winners by country - top 10</h3>
        <div style={{ width: '100%', height: 360 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={countries}
                dataKey="count"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#76b7b2"
                label={({ name, percent }) => `${name}: ${Math.round(percent * 100)}%`}
              >
                {countries.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Legend layout="horizontal" verticalAlign="bottom" height={36} />
              <Tooltip formatter={(value) => [value, 'Laureates']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
