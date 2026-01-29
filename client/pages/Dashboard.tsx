import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import {
  BarChart3,
  Leaf,
  Zap,
  Trash2,
  TrendingUp,
  Lightbulb,
  Droplet,
  Wind,
  Loader,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface DashboardData {
  user: {
    id: number;
    username: string;
    email: string;
    full_name: string | null;
    carbon_credits: number;
  };
  stats: {
    totalConsumption: number;
    totalEmissions: number;
    totalCredits: number;
    recyclingContributions: number;
  };
  monthlyData: Array<{
    month: string;
    emissions: number;
    credits: number;
  }>;
  recentUploads: Array<{
    id: number;
    energy_type: string;
    units_consumed: number;
    date: string;
  }>;
}

export default function Dashboard() {
  const { user, token } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      loadDashboard();
    }
  }, [token]);

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/billing/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = (await response.json()) as {
          success: boolean;
          data: DashboardData;
        };
        if (data.success) {
          setDashboardData(data.data);
        }
      }
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const summaryCards = dashboardData
    ? [
        {
          icon: Zap,
          title: "Total Energy Consumption",
          value: dashboardData.stats.totalConsumption.toFixed(1),
          unit: "kWh",
          color: "eco-blue" as const,
          trend: "units tracked",
        },
        {
          icon: Wind,
          title: "Estimated Carbon Emissions",
          value: dashboardData.stats.totalEmissions.toFixed(0),
          unit: "kg CO₂",
          color: "eco-green-dark" as const,
          trend: "total emissions",
        },
        {
          icon: Leaf,
          title: "Carbon Credits Earned",
          value: dashboardData.stats.totalCredits.toString(),
          unit: "Credits",
          color: "eco-green" as const,
          trend: "earned",
        },
        {
          icon: Trash2,
          title: "Recycling Contributions",
          value: dashboardData.stats.recyclingContributions.toString(),
          unit: "kg",
          color: "eco-blue" as const,
          trend: "tracked",
        },
      ]
    : [];

  const tips = [
    {
      icon: Lightbulb,
      title: "Switch to LED Lighting",
      description:
        "Replace incandescent bulbs to save up to 75% on lighting energy",
      impact: "+45 credits",
    },
    {
      icon: Droplet,
      title: "Install a Smart Thermostat",
      description:
        "Automatically optimize your home's temperature and reduce heating costs",
      impact: "+120 credits",
    },
    {
      icon: Zap,
      title: "Use Renewable Energy",
      description: "Switch to solar or wind energy for your home electricity",
      impact: "+300 credits",
    },
    {
      icon: Leaf,
      title: "Reduce Water Usage",
      description: "Fix leaks and install low-flow fixtures to conserve water",
      impact: "+60 credits",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-eco-green" />
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-600">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  const maxEmission =
    dashboardData.monthlyData.length > 0
      ? Math.max(...dashboardData.monthlyData.map((d) => d.emissions))
      : 100;
  const maxCredit =
    dashboardData.monthlyData.length > 0
      ? Math.max(...dashboardData.monthlyData.map((d) => d.credits))
      : 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header */}
      <section className="bg-gradient-to-r from-eco-green to-eco-blue py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">
            Your Sustainability Dashboard
          </h1>
          <p className="text-white/90">
            Monitor your environmental impact and track your carbon credit
            growth
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {summaryCards.map((card, index) => {
            const Icon = card.icon;
            const colorClass =
              card.color === "eco-green"
                ? "bg-eco-green-light"
                : card.color === "eco-green-dark"
                  ? "bg-green-100"
                  : "bg-eco-blue-light";
            const textColor =
              card.color === "eco-green"
                ? "text-eco-green"
                : card.color === "eco-green-dark"
                  ? "text-eco-green-dark"
                  : "text-eco-blue";

            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`${colorClass} rounded-lg p-3 w-fit mb-4`}>
                  <Icon className={`w-6 h-6 ${textColor}`} />
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-2">
                  {card.title}
                </h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-3xl font-bold text-gray-900">
                    {card.value}
                  </span>
                  <span className="text-gray-600 text-sm">{card.unit}</span>
                </div>
                <p className="text-xs text-eco-green font-medium">
                  {card.trend}
                </p>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {/* Monthly Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Monthly Progress
              </h2>
              <BarChart3 className="w-6 h-6 text-eco-green" />
            </div>

            <div className="space-y-8">
              {/* Emissions Chart */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900">
                    Carbon Emissions Trend
                  </h3>
                  <span className="text-sm text-eco-green-dark font-semibold">
                    {dashboardData.monthlyData.length > 0
                      ? "Tracking your progress"
                      : "No data yet"}
                  </span>
                </div>
                <div className="flex items-end gap-3 h-40">
                  {dashboardData.monthlyData.length > 0 ? (
                    dashboardData.monthlyData.map((data, index) => (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center gap-2 group"
                      >
                        <div
                          className="w-full rounded-t-lg bg-eco-green-light hover:bg-eco-green-dark transition-all"
                          style={{
                            height: `${maxEmission > 0 ? (data.emissions / maxEmission) * 150 : 0}px`,
                          }}
                        ></div>
                        <span className="text-xs font-medium text-gray-600">
                          {data.month}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="w-full flex items-center justify-center h-40 text-gray-500">
                      No data yet. Start uploading billing data!
                    </div>
                  )}
                </div>
              </div>

              {/* Credits Chart */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900">
                    Credits Earned
                  </h3>
                  <span className="text-sm text-eco-blue font-semibold">
                    {dashboardData.monthlyData.length > 0
                      ? "Your earnings"
                      : "No credits yet"}
                  </span>
                </div>
                <div className="flex items-end gap-3 h-40">
                  {dashboardData.monthlyData.length > 0 ? (
                    dashboardData.monthlyData.map((data, index) => (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center gap-2 group"
                      >
                        <div
                          className="w-full rounded-t-lg bg-eco-blue hover:bg-eco-blue-dark transition-all"
                          style={{
                            height: `${maxCredit > 0 ? (data.credits / maxCredit) * 150 : 0}px`,
                          }}
                        ></div>
                        <span className="text-xs font-medium text-gray-600">
                          {data.month}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="w-full flex items-center justify-center h-40 text-gray-500">
                      No data yet. Start uploading billing data!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Carbon Credit Wallet */}
          <div className="bg-gradient-to-br from-eco-green to-eco-green-dark rounded-xl p-8 shadow-sm text-white">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold">Credits Wallet</h3>
              <Leaf className="w-8 h-8 opacity-75" />
            </div>

            <div className="bg-white/20 backdrop-blur rounded-lg p-6 mb-6">
              <p className="text-white/80 text-sm mb-2">Available Credits</p>
              <p className="text-5xl font-bold">
                {dashboardData.stats.totalCredits}
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-sm text-white/80">Total Emissions Tracked</p>
                <p className="text-2xl font-bold">
                  {dashboardData.stats.totalEmissions.toFixed(0)} kg
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-sm text-white/80">All Time Total</p>
                <p className="text-2xl font-bold">
                  {dashboardData.stats.totalCredits}
                </p>
              </div>
              <a
                href="/billing"
                className="w-full mt-6 block text-center bg-white text-eco-green hover:bg-gray-100 rounded-lg py-2 font-semibold transition-colors"
              >
                Upload More Data
              </a>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="w-6 h-6 text-eco-green" />
            <h2 className="text-2xl font-bold text-gray-900">
              Ways to Earn More Credits
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tips.map((tip, index) => {
              const Icon = tip.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border-l-4 border-eco-green"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-eco-green-light rounded-lg p-3">
                      <Icon className="w-5 h-5 text-eco-green-dark" />
                    </div>
                    <span className="text-sm font-bold text-eco-green">
                      {tip.impact}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {tip.title}
                  </h3>
                  <p className="text-sm text-gray-600">{tip.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Uploads Preview */}
        {dashboardData.recentUploads.length > 0 && (
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Recent Uploads
              </h2>
              <a
                href="/billing"
                className="text-eco-green hover:text-eco-green-dark font-semibold"
              >
                View All →
              </a>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">
                      Energy Type
                    </th>
                    <th className="text-right py-4 px-4 font-semibold text-gray-700">
                      Units
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentUploads.map((upload) => (
                    <tr key={upload.id} className="border-b border-gray-100">
                      <td className="py-4 px-4">
                        {new Date(upload.date).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">{upload.energy_type}</td>
                      <td className="py-4 px-4 text-right font-semibold">
                        {upload.units_consumed}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
