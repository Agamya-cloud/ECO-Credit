import { RequestHandler } from "express";
import { z } from "zod";
import crypto from "crypto";

// In-memory store for demo purposes
interface StoredUser {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  full_name: string | null;
  carbon_credits: number;
  created_at: string;
  updated_at: string;
}

interface Session {
  user_id: number;
  token: string;
  expires_at: string;
}

const users: Map<number, StoredUser> = new Map();
const sessions: Map<string, Session> = new Map();
let nextUserId = 1;

// Simple password hashing (not secure - for demo only)
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// Validation schemas
const SignupSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_-]+$/),
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
  user?: Omit<StoredUser, "password_hash">;
  token?: string;
}

// Sign up endpoint
export const handleSignup: RequestHandler = async (req, res) => {
  try {
    const data = SignupSchema.parse(req.body);

    // Check if user already exists
    const existingUser = Array.from(users.values()).find(
      (u) => u.email === data.email || u.username === data.username,
    );

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email or username already exists",
      } as AuthResponse);
    }

    // Hash password
    const passwordHash = hashPassword(data.password);

    // Create user
    const userId = nextUserId++;
    const user: StoredUser = {
      id: userId,
      username: data.username,
      email: data.email,
      password_hash: passwordHash,
      full_name: data.fullName || null,
      carbon_credits: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    users.set(userId, user);

    // Create session token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    sessions.set(token, {
      user_id: userId,
      token,
      expires_at: expiresAt.toISOString(),
    });

    const { password_hash, ...userWithoutPassword } = user;

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: userWithoutPassword,
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
    const user = Array.from(users.values()).find((u) => u.email === data.email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      } as AuthResponse);
    }

    // Verify password
    const isValidPassword = verifyPassword(data.password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      } as AuthResponse);
    }

    // Create session token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    sessions.set(token, {
      user_id: user.id,
      token,
      expires_at: expiresAt.toISOString(),
    });

    const { password_hash, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      message: "Signed in successfully",
      user: userWithoutPassword,
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
    const session = sessions.get(token);

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      } as AuthResponse);
    }

    // Check if token is expired
    if (new Date(session.expires_at) < new Date()) {
      sessions.delete(token);
      return res.status(401).json({
        success: false,
        message: "Token expired",
      } as AuthResponse);
    }

    // Get user data
    const user = users.get(session.user_id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      } as AuthResponse);
    }

    const { password_hash, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      user: userWithoutPassword,
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
    sessions.delete(token);

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
