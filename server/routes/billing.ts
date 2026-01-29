import { RequestHandler } from "express";
import { z } from "zod";
import { db, type BillingData } from "../db";

// Emission factors for different energy types
const emissionFactors: Record<string, number> = {
  "Electricity (kWh)": 0.4, // kg CO2 per kWh
  "Natural Gas (therms)": 11.7, // kg CO2 per therm
  "Fuel Oil (gallons)": 10.15, // kg CO2 per gallon
  "Gasoline (gallons)": 8.89, // kg CO2 per gallon
};

// Carbon credits per kg of CO2 (100 credits per kg)
const CREDITS_PER_KG_CO2 = 100;

const BillingDataSchema = z.object({
  energyType: z.string(),
  unitsConsumed: z.number().positive(),
  date: z.string(),
});

export interface BillingResponse {
  success: boolean;
  message?: string;
  billingData?: BillingData;
  carbonEmissions?: number;
  creditsEarned?: number;
}

// Save billing data
export const handleUploadBillingData: RequestHandler = (req, res) => {
  try {
    const userId = (req as any).userId; // Assumes auth middleware sets this
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      } as BillingResponse);
    }

    const data = BillingDataSchema.parse(req.body);

    // Calculate carbon emissions
    const emissionFactor = emissionFactors[data.energyType];
    if (!emissionFactor) {
      return res.status(400).json({
        success: false,
        message: "Invalid energy type",
      } as BillingResponse);
    }

    const carbonEmissions = data.unitsConsumed * emissionFactor;
    const creditsEarned = Math.round(carbonEmissions * CREDITS_PER_KG_CO2);

    // Save to database
    const stmt = db.prepare(`
      INSERT INTO billing_data (user_id, energy_type, units_consumed, carbon_emissions, credits_earned, date)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      userId,
      data.energyType,
      data.unitsConsumed,
      carbonEmissions,
      creditsEarned,
      data.date,
    );

    // Update user's carbon credits
    db.prepare(
      "UPDATE users SET carbon_credits = carbon_credits + ? WHERE id = ?",
    ).run(creditsEarned, userId);

    // Get the saved billing data
    const billingRecord = db
      .prepare("SELECT * FROM billing_data WHERE id = ?")
      .get(result.lastInsertRowid) as BillingData | undefined;

    return res.status(201).json({
      success: true,
      message: "Billing data saved successfully",
      billingData: billingRecord,
      carbonEmissions,
      creditsEarned,
    } as BillingResponse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid input",
      } as BillingResponse);
    }
    console.error("Upload billing data error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    } as BillingResponse);
  }
};

// Get user's billing history
export const handleGetBillingHistory: RequestHandler = (req, res) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      } as BillingResponse);
    }

    const billingHistory = db
      .prepare(
        "SELECT * FROM billing_data WHERE user_id = ? ORDER BY date DESC",
      )
      .all(userId) as BillingData[];

    return res.status(200).json({
      success: true,
      billingData: billingHistory,
    });
  } catch (error) {
    console.error("Get billing history error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    } as BillingResponse);
  }
};

// Get leaderboard data
export const handleGetLeaderboard: RequestHandler = (req, res) => {
  try {
    const leaderboard = db
      .prepare(
        `
        SELECT 
          u.id,
          u.username,
          u.full_name,
          u.carbon_credits,
          SUM(b.carbon_emissions) as total_emissions,
          COUNT(b.id) as submissions
        FROM users u
        LEFT JOIN billing_data b ON u.id = b.user_id
        GROUP BY u.id
        ORDER BY u.carbon_credits DESC
        LIMIT 100
      `,
      )
      .all() as Array<{
      id: number;
      username: string;
      full_name: string | null;
      carbon_credits: number;
      total_emissions: number | null;
      submissions: number;
    }>;

    const formattedLeaderboard = leaderboard.map((user, index) => ({
      rank: index + 1,
      id: user.id,
      username: user.username,
      fullName: user.full_name,
      creditsEarned: user.carbon_credits,
      emissionReduction: Math.round(user.total_emissions || 0),
      submissions: user.submissions,
    }));

    return res.status(200).json({
      success: true,
      leaderboard: formattedLeaderboard,
    });
  } catch (error) {
    console.error("Get leaderboard error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
