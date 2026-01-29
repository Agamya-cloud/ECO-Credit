import Navigation from "@/components/Navigation";
import { Leaf, Award, Trash2 } from "lucide-react";

export default function Recycling() {
  const wasteTypes = [
    { type: "Plastic", icon: Trash2, credits: 50, unit: "kg" },
    { type: "Paper", icon: Leaf, credits: 75, unit: "kg" },
    { type: "Glass", icon: Award, credits: 60, unit: "kg" },
    { type: "Metal", icon: Trash2, credits: 85, unit: "kg" },
    { type: "E-Waste", icon: Leaf, credits: 200, unit: "kg" },
    { type: "Organic", icon: Award, credits: 40, unit: "kg" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <section className="bg-gradient-to-r from-eco-blue to-eco-green py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">
            Recycling Submissions
          </h1>
          <p className="text-white/90">
            Log your recycling activities and earn carbon credits
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Submit Recycling Activity
              </h2>

              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Waste Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {wasteTypes.map((waste) => (
                      <button
                        key={waste.type}
                        type="button"
                        className="p-4 border-2 border-gray-200 rounded-lg hover:border-eco-green hover:bg-eco-green-light transition-all text-center group"
                      >
                        <Trash2 className="w-6 h-6 text-gray-600 mx-auto mb-2 group-hover:text-eco-green transition-colors" />
                        <p className="font-semibold text-gray-900 text-sm">
                          {waste.type}
                        </p>
                        <p className="text-xs text-eco-green mt-1">
                          +{waste.credits} credits
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Quantity (kg)
                  </label>
                  <input
                    type="number"
                    placeholder="Enter quantity"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-green"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-green"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    placeholder="Add any additional details about your recycling activity"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-green"
                  ></textarea>
                </div>

                <button className="w-full bg-eco-green text-white font-semibold py-2 rounded-lg hover:bg-eco-green-dark transition-colors">
                  Submit Recycling
                </button>
              </form>
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            <div className="bg-eco-green rounded-xl p-6 text-white">
              <Leaf className="w-8 h-8 mb-4" />
              <h3 className="font-semibold mb-2">Credits Earned This Month</h3>
              <p className="text-4xl font-bold">625</p>
              <p className="text-white/80 text-sm mt-2">From 8 submissions</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Credit Rates by Type
              </h3>
              <div className="space-y-3">
                {wasteTypes.map((waste) => (
                  <div
                    key={waste.type}
                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <span className="text-gray-700">{waste.type}</span>
                    <span className="font-semibold text-eco-green">
                      +{waste.credits} / {waste.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-eco-blue-light rounded-xl p-6">
              <Award className="w-8 h-8 text-eco-blue-dark mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Achievements</h3>
              <p className="text-sm text-gray-700 mb-3">
                You've earned the "Recycling Champion" badge!
              </p>
              <div className="flex gap-2">
                <div className="w-10 h-10 rounded-full bg-eco-green text-white flex items-center justify-center font-bold text-xs">
                  RC
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Your Recent Submissions
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">
                    Type
                  </th>
                  <th className="text-right py-4 px-4 font-semibold text-gray-700">
                    Quantity
                  </th>
                  <th className="text-right py-4 px-4 font-semibold text-gray-700">
                    Credits Earned
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    date: "2024-06-15",
                    type: "Plastic",
                    qty: "12 kg",
                    credits: 600,
                    status: "Verified",
                  },
                  {
                    date: "2024-06-10",
                    type: "E-Waste",
                    qty: "2 kg",
                    credits: 400,
                    status: "Verified",
                  },
                  {
                    date: "2024-06-05",
                    type: "Paper",
                    qty: "8 kg",
                    credits: 600,
                    status: "Verified",
                  },
                  {
                    date: "2024-05-28",
                    type: "Glass",
                    qty: "15 kg",
                    credits: 900,
                    status: "Pending",
                  },
                ].map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4 text-gray-700">{row.date}</td>
                    <td className="py-4 px-4 font-medium text-gray-900">
                      {row.type}
                    </td>
                    <td className="py-4 px-4 text-right text-gray-700">
                      {row.qty}
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-eco-green">
                      +{row.credits}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          row.status === "Verified"
                            ? "bg-eco-green-light text-eco-green-dark"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {row.status}
                      </span>
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
