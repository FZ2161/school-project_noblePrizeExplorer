const BASE_URL = 'http://localhost:5000/api';

export async function fetchLaureates(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/laureates?${query}`);
  return res.json();
}

export async function fetchLaureate(id) {
  const res = await fetch(`${BASE_URL}/laureates/${id}`);
  return res.json();
}

export async function fetchStatsCategories() {
  const res = await fetch(`${BASE_URL}/stats/categories`);
  return res.json();
}

export async function fetchStatsCountries() {
  const res = await fetch(`${BASE_URL}/stats/countries`);
  return res.json();
}

export async function fetchStatsYears() {
  const res = await fetch(`${BASE_URL}/stats/years`);
  return res.json();
}