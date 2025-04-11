"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";

interface Team {
  team_name: string;
  team_logo?: string;
  Alive: number;
  team_position: number;
  team_kills: number;
}

interface MatchResponse {
  match_info: Team[];
  error?: string;
}

interface SetupData {
  values: [string, string][];
}

const Alerts: React.FC = () => {
  const [matchAlerts, setMatchAlerts] = useState<Team[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [latestDeadTeam, setLatestDeadTeam] = useState<Team | null>(null);
  const [primaryColor, setPrimaryColor] = useState<string>("#b31616"); // Default primary color

  const prevMatchAlerts = useRef<Team[]>([]);
  const displayedDeadTeams = useRef<Set<string>>(new Set());

  const url =
    "https://script.google.com/macros/s/AKfycbwYvL5mfJg-XCSAptLqPZF805aOKjf5U2vRihZIpFLsT3WmZq6onYIhD4rToftUX68xyw/exec";

  // New setupUrl with updated API key and spreadsheet ID
  const setupUrl =
    "https://sheets.googleapis.com/v4/spreadsheets/1f1eVMjmhmmgBPxnLI8FGkvhusLzl55jPb4_B8vjjgpo/values/setup!A2:B10?key=AIzaSyD5aSldQht9Aa4Snmf_aYo2jSg2A8bxhws"; // Updated API key and spreadsheet ID

  useEffect(() => {
    const fetchSetupData = async () => {
      try {
        const response = await axios.get<SetupData>(setupUrl);
        const setupValues = response.data.values;

        const primaryColorRow = setupValues.find(
          (row) => row[0] === "PRIMARY COLOR"
        );
        if (primaryColorRow) {
          setPrimaryColor(primaryColorRow[1]);
        }
      } catch (err) {
        console.error("Error fetching setup data:", err);
      }
    };

    fetchSetupData();

    const fetchData = () => {
      axios
        .get<MatchResponse>(`${url}?t=${new Date().getTime()}`)
        .then((response) => {
          if (response.data.error) {
            setError(response.data.error);
          } else {
            const uniqueTeams: Team[] = [];
            const teamNames = new Set<string>();

            response.data.match_info.forEach((team) => {
              if (!teamNames.has(team.team_name)) {
                teamNames.add(team.team_name);
                uniqueTeams.push(team);
              }
            });

            if (
              JSON.stringify(uniqueTeams) !==
              JSON.stringify(prevMatchAlerts.current)
            ) {
              setMatchAlerts(uniqueTeams);
              prevMatchAlerts.current = uniqueTeams;

              uniqueTeams.forEach((team) => {
                if (
                  team.Alive === 0 &&
                  !displayedDeadTeams.current.has(team.team_name)
                ) {
                  setLatestDeadTeam(team);
                  displayedDeadTeams.current.add(team.team_name);

                  setTimeout(() => {
                    setLatestDeadTeam(null);
                  }, 500000);
                }

                if (team.Alive > 0) {
                  displayedDeadTeams.current.delete(team.team_name);
                }
              });
            }
          }
          setLoading(false);
        })
        .catch(() => {
          setError("Error fetching data.");
          setLoading(false);
        });
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, [url]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (matchAlerts.length === 0) return <p>No match data available.</p>;

  return (
    <>
      <div className="w-[1920px] h-[1080px] bg-green-300">
        {latestDeadTeam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="Rectangle57 flex  justify-evenly relative w-[650px] h-[230px] mx-auto  top-[200px] "
            style={{ background: primaryColor }}
          >
            <div
              style={{
                clipPath: "polygon( 0% 0%,0% 0%, 0% 100%,90% 90%, 102% 0%)",
              }}
              className="bg-white w-[300px] h-[100% ]"
            >
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                  width: 210,
                  height: 200,
                }}
                className=" border-white mt-[25px]   "
                src={
                  latestDeadTeam.team_logo ||
                  "https://res.cloudinary.com/dqckienxj/image/upload/v1727161524/default_ryi6uf.png"
                }
                alt="Team Logo"
              />
            </div>
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{ width: 270, height: 362 }}
              className=" border-white mt-[-60px] relative right-[148px] "
              src={
                "https://res.cloudinary.com/dqckienxj/image/upload/v1744299995/light_fbywgi.png"
              }
              alt="Team Logo"
            />
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.4 }}
              className="text-[6rem] font-bebas-neue h-full text-white flex items-center top-[40px] relative "
            >
              {latestDeadTeam.team_name || "TEAM NAME"}
            </motion.div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default Alerts;
