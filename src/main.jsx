import React from 'react';
import ReactDOM from 'react-dom/client';
import '@styles/index.css';
import '@styles/AbstractClasses.css';
import App from '@src/App';
import { Provider } from 'react-redux';
import { store } from '@store/store.js'


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Provider store={store}>
        <App/>
    </Provider>
);