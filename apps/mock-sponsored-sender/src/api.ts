import { Hono } from "hono";

const api = new Hono();

// Global Middleware

api.use(async (c, next) => {
    const { req } = c
    const now = Date.now()
    await next()
    const ms = Date.now() - now
    console.log(`[${new Date(now).toISOString()}] ${req.method} ${req.url} - ${ms}ms`)
});

// Sponsored Endpoint

api.post("/:chainId", async (c) => {
    const { chainId } = c.req.param()
    if (!chainId) {
        return c.json({ error: "chainId is required" }, 400)
    }

    // todo validate the chain id

    if (c.req.header("Content-Type") !== 'application/json') {
        return c.json({ error: "Content-Type must be application/json" }, 400)
    }

    // grab the router for this chain and handle

    const body = await c.req.json()
    console.log(body)

    return c.text("ok")
});

export default api
