import { useEffect, useMemo, useState } from 'react';
import Plotly from 'plotly.js/dist/plotly.js';
import factoryModule from 'react-plotly.js/factory';
import { fetchWeapons } from '../api/client';

const createPlotly =
	typeof factoryModule === 'function'
		? factoryModule
		: factoryModule.default;

const Plot = createPlotly(Plotly);

const ISOLATION_THRESHOLD = 0.1;

function jitterWeights(weapons, spread = 0.08) {
	const byWeight = new Map();
	for (const w of weapons) {
		if (!byWeight.has(w.weight)) byWeight.set(w.weight, []);
		byWeight.get(w.weight).push(w);
	}

	const jittered = new Map();
	for (const [weight, group] of byWeight) {
		const sorted = [...group].sort((a, b) => a.id.localeCompare(b.id));
		if (sorted.length === 1) {
			jittered.set(sorted[0].id, weight);
			continue;
		}
		sorted.forEach((w, i) => {
			const t = i / (sorted.length - 1);
			const offset = (t - 0.5) * spread;
			jittered.set(w.id, weight + offset);
		});
	}
	return jittered;
}

function normalizeWeapons(weapons) {
	if (weapons.length === 0) return [];
	const weights = weapons.map((w) => w.weight);
	const damages = weapons.map((w) => w.totalDamage);
	const minW = Math.min(...weights);
	const maxW = Math.max(...weights);
	const minD = Math.min(...damages);
	const maxD = Math.max(...damages);
	const rangeW = maxW - minW || 1;
	const rangeD = maxD - minD || 1;
	return weapons.map((w) => ({
		weapon: w,
		nx: (w.weight - minW) / rangeW,
		ny: (w.totalDamage - minD) / rangeD,
	}));
}

function nearestNeighborDistance(point, allPoints) {
	let minDist = Infinity;
	for (const other of allPoints) {
		if (other.weapon.id === point.weapon.id) continue;
		const dx = point.nx - other.nx;
		const dy = point.ny - other.ny;
		const dist = Math.sqrt(dx * dx + dy * dy);
		if (dist < minDist) minDist = dist;
	}
	return minDist;
}

function isIsolated(candidate, normalized, threshold = ISOLATION_THRESHOLD) {
	return (
		nearestNeighborDistance(candidate, normalized) >= threshold
	);
}

function pickOutliers(weapons, selectedWeapon, limit = 5) {
	if (weapons.length === 0) return [];

	if (selectedWeapon) {
		const inView = weapons.find((w) => w.id === selectedWeapon.id);
		return inView ? [inView] : [];
	}

	const normalized = normalizeWeapons(weapons);
	const normById = new Map(
		normalized.map((p) => [p.weapon.id, p]),
	);

	const candidates = [];

	const byDamage = [...weapons].sort(
		(a, b) => b.totalDamage - a.totalDamage,
	);
	byDamage.slice(0, 2).forEach((w) => candidates.push(w));

	const byEfficiency = [...weapons].sort(
		(a, b) =>
			b.totalDamage / b.weight - a.totalDamage / a.weight,
	);
	byEfficiency.slice(0, 2).forEach((w) => candidates.push(w));

	const picked = [];
	const seen = new Set();

	for (const w of candidates) {
		if (seen.has(w.id) || picked.length >= limit) continue;
		const point = normById.get(w.id);
		if (!point) continue;

		if (isIsolated(point, normalized)) {
			seen.add(w.id);
			picked.push(w);
		}
	}

	return picked;
}

function WeightScatter({
	category,
	maxWeight,
	selectedWeapon,
	onSelectWeapon,
}) {
	const [weapons, setWeapons] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		setLoading(true);
		setError(null);
		fetchWeapons(category)
			.then(setWeapons)
			.catch(() => setError('Failed to load weapons'))
			.finally(() => setLoading(false));
	}, [category]);

	const filtered = useMemo(
		() => weapons.filter((w) => w.weight <= maxWeight),
		[weapons, maxWeight],
	);

	const outliers = useMemo(
		() => pickOutliers(filtered, selectedWeapon),
		[filtered, selectedWeapon],
	);

	const jitteredX = useMemo(
		() => jitterWeights(filtered),
		[filtered],
	);

	const selectedId = selectedWeapon?.id;

	const handleClick = (event) => {
		const point = event.points?.[0];
		if (!point || point.curveNumber !== 0 || !onSelectWeapon) return;
		const weapon = filtered[point.pointIndex];
		if (weapon) onSelectWeapon(weapon);
	};

	if (loading) {
		return (
			<p className='text-sm text-gray-400'>Loading chart...</p>
		);
	}

	if (error) {
		return <p className='text-sm text-red-400'>{error}</p>;
	}

	return (
		<div>
			<h3 className='mb-2 text-sm font-medium text-gray-400'>
				Weight vs total damage ({filtered.length} weapons)
			</h3>
			<Plot
				data={[
					{
						type: 'scatter',
						mode: 'markers',
						x: filtered.map((w) => jitteredX.get(w.id)),
						y: filtered.map((w) => w.totalDamage),
						text: filtered.map((w) => w.name),
						customdata: filtered.map((w) => w.weight),
						hovertemplate:
							'%{text}<br>Weight: %{customdata}<br>Damage: %{y}<extra></extra>',
						marker: {
							size: filtered.map((w) =>
								w.id === selectedId ? 14 : 8,
							),
							color: filtered.map((w) =>
								w.id === selectedId ? '#c9a227' : '#8b6914',
							),
							opacity: filtered.map((w) =>
								w.id === selectedId ? 1 : 0.6,
							),
						},
						showlegend: false,
					},
					{
						type: 'scatter',
						mode: 'markers+text',
						x: outliers.map((w) => jitteredX.get(w.id)),
						y: outliers.map((w) => w.totalDamage),
						text: outliers.map((w) => w.name),
						textposition: 'top center',
						textfont: { size: 10, color: '#c9a227' },
						marker: {
							size: 10,
							color: '#c9a227',
							line: { width: 1, color: '#e5e5e5' },
						},
						hoverinfo: 'skip',
						showlegend: false,
					},
				]}
				layout={{
					paper_bgcolor: '#1a1a1f',
					plot_bgcolor: '#1a1a1f',
					font: { color: '#e5e5e5', size: 12 },
					margin: { t: 20, r: 80, b: 50, l: 55 },
					xaxis: {
						title: 'Weight',
						gridcolor: '#333',
						zerolinecolor: '#444',
					},
					yaxis: {
						title: 'Total damage',
						gridcolor: '#333',
						zerolinecolor: '#444',
					},
					height: 360,
					hovermode: 'closest',
					showlegend: false,
				}}
				config={{ displayModeBar: false, responsive: true }}
				style={{ width: '100%' }}
				useResizeHandler
				onClick={handleClick}
			/>
		</div>
	);
}

export default WeightScatter;
