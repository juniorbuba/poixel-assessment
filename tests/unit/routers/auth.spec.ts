import * as chai from "chai";
import { app } from "../../../server/api";
import * as status from "http-status";
import chaiHttp = require("chai-http");
import { randomNumber } from "../../../server/helpers";
import { BUSINESS_TYPE } from "../../../server/enums";

const should = chai.should();

chai.use(chaiHttp);

const server = app.app;
const adminLogin = "/api/v1/auth/admin";
const userLogin = "/api/v1/auth/user";
const userRoute = "/api/v1/user";
let token = "";
let oneUserIDForListOneUserUnitTest = "";

describe("User Authentication", () => {
  it("should not log in a user", async () => {
    const userCredentials = {
      email: "juniorbuba4real@gmail.com",
      password: "$trongP@ssword123",
    };

    const res = await chai
      .request(server)
      .post(userLogin)
      .send(userCredentials);

    res.should.have.status(status.UNAUTHORIZED);
    res.body.should.be.an("object");
    res.body.should.have.property("message").eql("Email or password is wrong");
    res.body.should.have.property("error").eql(1);
  });
});

describe("Admin Authentication", () => {
  it("should log in admin and extract the token", async () => {
    const adminCredentials = {
      email: "admin@poixel.com",
      password: "$trongAdminP@ssword123",
    };

    const res = await chai
      .request(server)
      .post(adminLogin)
      .send(adminCredentials);

    res.should.have.status(status.OK);
    res.body.should.be.an("object");
    res.body.should.have.property("message").eql("Session created");
    res.body.should.have.property("success").eql(1);
    res.body.data.should.have.property("auth_token");
    res.body.data.should.have.property("admin");
    res.body.data.should.have.property("user");

    token = res.body.data.auth_token;
  });
});

describe("Admin: Register new user", () => {
    // email is unique, now this test can run without failing
    const random = randomNumber(2);
    it("should create a new user", async () => {
      const userCredentials = {
        first_name: "Mohammed",
        last_name: "Buba",
        email: `juniorbuba4real${random}@gmail.com`,
        password: "$trongP@ssword12",
        business_type: "enterprise",
        email_verified: "false"
    };

      const res = await chai
        .request(server)
        .post(userRoute)
        .set('Authorization', `Bearer ${token}`)
        .set('X-Requested-With', 'admin')
        .send(userCredentials);
  
      res.should.have.status(status.CREATED);
      res.body.should.be.an("object");
      res.body.should.have.property("message").eql("User account created successfully");
      res.body.data.should.have.property("user");
      res.body.should.have.property("success").eql(1);
    });
});

describe("Admin: List all users", () => {
it("should return all users stored in the database", async () => {

    const res = await chai
    .request(server)
    .get(userRoute)
    .set('Authorization', `Bearer ${token}`)
    .set('X-Requested-With', 'admin');

    // get the id of the first user and use to run the get one user unit test below
    oneUserIDForListOneUserUnitTest = res.body.data.users[0].id;

    res.should.have.status(status.OK);
    res.body.should.be.an("object");
    res.body.should.have.property("page_size");
    res.body.should.have.property("page");
    res.body.should.have.property("count");
    res.body.data.users.should.be.an('array');
    res.body.should.have.property("success").eql(1);
});
});

describe("Admin: List one user", () => {
    it("should return one user stored in the database", async () => {
    
        const res = await chai
        .request(server)
        .get(userRoute+`/${oneUserIDForListOneUserUnitTest}`)
        .set('Authorization', `Bearer ${token}`)
        .set('X-Requested-With', 'admin');
    
        res.should.have.status(status.OK);
        res.body.should.be.an("object");
        res.body.should.have.property("success").eql(1);
        res.body.should.have.property("message").eql(`User with id: ${oneUserIDForListOneUserUnitTest} found`);
        res.body.should.have.property("data");
    });
});

describe("Admin: update one user", () => {
    it("should update one user stored in the database", async () => {

        const update = {
            business_type: BUSINESS_TYPE.SMALL
        }
    
        const res = await chai
        .request(server)
        .put(userRoute+`/${oneUserIDForListOneUserUnitTest}`)
        .set('Authorization', `Bearer ${token}`)
        .set('X-Requested-With', 'admin');
    
        res.should.have.status(status.OK);
        res.body.should.be.an("object");
        res.body.should.have.property("success").eql(1);
        res.body.should.have.property("message").eql("User has been updated successfully");
        res.body.should.have.property("data");
    });
});

describe("Admin: delete one user", () => {
    it("should delete one user from the database", async () => {

        const res = await chai
        .request(server)
        .delete(userRoute+`/${oneUserIDForListOneUserUnitTest}`)
        .set('Authorization', `Bearer ${token}`)
        .set('X-Requested-With', 'admin');
    
        res.should.have.status(status.OK);
        res.body.should.be.an("object");
        res.body.should.have.property("success").eql(1);
        res.body.should.have.property("message").eql("User successfully deleted");
    });
});