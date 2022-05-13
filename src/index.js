import React from 'react'
import ReactDOM from 'react-dom'

import {App} from './App'

const renderApp = IS_PROD ? <React.StrictMode><App /></React.StrictMode> : <App />

ReactDOM.render(renderApp, document.getElementById('root'))
