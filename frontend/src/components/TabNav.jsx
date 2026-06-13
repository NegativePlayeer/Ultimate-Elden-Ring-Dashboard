function TabNav({ activeTab, onTabChange }) {
	const tabs = [
		{ id: 'armory', label: 'The Armory' },
		{ id: 'academy', label: 'The Academy' },
	];

	return (
		<nav className='flex gap-2 mb-6'>
			{tabs.map((tab) => (
				<button
					key={tab.id}
					type='button'
					onClick={() => onTabChange(tab.id)}
					className={
						activeTab === tab.id
							? 'border-b-2 border-er-gold px-4 py-2 text-er-gold'
							: 'px-4 py-2 text-gray-400 hover:text-gray-200'
					}
				>
					{tab.label}
				</button>
			))}
		</nav>
	);
}

export default TabNav;
