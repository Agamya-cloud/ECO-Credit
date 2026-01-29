import Navigation from "@/components/Navigation";
import { Trophy, Medal, Star } from "lucide-react";
import { useState } from "react";

export default function Leaderboard() {
  const [timeframe, setTimeframe] = useState("overall");

  const leaderboardData = [
    {
      rank: 1,
      name: "GreenGuru",
      credits: 12450,
      reduction: 3450,
      badge: "gold",
    },
    {
      rank: 2,
      name: "EcoWarrior",
      credits: 10230,
      reduction: 2890,
      badge: "silver",
    },
    {
      rank: 3,
      name: "SustainableJoe",
      credits: 8920,
      reduction: 2450,
      badge: "bronze",
    },
    {
      rank: 4,
      name: "GreenLeaf",
      credits: 7650,
      reduction: 2120,
      badge: null,
    },
    {
      rank: 5,
      name: "ClimateChampion",
      credits: 6890,
      reduction: 1980,
      badge: null,
    },
    {
      rank: 6,
      name: "EcoEnthusiast",
      credits: 5430,
      reduction: 1680,
      badge: null,
    },
    {
      rank: 7,
      name: "You",
      credits: 2450,
      reduction: 892,
      badge: null,
      isUser: true,
    },
    {
      rank: 8,
      name: "NewSprout",
      credits: 1890,
      reduction: 680,
      badge: null,
    },
    {
      rank: 9,
      name: "GreenMind",
      credits: 1450,
      reduction: 520,
      badge: null,
    },
    {
      rank: 10,
      name: "StartingGreen",
      credits: 890,
      reduction: 320,
      badge: null,
    },
  ];

  const getBadgeIcon = (badge: string | null) => {
    switch (badge) {
      case "gold":
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case "silver":
        return <Medal className="w-6 h-6 text-gray-400" />;
      case "bronze":
        return <Medal className="w-6 h-6 text-orange-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <section className="bg-gradient-to-r from-eco-blue to-eco-green py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Leaderboard</h1>
          <p className="text-white/90">
            See who's making the biggest impact on sustainability
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter and Stats */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex gap-4">
            <button
              onClick={() => setTimeframe("monthly")}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                timeframe === "monthly"
                  ? "bg-eco-green text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setTimeframe("overall")}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                timeframe === "overall"
                  ? "bg-eco-green text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              All Time
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-gray-600 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-eco-green">1,234</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-gray-600 text-sm">Total Credits</p>
              <p className="text-2xl font-bold text-eco-blue">5.2M</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-gray-600 text-sm">CO₂ Reduced</p>
              <p className="text-2xl font-bold text-eco-green-dark">125K kg</p>
            </div>
          </div>
        </div>

        {/* Top 3 Featured */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {leaderboardData.slice(0, 3).map((user) => (
            <div
              key={user.rank}
              className={`rounded-xl p-8 text-center relative overflow-hidden ${
                user.rank === 1
                  ? "bg-gradient-to-br from-yellow-400 to-yellow-500 text-white"
                  : user.rank === 2
                    ? "bg-gradient-to-br from-gray-300 to-gray-400 text-white"
                    : "bg-gradient-to-br from-orange-400 to-orange-500 text-white"
              }`}
            >
              <div className="absolute top-4 right-4">
                {getBadgeIcon(user.badge)}
              </div>
              <div className="mb-4">
                <p className="text-5xl font-bold">#{user.rank}</p>
              </div>
              <h3 className="text-2xl font-bold mb-4">{user.name}</h3>
              <div className="space-y-2 text-white/90">
                <p className="text-3xl font-bold">
                  {user.credits.toLocaleString()} Credits
                </p>
                <p>{user.reduction} kg CO₂ Reduced</p>
              </div>
            </div>
          ))}
        </div>

        {/* Full Leaderboard */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 w-20">
                    Rank
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">
                    Username
                  </th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">
                    Credits
                  </th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700">
                    CO₂ Reduction
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 w-20">
                    Badge
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((user) => (
                  <tr
                    key={user.rank}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      user.isUser ? "bg-eco-green-light" : ""
                    }`}
                  >
                    <td className="py-4 px-6">
                      <span
                        className={`text-lg font-bold ${
                          user.isUser ? "text-eco-green-dark" : "text-gray-900"
                        }`}
                      >
                        #{user.rank}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-eco-green/20 flex items-center justify-center">
                          <span className="text-eco-green font-semibold text-sm">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                        <span
                          className={`font-medium ${
                            user.isUser
                              ? "text-eco-green-dark"
                              : "text-gray-900"
                          }`}
                        >
                          {user.name}
                          {user.isUser && (
                            <span className="text-xs text-eco-green-dark ml-2">
                              (You)
                            </span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="text-lg font-bold text-eco-green">
                        {user.credits.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right text-gray-700">
                      {user.reduction.toLocaleString()} kg
                    </td>
                    <td className="py-4 px-6">
                      {user.badge ? (
                        <div className="flex justify-center">
                          {getBadgeIcon(user.badge)}
                        </div>
                      ) : user.rank <= 10 ? (
                        <Star className="w-5 h-5 text-gray-300" />
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="bg-eco-green rounded-xl p-8 text-white">
            <Trophy className="w-8 h-8 mb-4" />
            <h3 className="text-2xl font-bold mb-3">How Rankings Work</h3>
            <p className="text-white/90">
              Users are ranked based on their total carbon credits earned from
              energy conservation, recycling activities, and sustainability
              achievements. More credits = higher ranking!
            </p>
          </div>

          <div className="bg-eco-blue rounded-xl p-8 text-white">
            <Star className="w-8 h-8 mb-4" />
            <h3 className="text-2xl font-bold mb-3">Earn More Credits</h3>
            <p className="text-white/90">
              Climb the leaderboard by tracking your energy usage, recycling
              more, and completing sustainability challenges. Each action brings
              you closer to the top!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
