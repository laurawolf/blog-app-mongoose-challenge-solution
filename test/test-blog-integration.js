const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');

mongoose.Promise = global.Promise;

const should = chai.should();

const {BlogPost} = require('../models');
const {runServer, app, closeServer} = require('../server');

const {TESTS_DATABASE_URL} = require('../config');

function generateBlog(){
	return {
		title: faker.lorem.sentence(),
		author: {
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName()
		},
		content: faker.lorem.sentences(5)
	}
}

function addXblogsToDb(x){
	const blogs = [];
	for (let i = 0; i < x; i++) {
		blogs.push(generateBlog());
	}
	return BlogPost.insertMany(blogs);
}

// run this function ONCE when `mocha` is invoked
before(() => {
	return runServer('mongodb://localhost/testBlogApp');
});

// run this function before EVERY it() test
beforeEach(() => {
	return addXblogsToDb(10);
});

// run this function after EVERY it() test
afterEach(() => {
	return mongoose.connection.db.dropDatabase();
});

// run this function ONCE when all tests complete
after(() => {
	return closeServer();
});


describe('test', () => {
	it('creates one post', () => {
		// create a post
	})
	
	it('just a test', () => {
		return BlogPost.count()
			.then(count => count.should.eq(10));
	});
});

describe();
describe();

