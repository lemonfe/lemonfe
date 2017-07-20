import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Gallery from './components/Gallery';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Gallery />, document.getElementById('content'));
registerServiceWorker();
