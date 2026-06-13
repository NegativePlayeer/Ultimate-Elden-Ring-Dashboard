function MagicTypeRadio({ value, onChange }) {
	return (
		<fieldset className='flex gap-4 text-sm text-gray-300'>
			<legend className='sr-only'>Magic type</legend>
			<label className='flex items-center gap-2'>
				<input
					type='radio'
					name='magicSchool'
					value='sorceries'
					checked={value === 'sorceries'}
					onChange={() => onChange('sorceries')}
				/>
				Sorceries
			</label>
			<label className='flex items-center gap-2'>
				<input
					type='radio'
					name='magicSchool'
					value='incantations'
					checked={value === 'incantations'}
					onChange={() => onChange('incantations')}
				/>
				Incantations
			</label>
		</fieldset>
	);
}

export default MagicTypeRadio;
