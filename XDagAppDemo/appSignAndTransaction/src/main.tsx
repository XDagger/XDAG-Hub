import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App"
import type { FC } from 'react';
import React, { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppContext } from './context';

const Root: FC = () => {
	return (
		<StrictMode>
			<BrowserRouter>
				<AppContext>
					<App />
				</AppContext>
			</BrowserRouter>
		</StrictMode>
	);
};

const rootNode = document.getElementById('root');
const root = createRoot(rootNode!);
root.render(<Root />);
