import { Router, type IRouter } from "express";
import { body, validationResult } from "express-validator";
import { authenticateUser, createAuthToken, registerUser } from "../lib/auth";

const router: IRouter = Router();

router.post(
  "/auth/register",
  body("email").isEmail().withMessage("A valid email is required"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("name").trim().isLength({ min: 2 }).withMessage("Name is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const user = await registerUser(req.body);
      const token = createAuthToken({ ...user, id: user.id });
      res.status(201).json({ token, user });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Registration failed";
      res.status(409).json({ error: message });
    }
  },
);

router.post(
  "/auth/login",
  body("email").isEmail().withMessage("A valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const user = await authenticateUser(req.body.email, req.body.password);
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = createAuthToken({ ...user, id: user.id });
    res.json({ token, user });
  },
);

router.post("/auth/logout", (_req, res) => {
  res.json({ message: "Logged out" });
});

export default router;
