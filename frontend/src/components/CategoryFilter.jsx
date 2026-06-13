import { useEffect, useState } from 'react';
import { fetchWeaponCategories } from '../api/client';

function CategoryFilter({ value, onChange }) {
	const [categories, setCategories] = useState([]);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetchWeaponCategories()
			.then(setCategories)
			.catch(() => setError('Failed to load categories'));
	}, []);

	if (error) {
		return <p className='text-sm text-red-400'>{error}</p>;
	}

	return (
		<label className='flex flex-col gap-1 text-sm text-gray-400'>
			Weapon category
			<select
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className='rounded border border-er-copper/40 bg-er-panel px-3 py-2 text-gray-200'
			>
				<option value='All'>All</option>
				{categories.map((cat) => (
					<option key={cat} value={cat}>
						{cat}
					</option>
				))}
			</select>
		</label>
	);
}

export default CategoryFilter;
