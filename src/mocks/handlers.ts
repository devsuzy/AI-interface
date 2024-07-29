import { rest } from "msw";

export const handlers = [
  rest.post("/login", (req, res, ctx) => {
    // sessionStorage.setItem("is-authenticated", "true");
    return res(ctx.status(200));
  }),
  rest.get("/users", (req, res, ctx) => {
    // const { userId } = req.params;
    const userId = "1";

    return res(
      ctx.json({
        id: userId,
        firstName: "John",
        lastName: "Maverick",
      })
    );
  }),
];
