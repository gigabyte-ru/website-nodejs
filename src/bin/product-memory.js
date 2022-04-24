#!/usr/bin/env node
import productMemorySupport from '../services/productMemorySupport.js';
import runProductsParsers from '../utils/runProductsParsers.js';

runProductsParsers(productMemorySupport);