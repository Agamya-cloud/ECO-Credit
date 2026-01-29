import { RequestHandler } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import { db, type User } from "../db";
import crypto from "crypto";

// Validation schemas
const SignupSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_-]+$/),
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().optional(),
});

const SigninSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: Omit<User, "password_hash">;
  token?: string;
}

// Sign up endpoint
export const handleSignup: RequestHandler = async (req, res) => {
  try {
    const data = SignupSchema.parse(req.body);

    // Check if user already exists
    const existingUser = db
      .prepare("SELECT id FROM users WHERE email = ? OR username = ?")
      .get(data.email, data.username);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email or username already exists",
      } as AuthResponse);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);

    // Create user
    const stmt = db.prepare(`
      INSERT INTO users (username, email, password_hash, full_name)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(
      data.username,
      data.email,
      passwordHash,
      data.fullName || null
    );

    const userId = (result.lastInsertRowid as number) || 0;

    // Get the created user
    const user = db
      .prepare(
        "SELECT id, username, email, full_name, carbon_credits, created_at, updated_at FROM users WHERE id = ?"
      )
      .get(userId) as Omit<User, "password_hash"> | undefined;

    if (!user) {
      return res.status(500).json({
        success: false,
        message: "Failed to create user",
      } as AuthResponse);
    }

    // Create session token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    db.prepare(
      "INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)"
    ).run(userId, token, expiresAt.toISOString());

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
      token,
    } as AuthResponse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid input",
      } as AuthResponse);
    }
    console.error("Signup error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    } as AuthResponse);
  }
};

// Sign in endpoint
export const handleSignin: RequestHandler = async (req, res) => {
  try {
    const data = SigninSchema.parse(req.body);

    // Find user by email
    const user = db
      .prepare("SELECT id, password_hash FROM users WHERE email = ?")
      .get(data.email) as
      | { id: number; password_hash: string }
      | undefined;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      } as AuthResponse);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(
      data.password,
      user.password_hash
    );

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      } as AuthResponse);
    }

    // Get full user data
    const fullUser = db
      .prepare(
        "SELECT id, username, email, full_name, carbon_credits, created_at, updated_at FROM users WHERE id = ?"
      )
      .get(user.id) as Omit<User, "password_hash"> | undefined;

    if (!fullUser) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve user",
      } as AuthResponse);
    }

    // Create session token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    db.prepare(
      "INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)"
    ).run(user.id, token, expiresAt.toISOString());

    return res.status(200).json({
      success: true,
      message: "Signed in successfully",
      user: fullUser,
      token,
    } as AuthResponse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid input",
      } as AuthResponse);
    }
    console.error("Signin error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    } as AuthResponse);
  }
};

// Verify token endpoint
export const handleVerifyToken: RequestHandler = (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      } as AuthResponse);
    }

    // Check if token is valid and not expired
    const session = db
      .prepare(
        `SELECT user_id, expires_at FROM sessions WHERE token = ? AND expires_at > datetime('now')`
      )
      .get(token) as { user_id: number; expires_at: string } | undefined;

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      } as AuthResponse);
    }

    // Get user data
    const user = db
      .prepare(
        "SELECT id, username, email, full_name, carbon_credits, created_at, updated_at FROM users WHERE id = ?"
      )
      .get(session.user_id) as Omit<User, "password_hash"> | undefined;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      } as AuthResponse);
    }

    return res.status(200).json({
      success: true,
      user,
      token,
    } as AuthResponse);
  } catch (error) {
    console.error("Verify token error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    } as AuthResponse);
  }
};

// Logout endpoint
export const handleLogout: RequestHandler = (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "No token provided",
      } as AuthResponse);
    }

    // Delete session
    db.prepare("DELETE FROM sessions WHERE token = ?").run(token);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    } as AuthResponse);
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    } as AuthResponse);
  }
};
