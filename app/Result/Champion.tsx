import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";

// Define types for the fetched data
interface TeamData {
  teamTag: string;
  teamLogo: string;
  totalkills: number;
  rankpoint: number;
  totalpoints: number;
  player_photo: string;
}

const apiKey: string = "AIzaSyD5aSldQht9Aa4Snmf_aYo2jSg2A8bxhws";
const spreadsheetId: string = "1f1eVMjmhmmgBPxnLI8FGkvhusLzl55jPb4_B8vjjgpo";

const range = "overall1!A2:O100"; // Range for overall data
const range2 = "setup!A2:B10"; // Range for setup data (primary color)

const fadeInAnimation = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const SecondRunner: React.FC = () => {
  const [top1, setTop1] = useState<TeamData | null>(null);
  const [formattedData, setFormattedData] = useState<TeamData[]>([]);
  const [primaryColor, setPrimaryColor] = useState<string>("#FF0000");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
        const response = await axios.get<{ values: string[][] }>(url);
        const values = response.data.values || [];

        const data: TeamData[] = values.map((row: string[]) => ({
          teamTag: row[0] || "",
          teamLogo: row[1] || "https://default-image-url.com",
          totalkills: row[3] ? parseInt(row[3], 10) : 0,
          rankpoint: row[4] ? parseInt(row[4], 10) : 0,
          totalpoints: row[2] ? parseInt(row[2], 10) : 0,
          player_photo:
            row[8] ||
            "https://res.cloudinary.com/dqckienxj/image/upload/v1735762279/defult_chach_apsjhc_dwnd7n.png",
        }));

        const uniqueTeams = data.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.teamTag === value.teamTag)
        );

        setFormattedData(data);

        const url2 = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range2}?key=${apiKey}`;
        const response2 = await axios.get<{ values: string[][] }>(url2);
        const values2 = response2.data.values || [];

        const primaryColorValue = values2.find(
          (row) => row[0] === "PRIMARY COLOR"
        );
        if (primaryColorValue) {
          setPrimaryColor(primaryColorValue[1] || "#FF0000");
        }

        const sortedData = uniqueTeams.sort((a, b) => {
          if (b.totalpoints !== a.totalpoints) {
            return b.totalpoints - a.totalpoints;
          } else if (b.rankpoint !== a.rankpoint) {
            return b.rankpoint - a.rankpoint;
          } else {
            return b.totalkills - a.totalkills;
          }
        });

        // Select the 3rd ranked team (2nd Runner-Up)
        setTop1(sortedData[0]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      }
    };

    fetchData();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!top1) return <div>Loading...</div>;

  return (
    <>
      {top1 && (
        <motion.div
          variants={fadeInAnimation}
          initial="hidden"
          animate="visible"
          className="Group6 h-[1080px] w-[1920px]"
          style={{ position: "relative" }}
        >
          <div className="h-[1080px] flex w-[1920px] items-start top-[120px] relative">
            {formattedData
              .filter((p: TeamData) => p.teamTag === top1.teamTag)
              .slice(0, 4)
              .map((player: TeamData, index: number) => (
                <motion.img
                  key={index}
                  initial={{ x: -800 }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.5 + index * 0.2 }}
                  className="w-[800px] relative top-[40px] ml-[-200px] mr-[-100px]"
                  src={
                    player.player_photo ||
                    "https://res.cloudinary.com/dqckienxj/image/upload/v1735762279/defult_chach_apsjhc_dwnd7n.png"
                  }
                  alt={`Player ${index + 1}`}
                />
              ))}
          </div>

          <div className="relative bottom-[300px]">
            <div>
              <div
                style={{ backgroundColor: primaryColor }}
                className="Rectangle8 w-[1920px] h-0.5"
              ></div>
              <div className="Rectangle8 relative -top-0.5 w-[300px] h-0.5 bg-[#1c1c1c]"></div>
            </div>

            <div className="flex relative bottom-0.5">
              <div className="w-[300px] h-[300px] bg-[#1c1c1c]">
                <div
                  style={{ backgroundColor: primaryColor }}
                  className="h-14 font-tungsten text-white bg-red-500"
                >
                  <div className="flex justify-center font-[300] items-start text-6xl text-white font-teko">
                    {top1.teamTag}
                  </div>
                  <Image
                    className="relative left-3 h-[230px]"
                    src={top1.teamLogo}
                    alt="Team Logo"
                    width={230}
                    height={230}
                  />
                </div>
              </div>
              <div
                style={{ backgroundColor: primaryColor }}
                className="h-[300px] w-[1620px]"
              >
                <div>
                  <div className="h-[250px] w-[1620px] bg-black">
                    <motion.div
                      initial={{ opacity: 0, y: -40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="flex justify-center font-bebas-neue items-start relative bottom-[55px] text-[256px] text-white"
                    >
                      CHAMPIONS
                    </motion.div>
                  </div>
                  <div className="flex w-[1620px] justify-evenly items-center">
                    <motion.div
                      initial={{ opacity: 0, x: -40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="flex font-[300] items-start text-6xl text-white font-teko"
                    >
                      RANK-1
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="flex justify-center font-[300] items-start text-6xl text-white font-teko"
                    >
                      KILLS-{top1.totalkills}
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      className="flex justify-center font-[300] items-start text-6xl text-white font-teko"
                    >
                      PLACE-{top1.rankpoint}
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                      className="flex justify-center font-[300] items-start text-6xl text-white font-teko"
                    >
                      TOTAL-{top1.totalpoints}
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default SecondRunner;
