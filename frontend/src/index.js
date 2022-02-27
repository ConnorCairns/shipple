import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ReducerProvider } from "./services/ReducerProvider";
import { initialState, reducer } from "./services/reducer";
import SocketProvider from "./services/channel/SocketProvider";

ReactDOM.render(
  <React.StrictMode>
    <ReducerProvider initialState={initialState} reducer={reducer} >
      <SocketProvider wsUrl="wss://shipple-api.fly.dev/ws" >
        <App />
      </SocketProvider>
    </ReducerProvider>
  </React.StrictMode >,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
