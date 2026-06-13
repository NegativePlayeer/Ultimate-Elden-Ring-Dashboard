import { useEffect, useState } from 'react';
import { fetchHealth } from '../api/client';

function HealthCheck() {
	const [status, setStatus] = useState('loading...');

	useEffect(() => {
		fetchHealth()
			.then((d) => setStatus(d.status))
			.catch(() => setStatus('offline'));
	}, []);

	return (
		<p className='text-sm text-gray-400'>
			API: <span className='text-er-gold'>{status}</span>
		</p>
	);
}

export default HealthCheck;
