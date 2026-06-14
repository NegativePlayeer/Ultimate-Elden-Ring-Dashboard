import { useState } from 'react';
import Header from './components/Header';
import AboutModal from './components/AboutModal';
import HealthCheck from './components/HealthCheck';
import TabNav from './components/TabNav';
import CategoryFilter from './components/CategoryFilter';
import WeaponList from './components/WeaponList';
import DamageRadar from './components/DamageRadar';
import MaxWeightSlider from './components/MaxWeightSlider';
import WeightScatter from './components/WeightScatter';
import MagicTypeRadio from './components/MagicTypeRadio';
import FpCostBar from './components/FpCostBar';
import ClassStatBar from './components/ClassStatBar';
import ReqBoxPlot from './components/ReqBoxPlot';

function App() {
	const [tab, setTab] = useState('armory');
	const [category, setCategory] = useState('All');
	const [selectedWeapon, setSelectedWeapon] = useState(null);
	const [maxWeight, setMaxWeight] = useState(30);
	const [magicSchool, setMagicSchool] = useState('sorceries');
	
	// State to track if the About / Help modal is visible
	const [isAboutOpen, setIsAboutOpen] = useState(false);

	return (
		<div className='min-h-screen bg-er-bg text-gray-200 p-6'>
			{/* Pass down the trigger function to the Header prop */}
			<Header onAboutClick={() => setIsAboutOpen(true)} />
			
			<HealthCheck />
			<TabNav activeTab={tab} onTabChange={setTab} />

			{tab === 'armory' && (
				<div className='space-y-6'>
					<div className='grid gap-6 lg:grid-cols-2'>
						<div className='space-y-4'>
							<CategoryFilter
								value={category}
								onChange={setCategory}
							/>
							<WeaponList
								category={category}
								selectedId={selectedWeapon?.id}
								onSelect={setSelectedWeapon}
							/>
						</div>

						<div className='rounded-lg border border-er-copper/40 bg-er-panel p-4'>
							{selectedWeapon ? (
								<div className='space-y-3'>
									<h2 className='font-display text-lg text-er-gold'>
										{selectedWeapon.name}
									</h2>
									{selectedWeapon.image && (
										<img
											src={selectedWeapon.image}
											alt={selectedWeapon.name}
											className='mx-auto h-40 object-contain'
										/>
									)}
									<p className='text-sm text-gray-400'>
										{selectedWeapon.scalesLabel ||
											'No scaling data'}
									</p>
									<DamageRadar
										damageData={selectedWeapon.damageProfile}
									/>
								</div>
							) : (
								<p className='text-sm text-gray-400'>
									Select a weapon from the list
								</p>
							)}
						</div>
					</div>

					<div className='rounded-lg border border-er-copper/40 bg-er-panel p-4 space-y-4'>
						<MaxWeightSlider
							value={maxWeight}
							onChange={setMaxWeight}
						/>
						<WeightScatter
							category={category}
							maxWeight={maxWeight}
							selectedWeapon={selectedWeapon}
							onSelectWeapon={setSelectedWeapon}
						/>
					</div>
				</div>
			)}

			{tab === 'academy' && (
				<div className='space-y-6'>
					<MagicTypeRadio
						value={magicSchool}
						onChange={setMagicSchool}
					/>

					<div className='grid gap-6 lg:grid-cols-2'>
						<div className='rounded-lg border border-er-copper/40 bg-er-panel p-4'>
							<FpCostBar school={magicSchool} />
						</div>
						<div className='rounded-lg border border-er-copper/40 bg-er-panel p-4'>
							<ClassStatBar />
						</div>
					</div>

					<div className='rounded-lg border border-er-copper/40 bg-er-panel p-4'>
						<h3 className='mb-3 text-sm font-medium text-gray-400'>
							Spell requirement distribution
						</h3>
						<ReqBoxPlot school={magicSchool} />
					</div>
				</div>
			)}

			{/* Render the modal at the bottom of the component hierarchy */}
			<AboutModal 
				open={isAboutOpen} 
				onClose={() => setIsAboutOpen(false)} 
			/>
		</div>
	);
}

export default App;