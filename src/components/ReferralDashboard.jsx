// components/ReferralDashboard.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../hooks/useSupabase";
import { useAnonymousSession } from "../hooks/useAnonymousSession";

const ReferralDashboard = () => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const anonymousId = useAnonymousSession();

  useEffect(() => {
    fetchReferrals();
  }, [anonymousId]);

  const fetchReferrals = async () => {
    if (!anonymousId) return;

    try {
      const { data, error } = await supabase
        .from("facilities")
        .select("respondent_name, respondent_email, points, created_at")
        .eq("referred_by", anonymousId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReferrals(data || []);
    } catch (error) {
      console.error("Error fetching referrals:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateReferralLink = () => {
    if (!anonymousId) return "";
    const baseUrl = window.location.origin;
    return `${baseUrl}/survey?ref=${anonymousId}`;
  };

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(generateReferralLink());
      alert("Referral link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Referrals</h2>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Your Referral Link</h3>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={generateReferralLink()}
            readOnly
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
          />
          <button
            onClick={copyReferralLink}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Copy
          </button>
        </div>
        <p className="text-sm text-blue-600 mt-2">
          Share this link to earn 25 points for each completed survey!
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-gray-700 mb-3">
          Your Referrals ({referrals.length})
        </h3>
        {referrals.length === 0 ? (
          <p className="text-gray-500">
            No referrals yet. Share your link to get started!
          </p>
        ) : (
          <div className="space-y-3">
            {referrals.map((referral, index) => (
              <div key={index} className="border-b border-gray-200 pb-3">
                <p className="font-medium">
                  {referral.respondent_name || "Anonymous"}
                </p>
                <p className="text-sm text-gray-600">
                  {referral.respondent_email}
                </p>
                <p className="text-sm text-green-600">+25 points awarded</p>
                <p className="text-xs text-gray-500">
                  {new Date(referral.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralDashboard;
