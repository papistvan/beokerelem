import assert from "assert";
import express from "express";
import request from "supertest";
import { createWorkDayRouter } from "../src/workday/router.js";
import { describe, it } from "node:test";
import { mockProtect, mockBoss } from "./mockAuth.js";

const app = express();
app.use(express.json());

const mockStorage = {
  saveDay: () => {},
  getDayByDate: () => {},
};

mockStorage.saveDay = function () {
  return new Promise((resolve) => resolve(true));
};
mockStorage.getDayByDate = function () {
  return new Promise((resolve) => resolve(null));
};

app.use("/workdays", createWorkDayRouter(mockStorage, mockProtect, mockBoss));

describe("POST /workdays/day", () => {
  it("should create a new workday successfully", async () => {
    mockStorage.getDayByDate = function () {
      return new Promise((resolve) => resolve(null));
    };

    const response = await request(app).post("/workdays/day").send({
      date: "2024-07-10",
      manhour: 40,
      openhour: 9,
      closehour: 17,
      feast: false,
    });
    console.log(response.body);
    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.body, { ok: true });
  });

  it("should return an error if the workday already exists", async () => {
    mockStorage.getDayByDate = function () {
      return new Promise((resolve) =>
        resolve({
          date: "2024-07-10",
          manhour: 40,
          openhour: 9,
          closehour: 17,
          feast: false,
        })
      );
    };

    const response = await request(app).post("/workdays/day").send({
      date: "2024-07-10",
      manhour: 40,
      openhour: 9,
      closehour: 17,
      feast: false,
    });

    assert.strictEqual(response.status, 400);
    assert.strictEqual(response.body.error, "A nap már létezik!");
  });

  it("should return an error if any required field is missing", async () => {
    const response = await request(app).post("/workdays/day").send({
      date: "2024-07-20",
      manhour: 8,
      openhour: 9,
      // closehour is missing
      feast: false,
    });

    assert.strictEqual(response.status, 400);
    assert.strictEqual(response.body.error, "Minden mező kitöltése kötelező!");
  });

  it("should return an error if the open hour is greater than or equal to the close hour", async () => {
    const response = await request(app).post("/workdays/day").send({
      date: "2024-07-40",
      manhour: 8,
      openhour: 18,
      closehour: 17,
      feast: false,
    });

    assert.strictEqual(response.status, 400);
    assert.strictEqual(
      response.body.error,
      "Nyitási óra kisebb kell legyen, mint zárási óra!"
    );
  });
});
