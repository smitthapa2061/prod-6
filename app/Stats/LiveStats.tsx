"use client";
import React, { useState, useEffect } from "react";
import Dead from "../Stats/assets/deaed_logo.png";
import { motion } from "framer-motion";

// Define types for match data
interface Team {
  team_name: string;
  team_logo: string;
  Alive: number;
  team_kills: number;
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
  const [primaryColor, setPrimaryColor] = useState<string>("#b31616");

  const url =
    "https://script.google.com/macros/s/AKfycbwYvL5mfJg-XCSAptLqPZF805aOKjf5U2vRihZIpFLsT3WmZq6onYIhD4rToftUX68xyw/exec";

  const sheetApiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/setup!A2:B10?key=${apiKey}`;

  useEffect(() => {
    const fetchColor = async () => {
      try {
        const response = await fetch(sheetApiUrl);
        const data: GoogleSheetData = await response.json();
        const primaryColorRow = data.values.find(
          (row) => row[0] === "PRIMARY COLOR"
        );
        if (primaryColorRow) {
          setPrimaryColor(primaryColorRow[1]);
        }
      } catch (err) {
        console.error("Error fetching primary color:", err);
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
            .filter((team: any) => !team.player_rank)
            .reduce((acc: Team[], team: any) => {
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

    fetchColor();
    fetchData();
    const intervalId = setInterval(fetchData, 6000);
    return () => clearInterval(intervalId);
  }, []);

  const validTeams = matchData.filter(
    (team) => typeof team.team_name === "string" && team.team_name.trim() !== ""
  );

  const sortedData = validTeams.sort((a: Team, b: Team) => {
    if (a.Alive === 0 && b.Alive !== 0) return 1;
    if (a.Alive !== 0 && b.Alive === 0) return -1;
    return 0;
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  if (sortedData.length === 0) {
    return <p>No match data available.</p>;
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: 1920 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="relative left-[1559px] top-[20px]">
          <div
            className="bg-[#b31616] w-[360px] h-[36px] flex justify-around text-white text-[22px] items-center font-[poppins]"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="relative left-[30px]">TEAM</div>
            <div className="relative left-[80px]">ALIVE</div>
            <div className="relative left-[23px]">KILLS</div>
          </div>

          <div>
            {sortedData.map((team, index) => (
              <div
                key={index}
                className="bg-[#01010199] w-[360px] h-[50px] flex font-bebas-neue font-[300] border-solid border-[#c1c1c1] border-b-[1px]"
              >
                <div
                  className={`text-white text-[43px] flex text-center justify-center items-center w-[60px] mt-[-5px] ${
                    team.Alive === 0 ? "opacity-50" : "opacity-100"
                  }`}
                >
                  {index + 1}
                </div>

                <div
                  className={`${
                    team.Alive === 0 ? "bg-[#ffffff87]" : "bg-[#ffffff]"
                  } w-[170px] h-[50px] absolute left-[60px] flex justify-left text-black border-solid border-[#b51f1f] border-b-[1px]`}
                  style={{ borderColor: primaryColor }}
                >
                  <div className="w-[50px] h-[50px] absolute z-10">
                    <img
                      src={
                        team.team_logo ||
                        "https://res.cloudinary.com/dqckienxj/image/upload/v1727161652/default_nuloh2.png"
                      }
                      alt=""
                    />
                  </div>
                  <div className="bg-black w-[2px] h-[46px] absolute left-[50px] top-[3px]"></div>
                  <div
                    className="text-[45px] l mt-[-6px] absolute left-[54px]"
                    style={{ opacity: team.Alive === 0 ? 0.5 : 1 }}
                  >
                    {team.team_name}
                  </div>
                </div>

                <div className="absolute left-[240px] flex gap-[3px] mt-[4px]">
                  {team.Alive === 0 ? (
                    <div className="w-[50px] h-[50px] absolute top-[-5px] opacity-[70%]">
                      <img src={Dead.src as string} alt="" />
                    </div>
                  ) : (
                    Array.from({ length: Math.min(team.Alive, 4) }).map(
                      (_, index) => (
                        <div
                          key={index}
                          className="w-[10px] h-[40px] bg-red-800"
                          style={{ backgroundColor: primaryColor }}
                        ></div>
                      )
                    )
                  )}
                </div>

                <div
                  className="absolute left-[300px] text-white text-[45px] mt-[1px] flex items-center justify-center w-[50px] h-[50px]"
                  style={{ opacity: team.Alive === 0 ? 0.5 : 1 }}
                >
                  {team.team_kills}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LiveStats;
