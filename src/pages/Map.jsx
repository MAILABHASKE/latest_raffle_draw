// pages/Map.jsx
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useFacilities } from "../hooks/useSupabase";
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Nigerian state coordinates
const stateCoordinates = {
  "Abia": { lat: 5.4307, lng: 7.5244 },
  "Adamawa": { lat: 9.3265, lng: 12.3984 },
  "Akwa Ibom": { lat: 4.9057, lng: 7.8537 },
  "Anambra": { lat: 6.2209, lng: 7.0722 },
  "Bauchi": { lat: 10.3103, lng: 9.8439 },
  "Bayelsa": { lat: 4.9267, lng: 6.2676 },
  "Benue": { lat: 7.3369, lng: 8.7404 },
  "Borno": { lat: 11.8333, lng: 13.1500 },
  "Cross River": { lat: 5.8702, lng: 8.5988 },
  "Delta": { lat: 5.7040, lng: 5.9339 },
  "Ebonyi": { lat: 6.2649, lng: 8.0137 },
  "Edo": { lat: 6.3400, lng: 5.6200 },
  "Ekiti": { lat: 7.6333, lng: 5.2167 },
  "Enugu": { lat: 6.4584, lng: 7.5464 },
  "FCT – Abuja": { lat: 9.0765, lng: 7.3986 },
  "Gombe": { lat: 10.2897, lng: 11.1713 },
  "Imo": { lat: 5.4833, lng: 7.0333 },
  "Jigawa": { lat: 12.0000, lng: 9.7500 },
  "Kaduna": { lat: 10.5231, lng: 7.4403 },
  "Kano": { lat: 12.0022, lng: 8.5920 },
  "Katsina": { lat: 12.9908, lng: 7.6000 },
  "Kebbi": { lat: 12.4500, lng: 4.2000 },
  "Kogi": { lat: 7.8000, lng: 6.7333 },
  "Kwara": { lat: 8.5000, lng: 4.5500 },
  "Lagos": { lat: 6.5244, lng: 3.3792 },
  "Nasarawa": { lat: 8.5000, lng: 8.5000 },
  "Niger": { lat: 9.6000, lng: 6.5500 },
  "Ogun": { lat: 7.1557, lng: 3.3451 },
  "Ondo": { lat: 7.2500, lng: 5.2000 },
  "Osun": { lat: 7.6167, lng: 4.5167 },
  "Oyo": { lat: 7.3833, lng: 4.0167 },
  "Plateau": { lat: 9.9167, lng: 8.9000 },
  "Rivers": { lat: 4.7500, lng: 7.0000 },
  "Sokoto": { lat: 13.0667, lng: 5.2333 },
  "Taraba": { lat: 8.8833, lng: 11.3667 },
  "Yobe": { lat: 11.7460, lng: 11.9660 },
  "Zamfara": { lat: 12.1700, lng: 6.6600 }
};

// Custom icons for different machine types
const createCustomIcon = (machineType, count) => {
  let html = '';
  let className = '';
  let size = 30 + Math.min(count, 5) * 3; // Larger icon for more machines
  
  switch(machineType) {
    case 'mri':
      html = '🧲';
      className = 'mri-marker';
      break;
    case 'ct':
      html = '📊';
      className = 'ct-marker';
      break;
    case 'xray':
      html = '📷';
      className = 'xray-marker';
      break;
    case 'ultrasound':
      html = '🔊';
      className = 'ultrasound-marker';
      break;
    default:
      html = '🏥';
      className = 'default-marker';
  }
  
  return L.divIcon({
    html: `<div class="custom-marker ${className}">${html}<span class="machine-count">${count}</span></div>`,
    className: 'custom-div-icon',
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
    popupAnchor: [0, -size/2]
  });
};

// Component to handle map view changes when filters update
function MapViewUpdater({ filteredFacilities, stateCoordinates }) {
  const map = useMap();
  
  useEffect(() => {
    if (filteredFacilities.length > 0) {
      const bounds = L.latLngBounds(
        filteredFacilities.map(f => {
          const coords = stateCoordinates[f.state] || { lat: 9.0820, lng: 8.6753 };
          return [coords.lat, coords.lng];
        })
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      // Default view of Nigeria
      map.setView([9.0820, 8.6753], 6);
    }
  }, [filteredFacilities, map, stateCoordinates]);
  
  return null;
}

const Map = () => {
  const { facilities, loading } = useFacilities(true);
  const [selectedState, setSelectedState] = useState("All");
  const [selectedMachine, setSelectedMachine] = useState("All");
  const [filteredFacilities, setFilteredFacilities] = useState([]);

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
                {Object.keys(stateCoordinates).map((state) => (
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
                Showing {filteredFacilities.length} of {facilities.length}{" "}
                facilities
              </span>
            </div>
          </div>
        </div>

        {/* Map Visualization */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="h-96 relative">
            <MapContainer
              center={[9.0820, 8.6753]} // Center of Nigeria
              zoom={6}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {filteredFacilities.map((facility) => {
                // Get coordinates for the facility's state
                const coords = stateCoordinates[facility.state] || { lat: 9.0820, lng: 8.6753 };
                
                // Count working machines
                const workingMachines = facility.machines?.filter(m => m.status === "working") || [];
                const workingMachineCount = workingMachines.length;
                
                // Determine primary machine type for icon
                let primaryMachineType = "default";
                if (workingMachines.length > 0) {
                  if (selectedMachine !== "All") {
                    primaryMachineType = selectedMachine;
                  } else {
                    // Find the machine type with the most working units
                    const machineCounts = {};
                    workingMachines.forEach(m => {
                      machineCounts[m.machine_type] = (machineCounts[m.machine_type] || 0) + 1;
                    });
                    
                    primaryMachineType = Object.keys(machineCounts).reduce((a, b) => 
                      machineCounts[a] > machineCounts[b] ? a : b
                    );
                  }
                }
                
                return (
                  <Marker
                    key={facility.id}
                    position={[coords.lat, coords.lng]}
                    icon={createCustomIcon(primaryMachineType, workingMachineCount)}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold text-blue-800">{facility.name}</h3>
                        <p className="text-sm text-gray-600">{facility.address}, {facility.state}</p>
                        
                        <div className="mt-2">
                          <h4 className="text-sm font-medium text-gray-700">Equipment:</h4>
                          <ul className="text-xs">
                            {facility.machines?.map((machine) => (
                              <li key={machine.id} className="flex justify-between">
                                <span>{machine.machine_type.toUpperCase()}:</span>
                                <span className={
                                  machine.status === "working" ? "text-green-600" :
                                  machine.status === "occasionally_down" ? "text-yellow-600" :
                                  "text-red-600"
                                }>
                                  {machine.status.replace("_", " ")}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="mt-2 text-xs text-gray-500">
                          {workingMachineCount} working machines
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
              
              <MapViewUpdater 
                filteredFacilities={filteredFacilities} 
                stateCoordinates={stateCoordinates} 
              />
            </MapContainer>
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
                  {
                    facility.machines?.filter((m) => m.status === "working")
                      .length
                  }{" "}
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
      
      <style jsx>{`
        .custom-marker {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: white;
          border: 2px solid #3b82f6;
          font-size: 16px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          position: relative;
        }
        .mri-marker { border-color: #10b981; }
        .ct-marker { border-color: #8b5cf6; }
        .xray-marker { border-color: #f59e0b; }
        .ultrasound-marker { border-color: #ec4899; }
        
        .machine-count {
          position: absolute;
          bottom: -5px;
          right: -5px;
          background: #ef4444;
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          font-size: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default Map;
