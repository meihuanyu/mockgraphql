import React from 'react';
import ReactDOM from 'react-dom';

import { uploadFile } from './test'
import './index.css';
import Start from './start';
import registerServiceWorker from './registerServiceWorker';
import 'antd/dist/antd.css'; 
ReactDOM.render(<Start />, document.getElementById('root'));
registerServiceWorker();
