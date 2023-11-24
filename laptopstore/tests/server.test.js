const request = require("supertest");
const app = require("../server");

describe("API Endpoints Existence", () => {
  

  it("Endpoint_api_laptops_should_exist_GET", (done) => {
    request(app) 
      .get("/api/laptops")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });



  it("Invalid_ID_Endpoint_api_laptops_PUT_status_code_400", (done) => {
    const requestBody = {
        "name":"dempo2"
    };
    const validlaptopId = "C";

    request(app)
      .put(`/api/laptops/${validlaptopId}`)
      .send(requestBody)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("Invalid_ID_Endpoint_api_laptops_DELETE_status_code_400", (done) => {
    const validlaptopId = "C";

    request(app)
      .delete(`/api/laptops/${validlaptopId}`)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);

        done();
      });
  });


  it("Invalid_Endpoint_api_laptop_POST_status_code_404", (done) => {
    const requestBody = {
      "name": "John Doe",
      "email": "john.doe@example.com",
    };

    request(app)
      .post("/api/laptop")
      .send(requestBody) 
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });


  it("Invalid_Endpoint_api_laptop_GET_status_code_404", (done) => {
    request(app) 
      .get("/api/laptop")
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });


  it("Endpoint_api_laptops_should_exist_PUT", (done) => {
    const requestBody = {
        "brand":"HP",
        "model":"AXY",
        "processor":
        "Intel","ram":"16GB",
        "storage":"228",
        "price":55000,
        "availability":true,
    };
    const validlaptopId = "9b42fc36-4b0c-48f4-9660-702bac873377";
    request(app)
      .put(`/api/laptops/${validlaptopId}`)
      .send(requestBody)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });


  it("Endpoint_api_laptops_should_exist_DELETE", (done) => {
      const validlaptopId = "9a42fc36-4b0c-48e4-8660-702bac773377";
  
      request(app)
        .delete(`/api/laptops/${validlaptopId}`)
        .expect(204)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });

  it("Endpoint_api_laptops_should_exist_GET_by_ID", (done) => {
    const validlaptopId = "9b42fc36-4b0c-48f4-9660-702bac873377";
    request(app)
      .get(`/api/laptops/${validlaptopId}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("Invalid_ID_Endpoint_api_laptops_should_not_exist_GET_by_ID_status_code_400", (done) => {
    const validlaptopId = "31046226";
    request(app)
      .get(`/api/laptops/${validlaptopId}`)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
  
});

module.exports = app;
