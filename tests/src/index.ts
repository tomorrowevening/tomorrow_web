import './scss/main.scss'
// src
import debug from '../../src/utils/debug';
import * as dom from '../../src/utils/dom';
import loader from '../../src/utils/loader';
import * as math from '../../src/utils/math';
import raf from '../../src/utils/raf';
import * as three from '../../src/utils/three';

window.onload = () => {
  console.log('App loaded');
  console.log('debug', debug);
  console.log('dom', dom);
  console.log('loader', loader);
  console.log('math', math);
  console.log('raf', raf);
  console.log('three', three);
};