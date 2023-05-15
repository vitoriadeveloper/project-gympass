import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Search Gym (e2e)", () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });
    it("should be able to search gyms", async () => {
        const { token } = await createAndAuthenticateUser(app, true);

        await request(app.server)
            .post("/gyms")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Javascript Gym",
                description: "Some description",
                phone: "8299999999",
                latitude: -12.930765,
                longitude: -38.4186819,
            });

        await request(app.server)
            .post("/gyms")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Typescript Gym",
                description: "Some description",
                phone: "8299999999",
                latitude: -12.930765,
                longitude: -38.4186819,
            });

        const response = await request(app.server)
            .get("/gyms/search")
            .query({
                q: "Javascript",
            })
            .set("Authorization", `Bearer ${token}`)
            .send();

        expect(response.statusCode).toEqual(200);
        expect(response.body.gyms).toHaveLength(1);
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: "Javascript Gym",
            }),
        ]);
    });
});
