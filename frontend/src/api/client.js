export async function fetchHealth() {
	const res = await fetch('/api/health');
	if (!res.ok) throw new Error('API error');
	return res.json();
}

export async function fetchWeaponCategories() {
	const res = await fetch('/api/weapons/categories');
	if (!res.ok) throw new Error('API error');
	return res.json();
}

export async function fetchWeapons(category = 'All') {
	const params = new URLSearchParams();
	if (category && category !== 'All') {
		params.set('category', category);
	}
	const query = params.toString();
	const url = query
		? `/api/weapons?${query}`
		: '/api/weapons';
	const res = await fetch(url);
	if (!res.ok) throw new Error('API error');
	return res.json();
}

export async function fetchClasses() {
	const res = await fetch('/api/classes');
	if (!res.ok) throw new Error('API error');
	return res.json();
}

export async function fetchTopFp(school, limit = 10) {
	const params = new URLSearchParams({
		school,
		limit: String(limit),
	});
	const res = await fetch(`/api/magic/top-fp?${params}`);
	if (!res.ok) throw new Error('API error');
	return res.json();
}

export async function fetchRequirements(school, attribute) {
	const params = new URLSearchParams({ school, attribute });
	const res = await fetch(
		`/api/magic/requirements?${params}`,
	);
	if (!res.ok) throw new Error('API error');
	return res.json();
}
