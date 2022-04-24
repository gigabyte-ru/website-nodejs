#!/usr/bin/env node
import productImages from '../services/productImages.js';
import runProductsParsers from '../utils/runProductsParsers.js';

runProductsParsers(productImages);