// components/ReferralDashboard.jsx (updated)
import React, { useState, useEffect } from "react";
import { supabase } from "../hooks/useSupabase";
import { useAnonymousSession } from "../hooks/useAnonymousSession";

const ReferralDashboard = () => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const anonymousId = useAnonymousSession();

  useEffect(() => {
    if (anonymousId) {
      fetchReferrals();
    } else {
      setLoading(false);
    }
  }, [anonymousId]);

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("facilities")
        .select("respondent_name, respondent_email, points, created_at")
        .eq("referred_by", anonymousId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReferrals(data || []);
    } catch (error) {
      console.error("Error fetching referrals:", error);
      setError("Failed to load referrals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateReferralLink = () => {
    if (!anonymousId) return "Please complete the survey first";
    const baseUrl = window.location.origin;
    return `${baseUrl}/survey?ref=${anonymousId}`;
  };

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(generateReferralLink());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = generateReferralLink();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!anonymousId) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">
          Please complete the survey first to access your referral dashboard.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading referrals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchReferrals}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

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
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 min-w-[80px]"
          >
            {copied ? "Copied!" : "Copy"}
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
          <div className="space-y-4">
            {referrals.map((referral, index) => (
              <div
                key={index}
                className="border-b border-gray-200 pb-4 last:border-b-0"
              >
                <p className="font-medium">
                  {referral.respondent_name || "Anonymous User"}
                </p>
                {referral.respondent_email && (
                  <p className="text-sm text-gray-600">
                    {referral.respondent_email}
                  </p>
                )}
                <p className="text-sm text-green-600 font-medium">
                  +25 points awarded to you
                </p>
                <p className="text-xs text-gray-500">
                  Joined: {new Date(referral.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 p-4 bg-green-50 rounded-lg">
        <h4 className="font-semibold text-green-800 mb-2">
          Total Points Earned
        </h4>
        <p className="text-2xl font-bold text-green-700">
          {referrals.length * 25} points
        </p>
        <p className="text-sm text-green-600">
          From {referrals.length} successful referral
          {referrals.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
};

export default ReferralDashboard;
