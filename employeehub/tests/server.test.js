const request = require("supertest");
const app = require("../server");

describe("API Endpoints Existence", () => {
  

  it("Endpoint_api_employees_should_exist_GET", (done) => {
    request(app) 
      .get("/api/employees")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });



  it("Invalid_ID_Endpoint_api_employees_PUT_status_code_400", (done) => {
    const requestBody = {
        "name":"dempo2"
    };
    const validemployeeId = "C";

    request(app)
      .put(`/api/employees/${validemployeeId}`)
      .send(requestBody)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("Invalid_ID_Endpoint_api_employees_DELETE_status_code_400", (done) => {
    const validemployeeId = "C";

    request(app)
      .delete(`/api/employees/${validemployeeId}`)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);

        done();
      });
  });


  it("Invalid_Endpoint_api_employee_POST_status_code_404", (done) => {
    const requestBody = {
      "name": "John Doe",
      "email": "john.doe@example.com",
    };

    request(app)
      .post("/api/employee")
      .send(requestBody) 
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });


  it("Invalid_Endpoint_api_employee_GET_status_code_404", (done) => {
    request(app) 
      .get("/api/employee")
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });


  it("Endpoint_api_employees_should_exist_PUT", (done) => {
    const requestBody = {
        "name":"James",
        "email":"james@gmail.com",
        "phone":"9876543201",
        "department":"HR",
        "status":"Active"
    }
    const validemployeeId = "56925878-5e30-4cfe-a9b8-6f98d28bc1b5";
    request(app)
      .put(`/api/employees/${validemployeeId}`)
      .send(requestBody)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });


  it("Endpoint_api_employees_should_exist_DELETE", (done) => {
      const validemployeeId = "48925868-5f30-4bfe-a9b9-6f98b24bc1b5";
  
      request(app)
        .delete(`/api/employees/${validemployeeId}`)
        .expect(204)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });

  it("Endpoint_api_employees_should_exist_GET_by_ID", (done) => {
    const validemployeeId = "56925878-5e30-4cfe-a9b8-6f98d28bc1b5";
    request(app)
      .get(`/api/employees/${validemployeeId}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("Invalid_ID_Endpoint_api_employees_should_not_exist_GET_by_ID_status_code_400", (done) => {
    const validemployeeId = "31046226";
    request(app)
      .get(`/api/employees/${validemployeeId}`)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
  
});

module.exports = app;
