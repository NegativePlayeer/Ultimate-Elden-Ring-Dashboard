import { useEffect, useMemo, useState } from 'react';
import { fetchTopFp } from '../api/client';
import { Plot, plotBaseLayout } from '../lib/plot';

function FpCostBar({ school }) {
	const [spells, setSpells] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		setLoading(true);
		setError(null);
		fetchTopFp(school, 10)
			.then(setSpells)
			.catch(() => setError('Failed to load FP data'))
			.finally(() => setLoading(false));
	}, [school]);

	const chartData = useMemo(() => {
		const ordered = [...spells].reverse();
		return {
			names: ordered.map((s) => s.name),
			costs: ordered.map((s) => s.cost),
		};
	}, [spells]);

	if (loading) {
		return (
			<p className='text-sm text-gray-400'>Loading chart...</p>
		);
	}

	if (error) {
		return <p className='text-sm text-red-400'>{error}</p>;
	}

	if (spells.length === 0) {
		return (
			<p className='text-sm text-gray-400'>
				No FP data for {school}.
			</p>
		);
	}

	const chartHeight = Math.max(360, spells.length * 36);

	return (
		<div>
			<h3 className='mb-2 text-sm font-medium text-gray-400'>
				Top 10 FP costs
			</h3>
			<Plot
				data={[
					{
						type: 'bar',
						orientation: 'h',
						y: chartData.names,
						x: chartData.costs,
						marker: { color: '#c9a227' },
						hovertemplate:
							'%{y}<br>FP cost: %{x}<extra></extra>',
					},
				]}
				layout={{
					...plotBaseLayout,
					margin: { t: 20, r: 30, b: 40, l: 180 },
					xaxis: { title: 'FP cost' },
					yaxis: {
						automargin: true,
						tickfont: { size: 11 },
					},
					height: chartHeight,
					hovermode: 'closest',
				}}
				config={{ displayModeBar: false, responsive: true }}
				style={{ width: '100%' }}
				useResizeHandler
			/>
		</div>
	);
}

export default FpCostBar;
