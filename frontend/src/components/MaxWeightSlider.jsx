function MaxWeightSlider({ value, onChange, max = 30 }) {
	return (
		<label className='flex flex-col gap-2 text-sm text-gray-400'>
			Max equipment weight:{' '}
			<span className='text-er-gold'>
				{value.toFixed(1)}
			</span>
			<input
				type='range'
				min={0}
				max={max}
				step={0.5}
				value={value}
				onChange={(e) => onChange(Number(e.target.value))}
				className='w-full accent-er-gold'
			/>
		</label>
	);
}

export default MaxWeightSlider;
