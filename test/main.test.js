const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Express App Endpoints', () => {
    it('should return the home page with status 200', (done) => {
        chai
            .request(app)
            .get('/')
            .end((err, res) => {
                expect(res).to.have.property('status').to.equal(200);
                done();
            });
    });

    it('should return a post with status 200', (done) => {
        const postId = 'post_id';
        chai
            .request(app)
            .get(`/post/${postId}`)
            .end((err, res) => {
                expect(res).to.have.property('status').to.equal(200);
                done();
            });
    });

    it('should return search results with status 200', (done) => {
        chai
            .request(app)
            .post('/search')
            .send({ searchTerm: 'search_term' }) 
            .end((err, res) => {
                expect(res).to.have.property('status').to.equal(200);
                done();
            });
    });

    it('should return the about page with status 200', (done) => {
        chai
            .request(app)
            .get('/about')
            .end((err, res) => {
                expect(res).to.have.property('status').to.equal(200);
                done();
            });
    });

    it('should return the contact page with status 200', (done) => {
        chai
            .request(app)
            .get('/contact')
            .end((err, res) => {
                expect(res).to.have.property('status').to.equal(200);
                done();
            });
    });
});
