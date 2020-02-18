import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import WelComeComponent from './components/Welcome/WelcomeComponent';


ReactDOM.render(<WelComeComponent />, document.getElementById('super_container'));

registerServiceWorker();
