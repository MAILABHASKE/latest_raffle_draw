// pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

// Import your actual logo - adjust the path based on where you store it
import CameraNasLogo from "../assets/camera-nas-logo.png";

const Home = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 z-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      {/* Hero section with centered logo */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 py-12">
        {/* CAMERA NAS Logo - Centered at the top */}
        <div className="mb-8 flex flex-col items-center">
          <a 
            href="https://www.cameramriafrica.org/nas" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center group mb-6"
          >
            <div className="w-40 h-40 bg-white rounded-lg p-3 shadow-lg group-hover:scale-105 transition-transform duration-300 flex items-center justify-center mb-3">
              <img 
                src={CameraNasLogo} 
                alt="CAMERA NAS Logo" 
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <span className="text-blue-100 text-sm font-medium group-hover:text-cyan-300 transition-colors duration-300">
              Learn More
            </span>
          </a>
          
          <div className="relative">
            <div className="absolute -inset-4 bg-blue-500 rounded-full filter blur-xl opacity-30 animate-ping"></div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white relative">
              MEDICAL IMAGING{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 block mt-2 md:mt-4">
                RAFFLE
              </span>
            </h1>
          </div>
        </div>

        {/* BIG BOLD $500 PRIZE SECTION */}
        <div className="relative mb-8 group w-full max-w-2xl">
          <div className="absolute -inset-4 sm:-inset-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-3xl filter blur-2xl opacity-70 group-hover:opacity-90 transition-all duration-1000 animate-pulse"></div>
          <div className="relative bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 p-6 sm:p-8 rounded-2xl shadow-2xl transform group-hover:scale-105 transition-all duration-500">
            <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white drop-shadow-2xl">
              $500
            </div>
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mt-2 sm:mt-4 uppercase tracking-wider">
              CASH PRIZE
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-yellow-300 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-2 -left-2 w-5 h-5 sm:w-6 sm:h-6 bg-pink-300 rounded-full animate-bounce delay-300"></div>
          </div>
        </div>

        <div className="max-w-4xl mb-8">
          <p className="text-lg sm:text-xl md:text-2xl text-blue-100 mb-6 font-light">
            Take part in the{" "}
            <span className="font-semibold text-yellow-300">
              CAMERA Need Assessment Survey (NAS) 
            </span>
             for a chance to win{" "}
            <span className="font-bold text-yellow-300 mx-1">$500</span>. Your
            participation will contribute to building a comprehensive GIS
            database of medical imaging equipment across Nigeria.
          </p>

          <p className="text-base sm:text-lg md:text-xl text-blue-100 font-light">
            The Needs Assessment Survey (NAS) was designed to identify MRI needs unique to Africa based on a pilot field survey of seven MRI facilities in Nigeria in 2020 and the RAD-AID Radiology-Readiness Survey TM . The survey, along with a series of symposia at international MRI society meetings informed a framework for addressing MRI needs in Africa and a model for advancing imaging capacity in resource-limited settings.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-6">
          <Link
            to="/survey"
            className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-cyan-500 to-blue-900 text-white rounded-full font-semibold text-base sm:text-lg shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-105"
          >
            Join the Raffle
          </Link>
          <Link
            to="/map"
            className="px-6 py-3 sm:px-8 sm:py-4 bg-transparent border-2 border-blue-400 text-blue-100 rounded-full font-semibold text-base sm:text-lg hover:bg-blue-800/30 transition-all duration-300"
          >
            View GIS Map
          </Link>
        </div>
      </div>

      {/* Referral Banner Section */}
      <div className="relative z-10 bg-gradient-to-r from-purple-600 to-indigo-700 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Refer & Earn Extra Points!
            </h2>
            <p className="text-xl text-blue-100 mb-6 max-w-3xl">
              Share your unique referral link and earn{" "}
              <span className="font-bold text-yellow-300">25 bonus points</span>{" "}
              for each person who completes the survey through your link!
            </p>
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="flex items-center text-white">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-2">
                  <span className="text-sm font-bold">+25</span>
                </div>
                <span>Per Referral</span>
              </div>
              <div className="flex items-center text-white">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                  <span className="text-sm font-bold">∞</span>
                </div>
                <span>Unlimited Referrals</span>
              </div>
            </div>
            <Link
              to="/referral-dashboard"
              className="px-8 py-3 bg-white text-purple-700 rounded-full font-bold text-lg shadow-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105"
            >
              Get Your Referral Link
            </Link>
          </div>
        </div>
      </div>

      {/* Info section */}
      <div className="relative z-10 bg-white py-16 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-12 sm:mb-16">
            How It Works
          </h2>

          <div className="grid md:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center p-6 sm:p-8 rounded-xl bg-gradient-to-b from-white to-blue-50 shadow-lg border border-blue-100">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-900 text-2xl sm:text-3xl font-bold mx-auto mb-5">
                1
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">
                Complete the Survey
              </h3>
              <p className="text-gray-700 text-base sm:text-lg">
                Provide information about your medical imaging facility and
                equipment.
              </p>
            </div>

            <div className="text-center p-6 sm:p-8 rounded-xl bg-gradient-to-b from-white to-blue-50 shadow-lg border border-blue-100">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-900 text-2xl sm:text-3xl font-bold mx-auto mb-5">
                2
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">
                Earn Raffle Tickets
              </h3>
              <p className="text-gray-700 text-base sm:text-lg">
                Gain more entries based on the completeness of your information.
              </p>
            </div>

            <div className="text-center p-6 sm:p-8 rounded-xl bg-gradient-to-b from-white to-blue-50 shadow-lg border border-blue-100">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-900 text-2xl sm:text-3xl font-bold mx-auto mb-5">
                3
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">
                Refer Friends
              </h3>
              <p className="text-gray-700 text-base sm:text-lg">
                Share your referral link and earn 25 bonus points for each
                completed survey.
              </p>
            </div>

            <div className="text-center p-6 sm:p-8 rounded-xl bg-gradient-to-b from-white to-blue-50 shadow-lg border border-blue-100">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-900 text-2xl sm:text-3xl font-bold mx-auto mb-5">
                4
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">
                Win Prizes
              </h3>
              <p className="text-gray-700 text-base sm:text-lg">
                Selected participants will receive{" "}
                <span className="font-bold text-orange-600">$500</span> for
                their contribution.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
              Ready to Participate?
            </h3>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/survey"
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-105"
              >
                Start Survey Now
              </Link>
              <Link
                to="/referrals"
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
              >
                Get Referral Link
              </Link>
            </div>
            
            {/* CAMERA NAS Link at bottom */}
            <div className="mt-10 pt-6 border-t border-gray-200">
              <p className="text-gray-600 mb-4">A project by</p>
              <a 
                href="https://www.cameramriafrica.org/nas" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-300"
              >
                <img 
                  src={CameraNasLogo} 
                  alt="CAMERA NAS" 
                  className="h-6 object-contain"
                />
                <span className="font-semibold">CAMERA NAS</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
