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
} from "lucide-react";

export default function Dashboard() {
  // Mock data
  const summaryCards = [
    {
      icon: Zap,
      title: "Total Energy Consumption",
      value: "2,450",
      unit: "kWh",
      color: "eco-blue",
      trend: "+5% from last month",
    },
    {
      icon: Wind,
      title: "Estimated Carbon Emissions",
      value: "892",
      unit: "kg CO₂",
      color: "eco-green-dark",
      trend: "-12% from last month",
    },
    {
      icon: Leaf,
      title: "Carbon Credits Earned",
      value: "2,450",
      unit: "Credits",
      color: "eco-green",
      trend: "+28% from last month",
    },
    {
      icon: Trash2,
      title: "Recycling Contributions",
      value: "125",
      unit: "kg",
      color: "eco-blue",
      trend: "+45% from last month",
    },
  ];

  const monthlyData = [
    { month: "Jan", emissions: 980, credits: 1200 },
    { month: "Feb", emissions: 920, credits: 1450 },
    { month: "Mar", emissions: 850, credits: 1680 },
    { month: "Apr", emissions: 780, credits: 1920 },
    { month: "May", emissions: 720, credits: 2150 },
    { month: "Jun", emissions: 892, credits: 2450 },
  ];

  const maxEmission = Math.max(...monthlyData.map((d) => d.emissions));
  const maxCredit = Math.max(...monthlyData.map((d) => d.credits));

  const tips = [
    {
      icon: Lightbulb,
      title: "Switch to LED Lighting",
      description: "Replace incandescent bulbs to save up to 75% on lighting energy",
      impact: "+45 credits",
    },
    {
      icon: Droplet,
      title: "Install a Smart Thermostat",
      description: "Automatically optimize your home's temperature and reduce heating costs",
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
            Monitor your environmental impact and track your carbon credit growth
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
                <p className="text-xs text-eco-green font-medium">{card.trend}</p>
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
                    -12% improvement
                  </span>
                </div>
                <div className="flex items-end gap-3 h-40">
                  {monthlyData.map((data, index) => (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center gap-2 group"
                    >
                      <div className="w-full rounded-t-lg bg-eco-green-light hover:bg-eco-green-dark transition-all"
                        style={{
                          height: `${(data.emissions / maxEmission) * 150}px`,
                        }}
                      ></div>
                      <span className="text-xs font-medium text-gray-600">
                        {data.month}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Credits Chart */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900">
                    Credits Earned
                  </h3>
                  <span className="text-sm text-eco-blue font-semibold">
                    +104% growth
                  </span>
                </div>
                <div className="flex items-end gap-3 h-40">
                  {monthlyData.map((data, index) => (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center gap-2 group"
                    >
                      <div className="w-full rounded-t-lg bg-eco-blue hover:bg-eco-blue-dark transition-all"
                        style={{
                          height: `${(data.credits / maxCredit) * 150}px`,
                        }}
                      ></div>
                      <span className="text-xs font-medium text-gray-600">
                        {data.month}
                      </span>
                    </div>
                  ))}
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
              <p className="text-5xl font-bold">2,450</p>
            </div>

            <div className="space-y-4">
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-sm text-white/80">This Month Earned</p>
                <p className="text-2xl font-bold">+450</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-sm text-white/80">Lifetime Total</p>
                <p className="text-2xl font-bold">8,920</p>
              </div>
              <button className="w-full mt-6 bg-white text-eco-green hover:bg-gray-100 rounded-lg py-2 font-semibold transition-colors">
                Redeem Credits
              </button>
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

        {/* Leaderboard Preview */}
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Leaderboard Preview
            </h2>
            <a
              href="/leaderboard"
              className="text-eco-green hover:text-eco-green-dark font-semibold"
            >
              View Full →
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">
                    Rank
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">
                    Username
                  </th>
                  <th className="text-right py-4 px-4 font-semibold text-gray-700">
                    Credits Earned
                  </th>
                  <th className="text-right py-4 px-4 font-semibold text-gray-700">
                    Emission Reduction
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    rank: 1,
                    name: "GreenGuru",
                    credits: 8920,
                    reduction: 2450,
                  },
                  {
                    rank: 2,
                    name: "EcoWarrior",
                    credits: 7650,
                    reduction: 2120,
                  },
                  {
                    rank: 3,
                    name: "SustainableJoe",
                    credits: 6890,
                    reduction: 1980,
                  },
                  {
                    rank: 4,
                    name: "You",
                    credits: 2450,
                    reduction: 892,
                  },
                  {
                    rank: 5,
                    name: "ClimateChampion",
                    credits: 1890,
                    reduction: 680,
                  },
                ].map((row) => (
                  <tr
                    key={row.rank}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      row.name === "You" ? "bg-eco-green-light" : ""
                    }`}
                  >
                    <td className="py-4 px-4 font-semibold text-gray-900">
                      #{row.rank}
                    </td>
                    <td className="py-4 px-4 text-gray-700">{row.name}</td>
                    <td className="py-4 px-4 text-right font-semibold text-eco-green">
                      {row.credits.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-right text-gray-700">
                      {row.reduction} kg CO₂
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
