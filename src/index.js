import { React, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './AppContext';

import Header from './components/Header';

import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import UnderstandCorruption from './pages/UnderstandCorruption';

import './app.scss';

function App() {
	return (
		<BrowserRouter>
			<AppProvider>
				<Header />
				<div className="map-container">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/about" element={<About />} />
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/understand-corruption" element={<UnderstandCorruption />} />
					</Routes>
				</div>
			</AppProvider>
		</BrowserRouter>
	);
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
