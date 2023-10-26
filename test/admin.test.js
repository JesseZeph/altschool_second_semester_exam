const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;

describe('Admin Route Endpoints', () => {
    it('should return the admin login page with status 200', (done) => {
        chai
            .request(app)
            .get('/admin')
            .end((err, res) => {
                expect(res).to.have.property('status').to.equal(200);
                done();
            });
    });

    it('should register a new user with status 200', (done) => {
        chai
            .request(app)
            .post('/register')
            .send({
                email: 'test@example.com',
                username: 'testuser',
                password: 'testpassword',
                firstname: 'Test',
                lastname: 'User'
            })
            .end((err, res) => {
                expect(res).to.have.property('status').to.equal(200);
                done();
            });
    });

    it('should authenticate an admin user with status 200', (done) => {
        chai
            .request(app)
            .post('/admin')
            .send({
                username: 'testuser', 
                password: 'testpassword'
            })
            .end((err, res) => {
                expect(res).to.have.property('status').to.equal(200);
                done();
            });
    });

    it('should return the admin dashboard with status 200', (done) => {
        chai
            .request(app)
            .get('/dashboard')
            .end((err, res) => {
                expect(res).to.have.property('status').to.equal(200);
                done();
            });
    });

    it('should return the add post page with status 200', (done) => {
        chai
            .request(app)
            .get('/add-post')
            .end((err, res) => {
                expect(res).to.have.property('status').to.equal(200);
                done();
            });
    });

    it('should add a new post with status 200', (done) => {
        chai
            .request(app)
            .post('/add-post')
            .send({
                title: 'Test Post',
                description: 'This is a test post.',
                body: 'This is the body of the test post.',
                tags: 'test, example, post'
            })
            .end((err, res) => {
                expect(res).to.have.property('status').to.equal(200);
                done();
            });
    });

    it('should edit a post with status 200', (done) => {
        const postId = 'test-post-id';
        chai
            .request(app)
            .get(`/edit-post/${postId}`)
            .end((err, res) => {
                expect(res).to.have.property('status').to.equal(200);
                done();
            });
    });

    it('should update a post with status 200', (done) => {
        const postId = 'test-post-id';
        chai
            .request(app)
            .put(`/edit-post/${postId}`)
            .send({
                title: 'Updated Test Post',
                description: 'This is an updated test post.',
                body: 'This is the updated body of the test post.',
                tags: 'test, example, post, updated'
            })
            .end((err, res) => {
                expect(res).to.have.property('status').to.equal(200);
                done();
            });
    });

    it('should delete a post with status 200', (done) => {
        const postId = 'test-post-id';
        chai
            .request(app)
            .delete(`/delete-post/${postId}`)
            .end((err, res) => {
                expect(res).to.have.property('status').to.equal(200);
                done();
            });
    });

    it('should publish a post with status 200', (done) => {
        const postId = 'test-post-id';
        chai
            .request(app)
            .post(`/publish-post/${postId}`)
            .end((err, res) => {
                expect(res).to.have.property('status').to.equal(200);
                done();
            });
    });

    it('should log out the user and redirect with status 200', (done) => {
        chai
            .request(app)
            .get('/logout')
            .end((err, res) => {
                expect(res).to.have.property('status').to.equal(200);
                done();
            });
    });

});
