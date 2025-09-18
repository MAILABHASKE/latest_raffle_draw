// ===== FILE: hooks/useSupabase.js =====
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Complete state → coordinates map for all Nigerian states
const stateCoordinates = {
  // Existing states
  Lagos: { lat: 6.5244, lng: 3.3792 },
  Abuja: { lat: 9.0765, lng: 7.3986 },
  Kano: { lat: 12.0022, lng: 8.5919 },
  
  // All Nigerian states
  Abia: { lat: 5.4527, lng: 7.5248 },
  Adamawa: { lat: 9.3265, lng: 12.3984 },
  AkwaIbom: { lat: 4.9057, lng: 7.8537 },
  Anambra: { lat: 6.2209, lng: 7.0722 },
  Bauchi: { lat: 10.3103, lng: 9.8439 },
  Bayelsa: { lat: 4.9267, lng: 6.2676 },
  Benue: { lat: 7.3369, lng: 8.7404 },
  Borno: { lat: 11.8333, lng: 13.1500 },
  CrossRiver: { lat: 5.8702, lng: 8.5988 },
  Delta: { lat: 5.7040, lng: 5.9339 },
  Ebonyi: { lat: 6.2649, lng: 8.0137 },
  Edo: { lat: 6.6342, lng: 5.9304 },
  Ekiti: { lat: 7.6730, lng: 5.2500 },
  Enugu: { lat: 6.4584, lng: 7.5464 },
  Gombe: { lat: 10.2897, lng: 11.1673 },
  Imo: { lat: 5.4836, lng: 7.0333 },
  Jigawa: { lat: 12.5700, lng: 9.7800 },
  Kaduna: { lat: 10.5167, lng: 7.4333 },
  Katsina: { lat: 12.9908, lng: 7.6000 },
  Kebbi: { lat: 12.4500, lng: 4.1999 },
  Kogi: { lat: 7.8000, lng: 6.7333 },
  Kwara: { lat: 8.5000, lng: 4.5500 },
  Nasarawa: { lat: 8.5000, lng: 8.2500 },
  Niger: { lat: 9.6000, lng: 6.5500 },
  Ogun: { lat: 7.0000, lng: 3.3500 },
  Ondo: { lat: 7.2500, lng: 5.2000 },
  Osun: { lat: 7.7500, lng: 4.5667 },
  Oyo: { lat: 7.8500, lng: 3.9333 },
  Plateau: { lat: 9.9333, lng: 8.8833 },
  Rivers: { lat: 4.7500, lng: 7.0000 },
  Sokoto: { lat: 13.0667, lng: 5.2333 },
  Taraba: { lat: 8.8833, lng: 11.3667 },
  Yobe: { lat: 12.0000, lng: 11.5000 },
  Zamfara: { lat: 12.1667, lng: 6.2500 },
  
  // Common alternative spellings or abbreviations
  FCT: { lat: 9.0765, lng: 7.3986 }, // Federal Capital Territory (same as Abuja)
  "Akwa Ibom": { lat: 4.9057, lng: 7.8537 },
  "Cross River": { lat: 5.8702, lng: 8.5988 },
};

// Custom hook for facility data
export const useFacilities = (approvedOnly = false) => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFacilities();

    // Real-time subscription for changes
    const channel = supabase
      .channel("facilities-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "facilities",
        },
        (payload) => {
          if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
            setFacilities((current) => {
              const existing = current.find((f) => f.id === payload.new.id);
              if (existing) {
                return current.map((f) =>
                  f.id === payload.new.id
                    ? { ...payload.new, machines: f.machines }
                    : f
                );
              } else {
                return [...current, { ...payload.new, machines: [] }];
              }
            });
          } else if (payload.eventType === "DELETE") {
            setFacilities((current) =>
              current.filter((f) => f.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [approvedOnly]);

  const fetchFacilities = async () => {
    try {
      let query = supabase.from("facilities").select(`
        *,
        machines (*)
      `);

      if (approvedOnly) {
        query = query.eq("approved", true);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Add default coordinates if missing
      const facilitiesWithCoords = (data || []).map((facility) => {
        if (!facility.latitude || !facility.longitude) {
          const stateCoord = stateCoordinates[facility.state];
          if (stateCoord) {
            return {
              ...facility,
              latitude: stateCoord.lat,
              longitude: stateCoord.lng,
            };
          }
        }
        return facility;
      });

      setFacilities(facilitiesWithCoords);
    } catch (error) {
      console.error("Error fetching facilities:", error);
    } finally {
      setLoading(false);
    }
  };

  return { facilities, loading, refetch: fetchFacilities };
};

// Custom hook for authentication
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    if (error) throw error;
    return data;
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return { user, loading, signUp, signIn, signOut };
};
