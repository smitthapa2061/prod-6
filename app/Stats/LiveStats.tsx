"use client";
import React, { useState, useEffect } from "react";
import Dead from "../Stats/assets/deaed_logo.png";
import { motion } from "framer-motion";
import Image from "next/image"; // Import Image from next/image
import { data } from "framer-motion/client";

interface SetupData {
  TOR_NAME: string;
  TOR_LOGO: string;
  ROUND: string;
  DAY: string;
  MATCHES: string;
  PRIMARY_COLOR: string;
  SECONDARY_COLOR: string;
  TEXT_COLOR_1: string;
  TEXT_COLOR_2: string;
  OPA: string;
}

// Define types for match data
interface Team {
  team_name: string;
  team_logo: string;
  Alive: number;
  team_kills: number;
  overall_points?: number;
  exclude?: boolean; // <-- ADD THIS
}

interface GoogleSheetData {
  values: [string, string][];
}

const apiKey = "AIzaSyD5aSldQht9Aa4Snmf_aYo2jSg2A8bxhws";
const spreadsheetId = "1f1eVMjmhmmgBPxnLI8FGkvhusLzl55jPb4_B8vjjgpo";

const LiveStats: React.FC = () => {
  const [matchData, setMatchData] = useState<Team[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [setupData, setSetupData] = useState<SetupData | null>(null);

  const [primaryColor, setPrimaryColor] = useState<string>("#b31616");

  const url =
    "https://script.google.com/macros/s/AKfycbwkdYFWoAOXZ0zCbdYRH1wjVrTZxhhKjfj5jjGegL-JCLrKBXy7NhMSp7k3vteKp5HhDw/exec";

  const sheetApiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/setup!A2:B12?key=${apiKey}`;

  useEffect(() => {
    const fetchSetupData = async () => {
      try {
        const response = await fetch(sheetApiUrl);
        const data: GoogleSheetData = await response.json();

        const formattedData: Record<string, string> = {};
        data.values.forEach(([key, value]) => {
          const cleanKey = key.trim().toUpperCase().replace(/\s+/g, "_"); // Format like "TEXT COLOR 1 " -> "TEXT_COLOR_1"
          formattedData[cleanKey] = value;
        });

        const structured: SetupData = {
          TOR_NAME: formattedData["TOR_NAME"] || "",
          TOR_LOGO: formattedData["TOR_LOGO"] || "",
          ROUND: formattedData["ROUND"] || "",
          DAY: formattedData["DAY"] || "",
          MATCHES: formattedData["MATCHES"] || "",
          PRIMARY_COLOR: formattedData["PRIMARY_COLOR"] || "#b31616",
          SECONDARY_COLOR: formattedData["SECONDARY_COLOR"] || "#000",
          TEXT_COLOR_1: formattedData["TEXT_COLOR_1"] || "#fff",
          TEXT_COLOR_2: formattedData["TEXT_COLOR_2"] || "#fff",
          OPA: formattedData["OPACITY"] || "#fff",
        };

        setSetupData(structured);
        setPrimaryColor(structured.PRIMARY_COLOR); // Use it in your component
      } catch (err) {
        console.error("Error fetching setup data:", err);
      }
    };

    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch data from the server");
        }
        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else {
          const uniqueData = data.match_info
            .filter((team: { player_rank: string }) => !team.player_rank)
            .reduce((acc: Team[], team: Team) => {
              if (!acc.some((item) => item.team_name === team.team_name)) {
                acc.push(team);
              }
              return acc;
            }, []);

          uniqueData.sort((a: Team, b: Team) => b.team_kills - a.team_kills);
          setMatchData(uniqueData);
          console.log("Fetched and filtered data:", uniqueData);
        }
        setLoading(false);
      } catch (err) {
        setError("Error fetching data.");
        setLoading(false);
        console.error("Error fetching data:", err);
      }
    };

    fetchSetupData();
    fetchData();
    const intervalId = setInterval(fetchData, 7500);
    return () => clearInterval(intervalId);
  }, [sheetApiUrl]); // Added `sheetApiUrl` as a dependency

  const validTeams = matchData.filter(
    (team) =>
      typeof team.team_name === "string" &&
      team.team_name.trim() !== "" &&
      !team.exclude
  );

  const sortedData = validTeams.sort((a: Team, b: Team) => {
    // First, sort by overall_points if available
    if (a.overall_points !== undefined && b.overall_points !== undefined) {
      if (a.overall_points > b.overall_points) return -1; // Sort descending by overall_points
      if (a.overall_points < b.overall_points) return 1;
    }

    // Sorting by Alive status:
    // - Alive teams come first
    // - Dead teams (Alive === 0) come below
    // - Missed teams (Alive === -1) come below dead teams

    if (a.Alive === -1 && b.Alive !== -1) return 1; // Missed team goes below
    if (a.Alive !== -1 && b.Alive === -1) return -1; // Alive team stays on top
    if (a.Alive === 0 && b.Alive !== 0) return 1; // Dead team goes below
    if (a.Alive !== 0 && b.Alive === 0) return -1; // Alive team stays on top

    return 0; // If both have same Alive status, no change in their relative order
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  if (sortedData.length === 0) {
    return <p>No match data available.</p>;
  }

  return (
    <div className="">
      <motion.div
        initial={{ opacity: 0, x: 1920 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="relative left-[1559px] top-[20px]">
          <div
            className="bg-[#b31616] w-[370px] relative left-[59px]  h-[36px] flex justify-around text-white text-[16px] items-center font-[montserrat] font-bold"
            style={{
              backgroundColor: primaryColor,
              clipPath:
                "polygon(5% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 30%, 0% 60%)",
            }}
          >
            <div className="relative left-[39px]">TEAM</div>
            <div className="relative left-[70px]">ALIVE</div>
            <div className="relative left-[45px]">KILLS</div>
            <div className="relative left-[12px]">TOTAL</div>
          </div>

          <div>
            {sortedData.map((team, index) => (
              <div
                style={{
                  opacity: setupData?.OPA,
                  borderColor: setupData?.PRIMARY_COLOR,
                  clipPath:
                    "polygon(0% 0%, 100% 0%, 100% 100%, 4% 100%, 0% 80%, 0% 90%)",
                }}
                key={index}
                className="bg-[#393939] w-[430px] h-[50px] flex font-bebas-neue font-[300] border-b-2 "
              >
                <div
                  style={{
                    opacity: team.Alive === 0 || team.Alive === -1 ? 0.5 : 1,
                    backgroundColor: setupData?.PRIMARY_COLOR,
                    clipPath:
                      "polygon(5% 0%, 100% 0%, 100% 100%, 0% 100%, 30% 30%, 0% 60%)",
                  }}
                  className={`text-white text-[35px] flex text-center justify-center items-center w-[60px] mt-[px]  `}
                >
                  {index + 1}
                </div>

                <div
                  className={`${
                    team.Alive === 0 ? "bg-[#ffffff00]" : "bg-[#fafafa00]"
                  } w-[170px] h-[50px] absolute left-[60px] flex justify-left text-black border-solid `}
                >
                  <div
                    style={{
                      backgroundColor: setupData?.SECONDARY_COLOR,
                      opacity: team.Alive === 0 || team.Alive === -1 ? 0.5 : 1,
                    }}
                    className="w-[50px] h-[50px] absolute z-10 border-r-[2px] border-black"
                  >
                    <Image
                      src={
                        team.team_logo ||
                        "https://res.cloudinary.com/dqckienxj/image/upload/v1727161652/default_nuloh2.png"
                      }
                      alt="Team Logo"
                      width={50}
                      height={50}
                    />
                  </div>
                  <div className="bg-white w-[120px] h-[80px] absolute left-[50px] top-[0px]"></div>
                  <div
                    className="text-[35px] w-[200px] h-[500px]  absolute left-[54px]"
                    style={{
                      opacity: team.Alive === 0 || team.Alive === -1 ? 0.5 : 1,
                    }}
                  >
                    {team.team_name}
                  </div>
                </div>

                <div className="absolute left-[240px] flex gap-[4px] mt-[7px] skew-y-6">
                  {team.Alive === -1 ? (
                    <div
                      style={{ opacity: team.Alive === -1 ? 0.5 : 1 }}
                      className="text-white text-[20px] font-bold"
                    >
                      MISS
                    </div>
                  ) : team.Alive === 0 ? (
                    <div className="w-[50px] h-[50px] absolute top-[-5px] opacity-[70%]">
                      <Image
                        src={Dead.src as string}
                        alt="Dead Icon"
                        width={50}
                        height={50}
                      />
                    </div>
                  ) : (
                    Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={index}
                        className="w-[10px] h-[35px]"
                        style={{
                          backgroundColor:
                            index < team.Alive
                              ? `${setupData?.SECONDARY_COLOR}`
                              : "#FF0000",
                        }}
                      ></div>
                    ))
                  )}
                </div>

                <div
                  className="absolute left-[300px] text-white text-[35px] mt-[1px] flex items-center justify-center w-[50px] h-[50px]"
                  style={{
                    opacity: team.Alive === 0 || team.Alive === -1 ? 0.5 : 1, // Apply opacity for both dead and miss
                  }}
                >
                  {team.team_kills}
                </div>
                <div
                  className="absolute left-[364px] text-white text-[35px] mt-[1px] flex items-center justify-center w-[50px] h-[50px]"
                  style={{
                    opacity: team.Alive === 0 || team.Alive === -1 ? 0.5 : 1, // Apply opacity for both dead and miss
                  }}
                >
                  {team.overall_points}
                </div>
              </div>
            ))}
            <div
              style={{
                opacity: setupData?.OPA,
                borderColor: setupData?.PRIMARY_COLOR,
                clipPath:
                  "polygon(0% 0%, 100% 0%, 100% 100%, 4% 100%, 0% 80%, 0% 90%)",
              }}
              className="w-[370px] h-[40px] bg-[#1a1a1a] absolute left-[60px] text-white  text-[16px] font-[montserrat] font-bold "
            >
              <div className="text-[18px] absolute left-[70px] mt-[3px] flex">
                ALIVE{" "}
                <div
                  style={{ backgroundColor: setupData?.SECONDARY_COLOR }}
                  className="bg-green-500 w-[20px] h-[20px] ml-[10px] mt-[5px]"
                ></div>
                <div className="flex ml-[70px]">
                  DEAD{" "}
                  <div
                    style={{ backgroundColor: "#FF0000" }}
                    className="bg-green-500 w-[20px] h-[20px] ml-[10px] mt-[5px]"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LiveStats;
