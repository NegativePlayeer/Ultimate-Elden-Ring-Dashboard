function AboutModal({ open, onClose }) {
	if (!open) return null;

	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4'
			onClick={onClose}
		>
			<div
				className='max-h-[85vh] max-w-lg overflow-y-auto rounded-lg border border-er-copper/40 bg-er-panel p-6 text-gray-200'
				onClick={(e) => e.stopPropagation()}
			>
				<div className='mb-4 flex items-start justify-between gap-4'>
					<h2 className='font-display text-xl text-er-gold'>
						About this dashboard
					</h2>
					<button
						type='button'
						onClick={onClose}
						className='text-gray-400 hover:text-er-gold'
						aria-label='Close'
					>
						✕
					</button>
				</div>

				<div className='space-y-3 text-sm text-gray-300'>
					<p>
						<strong className='text-er-gold'>
							Elden Ring Ultimate Build Crafter
						</strong>{' '}
						helps you explore weapons, damage profiles,
						starting classes, and spell costs from Elden
						Ring game data.
					</p>
					<p>
						<strong>Armory:</strong> Filter by category,
						select a row in the weapon table to update the
						damage radar and highlight the scatter plot. Use
						the weight slider to filter light weapons.
					</p>
					<p>
						<strong>Academy:</strong> Compare top FP costs
						(sorceries vs incantations), view class stat
						distribution, and explore spell attribute
						requirements.
					</p>
					<p>
						<strong>Data:</strong> Kaggle Elden Ring
						Database (CSV). Backend: FastAPI. Frontend:
						React + Plotly.
					</p>
				</div>

				<button
					type='button'
					onClick={onClose}
					className='mt-6 rounded border border-er-gold/50 px-4 py-2 text-sm text-er-gold hover:bg-er-gold/10'
				>
					Close
				</button>
			</div>
		</div>
	);
}

export default AboutModal;
