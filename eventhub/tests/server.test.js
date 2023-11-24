const request = require("supertest");
const app = require("../server");

describe("API Endpoints Existence", () => {
  

  it("Endpoint_api_events_should_exist_GET", (done) => {
    request(app) 
      .get("/api/events")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });



  it("Invalid_ID_Endpoint_api_events_PUT_status_code_400", (done) => {
    const requestBody = {
        "name":"demo2"
    };
    const valideventId = "C";

    request(app)
      .put(`/api/events/${valideventId}`)
      .send(requestBody)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("Invalid_ID_Endpoint_api_events_DELETE_status_code_400", (done) => {
    const valideventId = "C";

    request(app)
      .delete(`/api/events/${valideventId}`)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);

        done();
      });
  });


  it("Invalid_Endpoint_api_event_POST_status_code_404", (done) => {
    const requestBody = {
      "name": "John Doe",
      "email": "john.doe@example.com",
    };

    request(app)
      .post("/api/event")
      .send(requestBody) 
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });


  it("Invalid_Endpoint_api_event_GET_status_code_404", (done) => {
    request(app) 
      .get("/api/event")
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });


  it("Endpoint_api_events_should_exist_PUT", (done) => {
    const requestBody = {
        "eventName":"QA Conference",
        "eventDate":"12/12/2023",
        "eventLocation":"Mumbai",
        "eventDescription":"Startup meet",
        "eventOrganizer":"QA Edu tech.",
        "eventTicketPrice":1200
    }
    const valideventId = "e90bffe7-5dd2-4fa9-9134-4a14bfd8b90b";
    request(app)
      .put(`/api/events/${valideventId}`)
      .send(requestBody)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });


  it("Endpoint_api_events_should_exist_DELETE", (done) => {
      const valideventId = "b11b2383-eebd-40e6-b45a-bb66e412f189";
  
      request(app)
        .delete(`/api/events/${valideventId}`)
        .expect(204)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });

  it("Endpoint_api_events_should_exist_GET_by_ID", (done) => {
    const valideventId = "e90bffe7-5dd2-4fa9-9134-4a14bfd8b90b";
    request(app)
      .get(`/api/events/${valideventId}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("Invalid_ID_Endpoint_api_events_should_not_exist_GET_by_ID_status_code_400", (done) => {
    const valideventId = "31046226";
    request(app)
      .get(`/api/events/${valideventId}`)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
  
});

module.exports = app;
