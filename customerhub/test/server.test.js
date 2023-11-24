const request = require("supertest");
const app = require("../server");

describe("API Endpoints Existence", () => {
  

  it("Endpoint_api_customers_should_exist_GET", (done) => {
    request(app) 
      .get("/api/customers")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });



  it("Invalid_ID_Endpoint_api_customers_PUT_status_code_400", (done) => {
    const requestBody = {
        "name":"dempo2"
    };
    const validCustomerId = "C";

    request(app)
      .put(`/api/customers/${validCustomerId}`)
      .send(requestBody)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("Invalid_ID_Endpoint_api_customers_DELETE_status_code_400", (done) => {
    const validCustomerId = "C";

    request(app)
      .delete(`/api/customers/${validCustomerId}`)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);

        done();
      });
  });


  it("Invalid_Endpoint_api_customer_POST_status_code_404", (done) => {
    const requestBody = {
      "name": "John Doe",
      "email": "john.doe@example.com",
    };

    request(app)
      .post("/api/customer")
      .send(requestBody) 
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });


  it("Invalid_Endpoint_api_customer_GET_status_code_404", (done) => {
    request(app) 
      .get("/api/customer")
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });


  it("Endpoint_api_customers_should_exist_PUT", (done) => {
    const requestBody = {
        "name":"Emily",
        "email":"james@gmail.com",
        "phone":"9876543210",
        "address":"Amarillo",
        "accountNumber":"58574685477"
    };
    const validCustomerId = "31046226-2b40-4d55-8468-3ecd35cd2d40";
    request(app)
      .put(`/api/customers/${validCustomerId}`)
      .send(requestBody)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });


  it("Endpoint_api_customers_should_exist_DELETE", (done) => {
      const validCustomerId = "25607fa9-7a30-4136-a922-75ef1508f479";
  
      request(app)
        .delete(`/api/customers/${validCustomerId}`)
        .expect(204)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });

  it("Endpoint_api_customers_should_exist_GET_by_ID", (done) => {
    const validCustomerId = "31046226-2b40-4d55-8468-3ecd35cd2d40";
    request(app)
      .get(`/api/customers/${validCustomerId}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("Invalid_ID_Endpoint_api_customers_should_not_exist_GET_by_ID_status_code_400", (done) => {
    const validCustomerId = "31046226";
    request(app)
      .get(`/api/customers/${validCustomerId}`)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
  
});

module.exports = app;