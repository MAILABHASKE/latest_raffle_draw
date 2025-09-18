// pages/Map.jsx
import React, { useState, useEffect, useRef } from "react";
import { useFacilities } from "../hooks/useSupabase";

const Map = () => {
  const { facilities, loading } = useFacilities(true);
  const [selectedState, setSelectedState] = useState("All");
  const [selectedMachine, setSelectedMachine] = useState("All");
  const [filteredFacilities, setFilteredFacilities] = useState([]);
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    let filtered = facilities;

    if (selectedState !== "All") {
      filtered = filtered.filter((f) => f.state === selectedState);
    }

    if (selectedMachine !== "All") {
      filtered = filtered.filter((f) =>
        f.machines.some(
          (m) => m.machine_type === selectedMachine && m.status === "working"
        )
      );
    }

    setFilteredFacilities(filtered);
  }, [facilities, selectedState, selectedMachine]);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    // Load Leaflet dynamically
    const loadLeaflet = async () => {
      // Add Leaflet CSS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Load Leaflet JS
      if (!window.L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = initializeMap;
        document.head.appendChild(script);
      } else {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (!window.L || leafletMapRef.current) return;

      // Initialize map centered on Nigeria
      const map = window.L.map(mapRef.current, {
        center: [9.0765, 7.3986], // Nigeria center coordinates
        zoom: 6,
        scrollWheelZoom: true,
      });

      // Add OpenStreetMap tiles
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      leafletMapRef.current = map;
    };

    loadLeaflet();

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Update map markers when filtered facilities change
  useEffect(() => {
    if (!leafletMapRef.current || !window.L) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      leafletMapRef.current.removeLayer(marker);
    });
    markersRef.current = [];

    // Add markers for filtered facilities
    filteredFacilities.forEach(facility => {
      // Get coordinates (you'll need to add lat/lng to your database or use a geocoding service)
      // For now, I'll use approximate coordinates for Nigerian states
      const coordinates = getStateCoordinates(facility.state);
      
      if (coordinates) {
        // Count machines by type
        const machineCount = facility.machines?.length || 0;
        const workingMachines = facility.machines?.filter(m => m.status === 'working').length || 0;
        const mriMachines = facility.machines?.filter(m => m.machine_type === 'mri').length || 0;
        
        // Create custom icon based on machine availability
        const iconColor = workingMachines > 0 ? 'green' : 'red';
        const iconHtml = `
          <div style="
            background-color: ${iconColor};
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 2px solid white;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 10px;
            font-weight: bold;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          ">
            ${machineCount}
          </div>
        `;

        const customIcon = window.L.divIcon({
          html: iconHtml,
          className: 'custom-marker',
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        // Create marker
        const marker = window.L.marker(coordinates, { icon: customIcon });

        // Create popup content
        const popupContent = `
          <div style="min-width: 200px; font-family: sans-serif;">
            <h3 style="margin: 0 0 8px 0; color: #1e40af; font-size: 16px;">
              ${facility.name}
            </h3>
            <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px;">
              ${facility.address}, ${facility.state}
            </p>
            <div style="margin-bottom: 8px;">
              <strong style="color: #374151; font-size: 14px;">Equipment:</strong>
              <div style="margin-top: 4px;">
                ${facility.machines?.map(machine => `
                  <span style="
                    display: inline-block;
                    background-color: ${machine.status === 'working' ? '#dcfce7' : machine.status === 'occasionally_down' ? '#fef3c7' : '#fee2e2'};
                    color: ${machine.status === 'working' ? '#166534' : machine.status === 'occasionally_down' ? '#92400e' : '#991b1b'};
                    padding: 2px 6px;
                    border-radius: 12px;
                    font-size: 12px;
                    margin: 2px;
                  ">
                    ${machine.machine_type.toUpperCase()}
                  </span>
                `).join('') || 'No machines listed'}
              </div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #6b7280; font-size: 12px;">
                ${workingMachines} working machines
              </span>
              <span style="color: #1e40af; font-size: 12px; font-weight: 600;">
                ${facility.points} points
              </span>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.addTo(leafletMapRef.current);
        markersRef.current.push(marker);
      }
    });

    // Fit map to show all markers if there are any
    if (markersRef.current.length > 0) {
      const group = new window.L.featureGroup(markersRef.current);
      leafletMapRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [filteredFacilities]);

  // Function to get approximate coordinates for Nigerian states
  const getStateCoordinates = (state) => {
    const stateCoords = {
      'Abia': [5.4527, 7.5248],
      'Adamawa': [9.3265, 12.3984],
      'Akwa Ibom': [5.0077, 7.8536],
      'Anambra': [6.2209, 6.9995],
      'Bauchi': [10.3158, 9.8442],
      'Bayelsa': [4.6684, 6.2671],
      'Benue': [7.1906, 8.7378],
      'Borno': [11.8846, 13.1571],
      'Cross River': [5.9735, 8.3256],
      'Delta': [5.8962, 5.6809],
      'Ebonyi': [6.2649, 8.0137],
      'Edo': [6.3350, 5.6037],
      'Ekiti': [7.7193, 5.3111],
      'Enugu': [6.5244, 7.5112],
      'FCT – Abuja': [9.0765, 7.3986],
      'Gombe': [10.2959, 11.1689],
      'Imo': [5.5720, 7.0588],
      'Jigawa': [12.2343, 9.5938],
      'Kaduna': [10.5105, 7.4165],
      'Kano': [12.0022, 8.5920],
      'Katsina': [12.9908, 7.6018],
      'Kebbi': [12.4539, 4.1975],
      'Kogi': [7.8006, 6.7401],
      'Kwara': [8.9670, 4.5993],
      'Lagos': [6.5244, 3.3792],
      'Nasarawa': [8.5378, 8.3206],
      'Niger': [10.3759, 5.4328],
      'Ogun': [7.1605, 3.3469],
      'Ondo': [7.2527, 5.2058],
      'Osun': [7.5629, 4.5200],
      'Oyo': [8.0000, 4.0000],
      'Plateau': [9.2182, 9.5179],
      'Rivers': [4.8156, 6.9778],
      'Sokoto': [13.0609, 5.2476],
      'Taraba': [8.8921, 11.3604],
      'Yobe': [11.7466, 11.9609],
      'Zamfara': [12.1703, 6.2284]
    };
    return stateCoords[state] || null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading map data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Medical Imaging Facilities in Nigeria
        </h1>
        <p className="text-center text-gray-900 mb-8">
          Interactive map of medical imaging equipment across Nigeria
        </p>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by State
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="All">All States</option>
                {[
                  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa",
                  "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo",
                  "Ekiti", "Enugu", "FCT – Abuja", "Gombe", "Imo", "Jigawa",
                  "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
                  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau",
                  "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
                ].map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Machine
              </label>
              <select
                value={selectedMachine}
                onChange={(e) => setSelectedMachine(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="All">All Machines</option>
                <option value="mri">MRI</option>
                <option value="ct">CT Scanner</option>
                <option value="ultrasound">Ultrasound</option>
                <option value="xray">X-Ray</option>
              </select>
            </div>

            <div className="flex items-end">
              <span className="text-sm text-gray-900">
                Showing {filteredFacilities.length} of {facilities.length} facilities
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Map */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div 
            ref={mapRef}
            className="h-96 w-full"
            style={{ minHeight: '400px' }}
          >
            {/* Map will be rendered here by Leaflet */}
          </div>
          <div className="p-4 bg-gray-50 border-t">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2 border-2 border-white shadow"></div>
                  <span>Facilities with working equipment</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-2 border-2 border-white shadow"></div>
                  <span>Facilities with non-working equipment</span>
                </div>
              </div>
              <span>Number in marker = total machines</span>
            </div>
          </div>
        </div>

        {/* Facilities List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFacilities.map((facility) => (
            <div
              key={facility.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-blue-800 mb-2">
                {facility.name}
              </h3>
              <p className="text-sm text-gray-900 mb-2">
                {facility.address}, {facility.state}
              </p>

              <div className="mt-3">
                <h4 className="text-sm font-medium text-gray-700 mb-1">
                  Equipment:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {facility.machines?.map((machine) => (
                    <span
                      key={machine.id}
                      className={`text-xs px-2 py-1 rounded-full ${
                        machine.status === "working"
                          ? "bg-green-100 text-green-800"
                          : machine.status === "occasionally_down"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {machine.machine_type.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {facility.machines?.filter((m) => m.status === "working").length}{" "}
                  working machines
                </span>
                <span className="text-xs font-medium text-blue-900">
                  {facility.points} points
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredFacilities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No facilities match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Map;
