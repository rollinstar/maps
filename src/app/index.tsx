import React from 'react';
import { App } from 'app/containers/App';
import { createRoot } from 'react-dom/client';
import 'shared/styles/style.scss';

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

const container = document.getElementById('app') as HTMLElement;
const root = createRoot(container!);

root.render(<App />);
