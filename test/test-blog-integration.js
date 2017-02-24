const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const should = chai.should();

const {BlogPost} = require('../models');
const {runServer, app, closeServer} = require('../server');

const {TESTS_DATABASE_URL} = require('../config');

