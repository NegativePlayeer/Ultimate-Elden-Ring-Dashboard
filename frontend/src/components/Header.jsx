function Header({ onAboutClick }) {
	return (
		<header className='mb-6 flex items-center justify-between gap-4 border-b border-er-copper/40 pb-4'>
			<div className='flex items-center gap-3'>
				<span className='font-display text-xl font-semibold text-er-gold'>
					ER
				</span>
				<h1 className='font-display text-xl text-er-gold'>
					Ultimate Build Crafter
				</h1>
			</div>
			<button
				type='button'
				onClick={onAboutClick}
				className='rounded border border-er-copper/40 px-3 py-1.5 text-sm text-gray-300 hover:border-er-gold hover:text-er-gold'
			>
				About / Help
			</button>
		</header>
	);
}

export default Header;