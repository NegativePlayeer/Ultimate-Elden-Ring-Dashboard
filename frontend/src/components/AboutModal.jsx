function AboutModal({ open, onClose }) {
	if (!open) return null;

	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm'
			onClick={onClose}
		>
			<div
				className='max-h-[85vh] max-w-lg overflow-y-auto rounded-lg border border-er-copper/40 bg-er-panel p-6 text-gray-200 shadow-2xl'
				onClick={(e) => e.stopPropagation()}
			>
				<div className='mb-4 flex items-start justify-between gap-4'>
					<h2 className='font-display text-xl text-er-gold'>
						About / Help
					</h2>
					<button
						type='button'
						onClick={onClose}
						className='text-gray-400 hover:text-er-gold text-lg'
						aria-label='Close'
					>
						✕
					</button>
				</div>

				<div className='space-y-4 text-sm text-gray-300 leading-relaxed'>
					<p>
						This application is a specialized dashboard built for our{' '}
						<strong className='text-er-gold'>Data Visualization</strong> course. It visualizes statistical metrics, multi-dimensional profiles, and requirement distributions across game assets.
					</p>
					<div>
						<strong className='text-er-gold block mb-1'>Interactive Features:</strong>
						<ul className='list-disc pl-5 space-y-1 text-gray-400'>
							<li><strong>Armory:</strong> Analyze equipment weights and use the radar layout to evaluate specific damage parameters.</li>
							<li><strong>Academy:</strong> Drill down into structural spell profiles, attribute distributions, and class stat balances.</li>
						</ul>
					</div>
					<div className='pt-2 border-t border-er-copper/20'>
						<span className='text-xs uppercase tracking-wider text-gray-500 block mb-1 font-semibold'>Project Authors:</span>
						<div className='flex justify-between font-medium text-er-gold'>
							<span>Jakub Krzoska</span>
							<span>Dawid Łuka</span>
						</div>
					</div>
				</div>

				<button
					type='button'
					onClick={onClose}
					className='mt-6 w-full rounded border border-er-gold/50 px-4 py-2 text-sm text-er-gold hover:bg-er-gold/10 transition-colors'
				>
					Close
				</button>
			</div>
		</div>
	);
}

export default AboutModal;