import { RequestHandler } from "express";
import { z } from "zod";
import { users, sessions } from "./auth";

export interface BillingEntry {
  id: number;
  user_id: number;
  energy_type: string;
  units_consumed: number;
  carbon_emissions: number;
  credits_earned: number;
  date: string;
  created_at: string;
}

interface LeaderboardUser {
  rank: number;
  id: number;
  username: string;
  full_name: string | null;
  credits: number;
  reduction: number;
  badge: "gold" | "silver" | "bronze" | null;
}

// In-memory storage for billing data
const billingData: Map<number, BillingEntry[]> = new Map();
let nextBillingId = 1;

// Carbon conversion factors (kg CO2 per unit)
const CARBON_FACTORS: Record<string, number> = {
  "Electricity (kWh)": 0.4,
  "Natural Gas (therms)": 5.3,
  "Fuel Oil (gallons)": 10.2,
  "Gasoline (gallons)": 8.9,
};

// Credits conversion (1 kg CO2 reduction = 1 credit, but some bonuses)
const CREDITS_MULTIPLIER = 1;

const BillingSchema = z.object({
  energy_type: z.string(),
  units_consumed: z.number().positive(),
  date: z.string(),
});

interface BillingResponse {
  success: boolean;
  message?: string;
  data?: BillingEntry;
}

// Upload billing data
export const handleBillingUpload: RequestHandler = (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      } as BillingResponse);
    }

    // Verify token
    const session = sessions.get(token);
    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      } as BillingResponse);
    }

    const data = BillingSchema.parse(req.body);
    const userId = session.user_id;
    const user = users.get(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      } as BillingResponse);
    }

    // Calculate carbon emissions
    const carbonFactor = CARBON_FACTORS[data.energy_type] || 0.5;
    const carbonEmissions = data.units_consumed * carbonFactor;
    const creditsEarned = Math.round(carbonEmissions * CREDITS_MULTIPLIER);

    // Create billing entry
    const billingEntry: BillingEntry = {
      id: nextBillingId++,
      user_id: userId,
      energy_type: data.energy_type,
      units_consumed: data.units_consumed,
      carbon_emissions: carbonEmissions,
      credits_earned: creditsEarned,
      date: data.date,
      created_at: new Date().toISOString(),
    };

    // Store billing data
    if (!billingData.has(userId)) {
      billingData.set(userId, []);
    }
    billingData.get(userId)!.push(billingEntry);

    // Update user's carbon credits
    user.carbon_credits += creditsEarned;
    user.updated_at = new Date().toISOString();

    return res.status(201).json({
      success: true,
      message: "Billing data submitted successfully",
      data: billingEntry,
    } as BillingResponse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid input",
      } as BillingResponse);
    }
    console.error("Billing upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    } as BillingResponse);
  }
};

// Get user's billing history
export const handleGetBillingHistory: RequestHandler = (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const session = sessions.get(token);
    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    const userBillingData = billingData.get(session.user_id) || [];

    return res.status(200).json({
      success: true,
      data: userBillingData,
    });
  } catch (error) {
    console.error("Get billing history error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get leaderboard data
export const handleGetLeaderboard: RequestHandler = (_req, res) => {
  try {
    // Convert users to leaderboard format
    const leaderboardUsers: LeaderboardUser[] = Array.from(users.values())
      .map((user) => ({
        rank: 0,
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        credits: user.carbon_credits,
        reduction: Math.round(user.carbon_credits * 0.5), // Rough estimate: 1 credit = 0.5 kg CO2 reduction
        badge: null as "gold" | "silver" | "bronze" | null,
      }))
      .sort((a, b) => b.credits - a.credits);

    // Assign badges to top 3
    if (leaderboardUsers.length > 0) leaderboardUsers[0].badge = "gold";
    if (leaderboardUsers.length > 1) leaderboardUsers[1].badge = "silver";
    if (leaderboardUsers.length > 2) leaderboardUsers[2].badge = "bronze";

    // Assign ranks
    leaderboardUsers.forEach((user, index) => {
      user.rank = index + 1;
    });

    // Calculate stats
    const totalUsers = leaderboardUsers.length;
    const totalCredits = leaderboardUsers.reduce((sum, u) => sum + u.credits, 0);
    const totalReduction = leaderboardUsers.reduce(
      (sum, u) => sum + u.reduction,
      0,
    );

    return res.status(200).json({
      success: true,
      data: leaderboardUsers,
      stats: {
        totalUsers,
        totalCredits,
        totalReduction,
      },
    });
  } catch (error) {
    console.error("Get leaderboard error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
