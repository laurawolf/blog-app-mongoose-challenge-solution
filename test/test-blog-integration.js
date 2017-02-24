const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');

mongoose.Promise = global.Promise;

const should = chai.should();

const {BlogPost} = require('../models');
const {runServer, app, closeServer} = require('../server');

const {TESTS_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

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
};

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


describe('Get endpoint', () => {

	it('should return all blogposts', () => {
		let res;
		return chai.request(app)
    .get('/posts')
		.then(function (_res) { //why is it _res?????
			res = _res;
			res.should.have.status(200);
			res.body.should.have.length.of.at.least(10);
			return BlogPost.count()
		})
		.then(function(count) {
			res.body.should.have.length.of(count);
		});
		// create a post
	});
});

describe('POST endpoint', function() {

 it('should add a new blogpost', function () {
	 const newBlog = generateBlog();
	 return chai.request(app)
	 .post('/posts')
	 .send(newBlog)
	 .then(function(res) {
		 res.should.have.status(201);
		 res.should.be.json;
		 res.body.should.be.a('object');
		 res.body.should.include.keys(
			 'title', 'content', 'author');
		 });
	 });
 });
