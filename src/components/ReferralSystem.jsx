// components/ReferralSystem.jsx
import React, { useState } from "react";
import { useAnonymousSession } from "../hooks/useAnonymousSession";

const ReferralSystem = ({ onReferralSuccess }) => {
  const [referralCode, setReferralCode] = useState("");
  const [showReferralSection, setShowReferralSection] = useState(false);
  const [copied, setCopied] = useState(false);
  const anonymousId = useAnonymousSession();

  const handleReferralSubmit = (e) => {
    e.preventDefault();
    if (referralCode.trim()) {
      localStorage.setItem("referred_by", referralCode.trim());
      setShowReferralSection(false);
      if (onReferralSuccess) {
        onReferralSuccess(referralCode.trim());
      }
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
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      // Fallback for browsers that don't support clipboard API
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

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-blue-800 mb-2">
        🔗 Referral Program
      </h3>

      {!showReferralSection ? (
        <div className="space-y-3">
          <p className="text-blue-700">
            <strong>Earn 25 extra points</strong> for each person you refer who
            completes the survey!
          </p>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => setShowReferralSection(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Have a referral code?
            </button>

            <button
              type="button"
              onClick={copyReferralLink}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-1"
            >
              {copied ? "✓ Copied!" : "Copy My Referral Link"}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleReferralSubmit} className="space-y-3">
          <label className="block text-sm font-medium text-blue-700">
            Enter referral code:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              placeholder="Enter code here"
              className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={() => setShowReferralSection(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ReferralSystem;
