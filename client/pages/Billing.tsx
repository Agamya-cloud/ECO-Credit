import Navigation from "@/components/Navigation";
import { Upload, FileText, AlertCircle } from "lucide-react";

export default function Billing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <section className="bg-gradient-to-r from-eco-green to-eco-blue py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">
            Upload Billing Data
          </h1>
          <p className="text-white/90">
            Submit your electricity and fuel billing records to calculate your carbon footprint
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Form Column */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Upload Your Billing Data
              </h2>

              {/* Upload Area */}
              <div className="mb-8 border-2 border-dashed border-eco-green-light rounded-lg p-8 text-center hover:bg-eco-green-light/30 transition-colors cursor-pointer group">
                <Upload className="w-12 h-12 text-eco-green mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Drop your file here or click to browse
                </h3>
                <p className="text-gray-600 text-sm">
                  Supported formats: CSV, XLSX, PDF (Max 10MB)
                </p>
              </div>

              {/* Manual Entry Form */}
              <div className="space-y-6">
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
                    Energy Type
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-green">
                    <option>Select energy type</option>
                    <option>Electricity (kWh)</option>
                    <option>Natural Gas (therms)</option>
                    <option>Fuel Oil (gallons)</option>
                    <option>Gasoline (gallons)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Units Consumed
                  </label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eco-green"
                  />
                </div>

                <button className="w-full bg-eco-green text-white font-semibold py-2 rounded-lg hover:bg-eco-green-dark transition-colors">
                  Submit Data
                </button>
              </div>
            </div>
          </div>

          {/* Info Column */}
          <div className="space-y-6">
            <div className="bg-eco-green-light rounded-xl p-6">
              <FileText className="w-8 h-8 text-eco-green-dark mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">File Format</h3>
              <p className="text-sm text-gray-700">
                Your billing data should include date, energy type, and consumption units.
              </p>
            </div>

            <div className="bg-eco-blue-light rounded-xl p-6">
              <AlertCircle className="w-8 h-8 text-eco-blue-dark mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">How It Works</h3>
              <p className="text-sm text-gray-700">
                Our algorithm converts your consumption data into estimated carbon emissions.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-eco-green">
              <h3 className="font-semibold text-gray-900 mb-3">
                Recent Uploads
              </h3>
              <div className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium text-gray-900">June 2024</p>
                  <p className="text-gray-600">450 kWh - 5 days ago</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">May 2024</p>
                  <p className="text-gray-600">520 kWh - 35 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
