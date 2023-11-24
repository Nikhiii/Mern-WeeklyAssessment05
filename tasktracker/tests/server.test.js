const request = require("supertest");
const app = require("../server");

describe("API Endpoints Existence", () => {
  

  it("Endpoint_api_tasks_should_exist_GET", (done) => {
    request(app) 
      .get("/api/tasks")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });



  it("Invalid_ID_Endpoint_api_tasks_PUT_status_code_400", (done) => {
    const requestBody = {
        "name":"demo2"
    };
    const validtaskId = "C";

    request(app)
      .put(`/api/tasks/${validtaskId}`)
      .send(requestBody)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("Invalid_ID_Endpoint_api_tasks_DELETE_status_code_400", (done) => {
    const validtaskId = "C";

    request(app)
      .delete(`/api/tasks/${validtaskId}`)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);

        done();
      });
  });


  it("Invalid_Endpoint_api_task_POST_status_code_404", (done) => {
    const requestBody = {
      "name": "John Doe",
      "email": "john.doe@example.com",
    };

    request(app)
      .post("/api/task")
      .send(requestBody) 
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });


  it("Invalid_Endpoint_api_task_GET_status_code_404", (done) => {
    request(app) 
      .get("/api/task")
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });


  it("Endpoint_api_tasks_should_exist_PUT", (done) => {
    const requestBody = {
        "taskTitle":"Task1",
        "taskDescription":"A mobileapp development",
        "taskPriority":"High",
        "taskStatus":"In Progress",
        "taskDueDate":"2023-12-01"
    }
    const validtaskId = "9c0d565b-16dd-4836-873c-a99449fcfec7";
    request(app)
      .put(`/api/tasks/${validtaskId}`)
      .send(requestBody)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });


  it("Endpoint_api_tasks_should_exist_DELETE", (done) => {
      const validtaskId = "d4ce8ef4-a897-483c-8215-2d3162f336a2";
  
      request(app)
        .delete(`/api/tasks/${validtaskId}`)
        .expect(204)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });

  it("Endpoint_api_tasks_should_exist_GET_by_ID", (done) => {
    const validtaskId = "9c0d565b-16dd-4836-873c-a99449fcfec7";
    request(app)
      .get(`/api/tasks/${validtaskId}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });

  it("Invalid_ID_Endpoint_api_tasks_should_not_exist_GET_by_ID_status_code_400", (done) => {
    const validtaskId = "31046226";
    request(app)
      .get(`/api/tasks/${validtaskId}`)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
  
});

module.exports = app;
