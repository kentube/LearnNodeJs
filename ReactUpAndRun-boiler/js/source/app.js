'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Logo from './components/Logo';
import MyTable from './components/MyTable';

ReactDOM.render(
  <h1>
    <MyTable /> Welcome to The MyTable App!
  </h1>,
  document.getElementById('app')
);