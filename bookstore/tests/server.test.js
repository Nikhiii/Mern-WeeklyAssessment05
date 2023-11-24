const request = require("supertest");
const app = require("../server");

describe("API Endpoints Existence", () => {
  

  it("Endpoint_api_books_should_exist_GET", (done) => {
    request(app) 
      .get("/api/books")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });



  it("Invalid_ID_Endpoint_api_books_PUT_status_code_400", (done) => {
    const requestBody = {
        "name":"demo2"
    };
    const validbookId = "C";

    request(app)
      .put(`/api/books/${validbookId}`)
      .send(requestBody)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("Invalid_ID_Endpoint_api_books_DELETE_status_code_400", (done) => {
    const validbookId = "C";

    request(app)
      .delete(`/api/books/${validbookId}`)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);

        done();
      });
  });


  it("Invalid_Endpoint_api_book_POST_status_code_404", (done) => {
    const requestBody = {
      "name": "John Doe",
      "email": "john.doe@example.com",
    };

    request(app)
      .post("/api/book")
      .send(requestBody) 
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });


  it("Invalid_Endpoint_api_book_GET_status_code_404", (done) => {
    request(app) 
      .get("/api/book")
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });


  it("Endpoint_api_books_should_exist_PUT", (done) => {
    const requestBody = {
        "title":"Java Basics",
        "author":"Dennis Ritchie",
        "genre":"Technology",
        "publishedYear":2005,
        "price":1999,
        "availability":true
    }
    const validbookId = "4dd0ed36-b11a-4bf4-a4e5-8592677af80e";
    request(app)
      .put(`/api/books/${validbookId}`)
      .send(requestBody)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });


  it("Endpoint_api_books_should_exist_DELETE", (done) => {
      const validbookId = "d82255d3-d4f0-49d5-a3bd-a75e198c4f4f";
  
      request(app)
        .delete(`/api/books/${validbookId}`)
        .expect(204)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });

  it("Endpoint_api_books_should_exist_GET_by_ID", (done) => {
    const validbookId = "4dd0ed36-b11a-4bf4-a4e5-8592677af80e";
    request(app)
      .get(`/api/books/${validbookId}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("Invalid_ID_Endpoint_api_books_should_not_exist_GET_by_ID_status_code_400", (done) => {
    const validbookId = "31046226";
    request(app)
      .get(`/api/books/${validbookId}`)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
  
});

module.exports = app;
