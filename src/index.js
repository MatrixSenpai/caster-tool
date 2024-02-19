import { createRoot } from 'react-dom/client';
import 'bootstrap';
import { library } from '@fortawesome/fontawesome-svg-core';
import { far } from '@fortawesome/pro-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

library.add(far, fab);

import 'css/main.scss';
import App from 'App';

const root = createRoot(document.getElementById('root'));
root.render(<App />)