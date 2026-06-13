import Plotly from 'plotly.js/dist/plotly.js';
import factoryModule from 'react-plotly.js/factory';

const createPlotly =
	typeof factoryModule === 'function'
		? factoryModule
		: factoryModule.default;

export const Plot = createPlotly(Plotly);

export const plotBaseLayout = {
	paper_bgcolor: '#1a1a1f',
	plot_bgcolor: '#1a1a1f',
	font: { color: '#e5e5e5', size: 12 },
};
