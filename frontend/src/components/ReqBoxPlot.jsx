import { useEffect, useMemo, useState } from 'react';

import { fetchRequirements } from '../api/client';

import { Plot, plotBaseLayout } from '../lib/plot';



const ATTRIBUTES = ['Intelligence', 'Faith', 'Arcane'];



const BOX_COLORS = ['#c9a227', '#8b6914', '#5a4a12'];



function computeBoxStats(sorted) {

	if (sorted.length === 0) return null;

	const q = (p) => {

		const idx = (sorted.length - 1) * p;

		const lo = Math.floor(idx);

		const hi = Math.ceil(idx);

		if (lo === hi) return sorted[lo];

		return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);

	};

	return {

		min: sorted[0],

		q1: Math.round(q(0.25)),

		median: Math.round(q(0.5)),

		q3: Math.round(q(0.75)),

		max: sorted[sorted.length - 1],

		count: sorted.length,

	};

}



function ReqBoxPlot({ school }) {

	const [byAttribute, setByAttribute] = useState({});

	const [loading, setLoading] = useState(true);

	const [error, setError] = useState(null);



	useEffect(() => {

		setLoading(true);

		setError(null);

		Promise.all(

			ATTRIBUTES.map((attribute) =>

				fetchRequirements(school, attribute).then((values) => ({

					attribute,

					values,

				})),

			),

		)

			.then((results) => {

				const next = {};

				for (const { attribute, values } of results) {

					next[attribute] = values;

				}

				setByAttribute(next);

			})

			.catch(() => setError('Failed to load requirements'))

			.finally(() => setLoading(false));

	}, [school]);



	const nonZeroByAttribute = useMemo(() => {

		const next = {};

		for (const attribute of ATTRIBUTES) {

			const values = byAttribute[attribute] ?? [];

			next[attribute] = values.filter((v) => v > 0);

		}

		return next;

	}, [byAttribute]);



	const statsByAttribute = useMemo(() => {

		const next = {};

		for (const attribute of ATTRIBUTES) {

			const sorted = [...nonZeroByAttribute[attribute]].sort(

				(a, b) => a - b,

			);

			next[attribute] = computeBoxStats(sorted);

		}

		return next;

	}, [nonZeroByAttribute]);



	const activeAttributes = useMemo(

		() =>

			ATTRIBUTES.filter(

				(attribute) => nonZeroByAttribute[attribute].length > 0,

			),

		[nonZeroByAttribute],

	);



	const boxTraces = useMemo(

		() =>

			activeAttributes.map((attribute, index) => ({

				type: 'box',

				orientation: 'h',

				x: nonZeroByAttribute[attribute],

				name: attribute,

				boxpoints: false,
				hoveron: 'points',

				marker: { color: BOX_COLORS[index % BOX_COLORS.length] },

				hovertemplate: `${attribute}<br>Required: %{x}<extra></extra>`,

			})),

		[activeAttributes, nonZeroByAttribute],

	);



	if (loading) {

		return <p className='text-sm text-gray-400'>Loading chart...</p>;

	}



	if (error) {

		return <p className='text-sm text-red-400'>{error}</p>;

	}



	if (activeAttributes.length === 0) {

		return (

			<p className='text-sm text-gray-400'>

				No spell stat requirements in {school}.

			</p>

		);

	}



	return (

		<div className='space-y-3'>

			<p className='text-xs text-gray-500'>

				{activeAttributes

					.map(

						(attribute) =>

							`${attribute}: ${nonZeroByAttribute[attribute].length}`,

					)

					.join(' · ')}

			</p>



			<Plot

				data={boxTraces}

				layout={{

					...plotBaseLayout,

					margin: { t: 20, r: 30, b: 40, l: 90 },

					xaxis: { title: 'Required level' },

					yaxis: { automargin: true },

					height: 220,

					hovermode: 'closest',

					showlegend: true,

					legend: {

						orientation: 'h',

						y: 1.15,

						x: 0,

					},

				}}

				config={{

					displayModeBar: false,

					responsive: true,

				}}

				style={{ width: '100%' }}

				useResizeHandler

			/>



			<div className='overflow-x-auto'>

				<table className='w-full min-w-[320px] text-center text-xs text-gray-500'>

					<thead>

						<tr className='text-gray-400'>

							<th className='pb-1 text-left font-medium'>

								Attribute

							</th>

							<th className='pb-1 font-medium'>Min</th>

							<th className='pb-1 font-medium'>Q1</th>

							<th className='pb-1 font-medium'>Median</th>

							<th className='pb-1 font-medium'>Q3</th>

							<th className='pb-1 font-medium'>Max</th>

						</tr>

					</thead>

					<tbody>

						{activeAttributes.map((attribute) => {

							const stats = statsByAttribute[attribute];

							if (!stats) return null;

							return (

								<tr key={attribute}>

									<td className='py-1 text-left text-gray-400'>

										{attribute}

									</td>

									<td className='py-1 text-er-gold'>

										{stats.min}

									</td>

									<td className='py-1 text-er-gold'>

										{stats.q1}

									</td>

									<td className='py-1 text-er-gold'>

										{stats.median}

									</td>

									<td className='py-1 text-er-gold'>

										{stats.q3}

									</td>

									<td className='py-1 text-er-gold'>

										{stats.max}

									</td>

								</tr>

							);

						})}

					</tbody>

				</table>

			</div>

		</div>

	);

}



export default ReqBoxPlot;

