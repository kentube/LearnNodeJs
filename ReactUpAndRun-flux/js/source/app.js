'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Logo from './components/Logo';
import Whinepad from './components/Whinepad';
import schema from './schema';
import CRUDStore from './flux/CRUDStore';

CRUDStore.init(schema);

ReactDOM.render(
  <div>
    <div className="app-header">
      <Logo /> Welcome to the WhinePad!
    </div>
    <Whinepad />
  </div>,
  document.getElementById('pad')
);

