// pages/ReferralDashboardPage.jsx
import React from "react";
import ReferralDashboard from "../components/ReferralDashboard";

const ReferralDashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-blue-900 to-cyan-600">
            <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
              Your Referral Dashboard
            </h1>
          </div>
          <div className="p-6">
            <ReferralDashboard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralDashboardPage;
