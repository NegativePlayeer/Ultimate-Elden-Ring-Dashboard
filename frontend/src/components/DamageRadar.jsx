const DAMAGE_TYPES = [
	'Physical',
	'Magic',
	'Fire',
	'Lightning',
	'Holy',
];

const TYPE_COLORS = {
	Physical: 'bg-gray-400',
	Magic: 'bg-blue-500',
	Fire: 'bg-red-500',
	Lightning: 'bg-yellow-400',
	Holy: 'bg-amber-200',
};

const MIN_PCT_FOR_LABEL = 12;

function DamageRadar({ damageData }) {
	const entries = DAMAGE_TYPES.map((type) => ({
		type,
		value: Number(damageData?.[type] ?? 0),
	})).filter((e) => e.value > 0);

	const totalAR = entries.reduce((sum, e) => sum + e.value, 0);

	if (totalAR === 0) {
		return (
			<p className='text-sm text-gray-400'>
				No damage profile available.
			</p>
		);
	}

	const segments = entries.map((e) => ({
		...e,
		pct: (e.value / totalAR) * 100,
	}));

	return (
		<div className='space-y-2'>
			<h3 className='text-sm font-medium text-gray-400'>
				Damage split ·{' '}
				<span className='text-er-gold'>{totalAR} AR total</span>
			</h3>

			<div className='flex h-10 w-full overflow-hidden rounded-lg border border-er-copper/30 bg-er-bg'>
				{segments.map((seg) => (
					<div
						key={seg.type}
						className={`relative flex items-center justify-center ${TYPE_COLORS[seg.type]}`}
						style={{ width: `${seg.pct}%` }}
						title={`${seg.type}: ${seg.value}`}
					>
						{seg.pct >= MIN_PCT_FOR_LABEL && (
							<span className='text-xs font-medium text-white'>
								{seg.value}
							</span>
						)}
					</div>
				))}
			</div>

			<div className='flex flex-wrap gap-3 text-xs text-gray-400'>
				{segments.map((seg) => (
					<div key={seg.type} className='flex items-center gap-1.5'>
						<span
							className={`inline-block h-2.5 w-2.5 rounded-sm ${TYPE_COLORS[seg.type]}`}
						/>
						<span>{seg.type}</span>
					</div>
				))}
			</div>
		</div>
	);
}

export default DamageRadar;
