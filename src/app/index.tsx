import React from 'react';
import { App } from 'app/containers/App';
import { createRoot } from 'react-dom/client';
import 'shared/styles/style.scss';

const container = document.getElementById('app') as HTMLElement;
const root = createRoot(container!);

root.render(<App />);
