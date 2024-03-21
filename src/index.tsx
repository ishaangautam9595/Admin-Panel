import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import 'semantic-ui-css/semantic.min.css'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Loader } from 'semantic-ui-react';
import { Provider } from 'react-redux';
import store from './_redux/store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
    <Suspense fallback={<Loader active inline='centered' className="loader" />}>
      <App />
      <ToastContainer
        transition={Zoom}
        autoClose={3000}
        limit={3}
      />
    </Suspense>
  </Provider>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
