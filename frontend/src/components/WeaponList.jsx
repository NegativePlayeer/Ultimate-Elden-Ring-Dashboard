import { useEffect, useState } from 'react';
import { fetchWeapons } from '../api/client';

function WeaponList({ category, selectedId, onSelect }) {
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

	if (loading) {
		return (
			<p className='text-sm text-gray-400'>
				Loading weapons...
			</p>
		);
	}

	if (error) {
		return <p className='text-sm text-red-400'>{error}</p>;
	}

	if (weapons.length === 0) {
		return (
			<p className='text-sm text-gray-400'>
				No weapons found.
			</p>
		);
	}

	return (
		<div className='rounded-lg border border-er-copper/40 bg-er-panel'>
			<p className='border-b border-er-copper/40 px-4 py-2 text-sm text-gray-400'>
				{weapons.length} weapons — click to select
			</p>
			<ul className='max-h-80 divide-y divide-er-copper/20 overflow-y-auto'>
				{weapons.map((w) => (
					<li key={w.id}>
						<button
							type='button'
							onClick={() => onSelect(w)}
							className={
								selectedId === w.id
									? 'w-full px-4 py-3 text-left bg-er-gold/15 text-er-gold'
									: 'w-full px-4 py-3 text-left hover:bg-er-bg/80'
							}
						>
							<span className='font-medium'>{w.name}</span>
							<span className='mt-1 block text-xs text-gray-400'>
								{w.category} · {w.weight} wt ·{' '}
								{w.totalDamage} dmg
							</span>
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}

export default WeaponList;
