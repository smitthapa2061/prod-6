import React, { useState, useEffect } from "react";

import { motion } from "framer-motion";
import axios from "axios";

// Types 💫
interface Player {
  team_name: string;
  player_name: string;
  player_photo?: string;
  player_kills: number;
  contribution: number;
  total_points: number;
  chicken: number;
  team_logo?: string;
}

interface SetupRow {
  ColumnB: string;
}

interface MatchResponse {
  match_info: Player[];
  error?: string;
}

const WwcdTeamStats: React.FC = () => {
  const [matchData, setMatchData] = useState<Player[]>([]);
  const [setupData, setSetupData] = useState<SetupRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [primaryColor, setPrimaryColor] = useState<string | undefined>(); // Optional

  const apiKey: string = "AIzaSyD5aSldQht9Aa4Snmf_aYo2jSg2A8bxhws"; // Your Google Sheets API key
  const spreadsheetId: string = "1f1eVMjmhmmgBPxnLI8FGkvhusLzl55jPb4_B8vjjgpo"; // Your Google Sheets ID

  const urlMatchData =
    "https://script.google.com/macros/s/AKfycbwYvL5mfJg-XCSAptLqPZF805aOKjf5U2vRihZIpFLsT3WmZq6onYIhD4rToftUX68xyw/exec";

  const urlSetupData = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/setup!A2:B10?key=${apiKey}`;

  useEffect(() => {
    // Fetch match data
    axios
      .get<MatchResponse>(urlMatchData)
      .then((response) => {
        const data = response.data;
        if (data.error) {
          setError(data.error);
        } else {
          setMatchData(data.match_info);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Error fetching data.");
        setLoading(false);
      });

    // Fetch setup data
    axios
      .get<{ values: [string, string][] }>(urlSetupData)
      .then((response) => {
        const setupValues = response.data.values;
        if (setupValues) {
          const formattedSetupData: SetupRow[] = setupValues.map((row) => ({
            ColumnB: row[1] || "",
          }));
          setSetupData(formattedSetupData);
          setPrimaryColor(setupValues[5]?.[1] || "#850505");
        }
      })
      .catch(() => {
        setError("Error fetching setup data.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (matchData.length === 0) return <p>No match data available.</p>;

  // Find winner
  const chickenWinner = matchData.find((team) => team.chicken === 1);
  const winningTeam = chickenWinner
    ? chickenWinner
    : matchData.reduce((prev, current) =>
        prev.total_points > current.total_points ? prev : current
      );

  const winningPlayers = matchData
    .filter((player) => player.team_name === winningTeam.team_name)
    .slice(0, 4);

  return (
    <div className="font-bebas-neue font-[500]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 8 }}
        transition={{ duration: 1 }}
      >
        <div className="w-[1980px] h-[1080px] text-white relative">
          <div className="text-[280px] absolute top-[230px] ml-[30px]">
            WWCD
          </div>
          <div className="text-[140px] absolute top-[490px] ml-[50px]">
            TEAM STATS
          </div>
          <div
            className="w-[600px] h-[88px] absolute top-[870px] ml-[30px] left-[970px] scale-150 text-center"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="font-teko font-[300] text-[79px] ml-[10px] mt-[-13px]">
              {setupData[2]?.ColumnB} | MATCH - {setupData[4]?.ColumnB}
            </div>
          </div>
          <div className="w-[250px] h-[250px] ml-[20px] absolute top-[700px]">
            <img
              src={winningTeam.team_logo}
              alt={winningTeam.team_name}
              className="w-full h-full"
            />
          </div>
          <div className="ml-[270px] absolute top-[690px] text-[200px]">
            {winningTeam.team_name}
          </div>

          {/* Players */}
          <motion.div
            initial={{ opacity: 1, y: -100 }}
            animate={{ opacity: 7, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="absolute left-[610px] top-[0px] flex gap-4">
              {winningPlayers.map((player, index) => (
                <div
                  key={index}
                  style={{ backgroundColor: primaryColor }}
                  className="w-[323px] h-[700px] text-white text-[30px] font-bold shadow-lg"
                >
                  <div className="w-[500px] h-[500px] relative top-[200px] left-[-50px]">
                    <img
                      src={
                        player.player_photo ||
                        "https://res.cloudinary.com/dqckienxj/image/upload/v1737809848/Layer_6_cnd9gl_ugaxek.png"
                      }
                      alt={player.player_name}
                      className="w-[100%] h-[100%]"
                      style={{
                        clipPath:
                          "polygon(10% 10%, 64% 0, 100% 100%,80% -15%,74% 100%, 10% 100%)",
                      }}
                    />
                  </div>
                  <div className="w-[324px] h-[500px] absolute bg-gradient-to-t from-black via-transparent to-[#ffffff00] top-[200px]"></div>
                  <div
                    className="relative top-[200px] w-[323px] h-[80px] text-center font-teko font-[300]"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <div className="text-[80px] top-[-18px] relative">
                      {player.player_name}
                    </div>
                  </div>
                  {/* Kills */}
                  <div className="relative left-[20px] text-white">
                    <div className="flex flex-col">
                      <div
                        className="mt-[-100px] text-[90px] relative top-[-40px]"
                        style={{ color: primaryColor }}
                      >
                        {player.player_kills}
                      </div>
                      <span className="font-teko font-[300] relative top-[-80px] left-[3px]">
                        Kills
                      </span>
                    </div>
                  </div>
                  {/* Contribution */}
                  <div className="relative left-[20px] text-white flex flex-col">
                    <div
                      className="mt-[-100px] text-[90px] relative top-[-10px]"
                      style={{ color: primaryColor }}
                    >
                      {player.contribution}%
                    </div>
                    <span className="font-teko font-[300] relative top-[-50px] left-[3px]">
                      CONTRIBUTION
                    </span>
                  </div>
                  <div className="w-[323px] h-[770px] bg-[#000000dc] text-white text-[30px] font-bold shadow-lg mt-[-750px]"></div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default WwcdTeamStats;
