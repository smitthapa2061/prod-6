"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image"; // Import Image from next/image

// Define types for player data and response from the API
interface Player {
  player_name: string;
  player_photo: string;
  team_logo: string;
  player_kills: number;
}

interface MatchResponse {
  match_info: Player[];
  error?: string;
}

interface SetupData {
  values: [string, string][];
}

const Dom: React.FC = () => {
  const [playerMilestone, setPlayerMilestone] = useState<Player | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [primaryColor, setPrimaryColor] = useState<string>("#b31616"); // Default primary color
  const [fontStyle, setFontStyle] = useState<string>("font-bebas-neue"); // Default font style

  const previousPlayerKills = useRef<{ [key: string]: number }>({}); // Track player kills by name
  const timeoutId = useRef<NodeJS.Timeout | null>(null); // Track the timeout for clearing the milestone

  const url =
    "https://script.google.com/macros/s/AKfycbwYvL5mfJg-XCSAptLqPZF805aOKjf5U2vRihZIpFLsT3WmZq6onYIhD4rToftUX68xyw/exec";

  // New setupUrl with updated API key and spreadsheet ID
  const setupUrl =
    "https://sheets.googleapis.com/v4/spreadsheets/1f1eVMjmhmmgBPxnLI8FGkvhusLzl55jPb4_B8vjjgpo/values/setup!A2:B10?key=AIzaSyD5aSldQht9Aa4Snmf_aYo2jSg2A8bxhws"; // Updated API key and spreadsheet ID

  useEffect(() => {
    // Fetch Setup Data for primary color and font style
    const fetchSetupData = async () => {
      try {
        const response = await axios.get<SetupData>(setupUrl);
        const setupValues = response.data.values;

        // Fetch primary color
        const primaryColorRow = setupValues.find(
          (row) => row[0] === "PRIMARY COLOR"
        );
        if (primaryColorRow) {
          setPrimaryColor(primaryColorRow[1]); // Set primary color from setup data
        }

        // Fetch font style
        const fontStyleRow = setupValues.find((row) => row[0] === "FONT STYLE");
        if (fontStyleRow) {
          setFontStyle(fontStyleRow[1]); // Set font style from setup data
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
            const matchInfo = response.data.match_info || [];

            matchInfo.forEach((player) => {
              const prevKills = previousPlayerKills.current[player.player_name];

              // Only update if player kills are greater than the previous recorded kills
              if (
                player.player_kills >= 3 &&
                player.player_kills > (prevKills || 0)
              ) {
                setPlayerMilestone(player);

                // Store the updated kills for this player to track it
                previousPlayerKills.current[player.player_name] =
                  player.player_kills;

                // Clear the previous timeout if it exists
                if (timeoutId.current) {
                  clearTimeout(timeoutId.current);
                }

                // Set a new timeout to clear the milestone after 5 seconds
                timeoutId.current = setTimeout(() => {
                  setPlayerMilestone(null);
                }, 5000);
              }
            });
          }
          setLoading(false);
        })
        .catch(() => {
          setError("Error fetching data.");
          setLoading(false);
        });
    };

    fetchData(); // Fetch initial data
    const intervalId = setInterval(fetchData, 15000); // Fetch data every 15 seconds
    return () => {
      clearInterval(intervalId); // Clean up the interval on component unmount
      if (timeoutId.current) {
        clearTimeout(timeoutId.current); // Clean up the timeout on component unmount
      }
    };
  }, [url]);

  // Function to get the milestone label based on player kills
  const getMilestoneLabel = (kills: number): string | null => {
    if (kills >= 5) {
      return "RAMPAGE";
    } else if (kills >= 3) {
      return "DOMINATION";
    }
    return null;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="relative left-[-10px]">
      <motion.div
        initial={{ x: -100 }} // Start from the left (x: -100)
        animate={{ x: 10 }} // Slide to the final position (x: 0)
        exit={{ x: 100 }} // Slide to the right (x: 100) when exiting
        transition={{ duration: 0.4 }} // Control the duration of the transition
      >
        <div className="w-[1920px] h-[1080px] flex">
          {playerMilestone && (
            <div className={`relative top-[-70px] ${fontStyle}`}>
              <div
                className="bg-red-800 w-[90px] h-[90px] absolute mt-[320px] ml-[250px] z-10"
                style={{ backgroundColor: primaryColor }}
              >
                <Image
                  src={
                    playerMilestone.team_logo ||
                    "https://res.cloudinary.com/dqckienxj/image/upload/v1730785916/default_ryi6uf_edmapm.png"
                  }
                  alt="Team Logo"
                  layout="fill" // Automatically adjusts the image size
                  objectFit="contain" // Ensures the image fits within its container
                />
              </div>
              <div className="w-[300px] h-[350px] bg-[#000000b5] mt-[360px] absolute z-0">
                <div className="w-[370px] h-[340px] absolute right-[-30px] mt-[10px]">
                  <Image
                    src={
                      playerMilestone.player_photo ||
                      "https://res.cloudinary.com/dqckienxj/image/upload/v1735762279/defult_chach_apsjhc_dwnd7n.png"
                    }
                    alt="Player"
                    layout="fill" // Automatically adjusts the image size
                    objectFit="contain" // Ensures the image fits within its container
                  />
                </div>
              </div>
              <div
                className="w-[300px] h-[100px] bg-red-800 absolute mt-[700px] flex justify-center"
                style={{ backgroundColor: primaryColor }}
              >
                <div className="text-[85px] absolute top-[-10px] text-white">
                  {playerMilestone.player_name}
                </div>
              </div>
              <div className="bg-white w-[300px] h-[60px] absolute mt-[800px]">
                {playerMilestone.player_kills >= 3 && (
                  <div className="text-black absolute ml-[50px] text-[55px] top-[-7px]">
                    {getMilestoneLabel(playerMilestone.player_kills)}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Dom;
