import { useEffect, useMemo, useState } from 'react';
import { fetchClasses } from '../api/client';
import { Plot, plotBaseLayout } from '../lib/plot';

const STAT_KEYS = [
	'vigor',
	'mind',
	'endurance',
	'strength',
	'dexterity',
	'intelligence',
	'faith',
	'arcane',
];

function capitalize(key) {
	return key.charAt(0).toUpperCase() + key.slice(1);
}

function ClassStatBar() {
	const [classes, setClasses] = useState([]);
	const [selectedId, setSelectedId] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchClasses()
			.then((data) => {
				setClasses(data);
				if (data.length > 0) setSelectedId(data[0].id);
			})
			.catch(() => setClasses([]))
			.finally(() => setLoading(false));
	}, []);

	const selected = useMemo(
		() => classes.find((c) => c.id === selectedId),
		[classes, selectedId],
	);

	const chartData = useMemo(() => {
		if (!selected?.stats) return { labels: [], values: [] };
		const entries = STAT_KEYS.filter(
			(key) => selected.stats[key] != null,
		).map((key) => ({
			label: capitalize(key),
			value: Number(selected.stats[key]),
		}));
		entries.sort((a, b) => b.value - a.value);
		return {
			labels: entries.map((e) => e.label),
			values: entries.map((e) => e.value),
		};
	}, [selected]);

	if (loading) {
		return (
			<p className='text-sm text-gray-400'>
				Loading classes...
			</p>
		);
	}

	const level = selected?.stats?.level;

	return (
		<div className='space-y-3'>
			<label className='flex flex-col gap-1 text-sm text-gray-400'>
				Starting class
				<select
					value={selectedId}
					onChange={(e) => setSelectedId(e.target.value)}
					className='rounded border border-er-copper/40 bg-er-panel px-3 py-2 text-gray-200'
				>
					{classes.map((c) => (
						<option key={c.id} value={c.id}>
							{c.name}
						</option>
					))}
				</select>
			</label>

			<h3 className='text-sm font-medium text-gray-400'>
				Starting stats{level != null ? ` (level ${level})` : ''}
			</h3>

			<Plot
				data={[
					{
						type: 'bar',
						orientation: 'h',
						y: chartData.labels,
						x: chartData.values,
						marker: { color: '#c9a227' },
						hovertemplate:
							'%{y}: %{x}<extra></extra>',
						showlegend: false,
					},
				]}
				layout={{
					...plotBaseLayout,
					margin: { t: 10, r: 30, b: 40, l: 100 },
					xaxis: { title: 'Stat value', dtick: 2 },
					yaxis: {
						automargin: true,
						tickfont: { size: 11 },
					},
					height: Math.max(280, chartData.labels.length * 32),
					showlegend: false,
					hovermode: 'closest',
				}}
				config={{ displayModeBar: false, responsive: true }}
				style={{ width: '100%' }}
				useResizeHandler
			/>
		</div>
	);
}

export default ClassStatBar;
