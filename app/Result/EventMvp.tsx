import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

// Define types for the fetched data
interface PlayerData {
  playerName: string;
  playerkills: number | string;
  teamTag: string | number; // Change this to string | number
  teamLogo: string;
  PlayerPhoto: string;
  kd: string;
  contribution: string;
}

interface PrimaryColorData {
  PRIMARY_COLOR: string;
}

const apiKey: string = "AIzaSyD5aSldQht9Aa4Snmf_aYo2jSg2A8bxhws";
const spreadsheetId: string = "1f1eVMjmhmmgBPxnLI8FGkvhusLzl55jPb4_B8vjjgpo";

const range = "overall1!A2:P25"; // Range for overall data
const range2 = "setup!A2:B10"; // Range for setup data (primary color)

const fadeInAnimation = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const EventFragger: React.FC = () => {
  const [data, setData] = useState<PlayerData[]>([]);
  const [top1, setTop1] = useState<PlayerData | null>(null);
  const [primaryColor, setPrimaryColor] = useState<string>("#FF0000"); // Default red color
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data from Google Sheets API
    const fetchData = async () => {
      try {
        // Fetch main team data
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
        const response = await axios.get<{ values: string[][] }>(url); // Explicitly typing the response data
        const values = response.data.values || [];

        // Process data
        const formattedData: PlayerData[] = values.map((row: string[]) => ({
          playerName: row[6] || "",
          playerkills: row[7] || "0", // Default value for kills
          teamTag: row[0] || 0,
          teamLogo: row[1] || "",
          PlayerPhoto: row[8] || "",
          kd: row[5] || "0",
          contribution: row[10] || "0",
        }));

        setData(formattedData);

        // Fetch primary color data
        const url2 = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range2}?key=${apiKey}`;
        const response2 = await axios.get<{ values: string[][] }>(url2); // Explicitly typing the response data
        const values2 = response2.data.values || [];

        // Extract primary color
        const primaryColorValue = values2.find(
          (row: string[]) => row[0] === "PRIMARY COLOR"
        );
        if (primaryColorValue) {
          setPrimaryColor(primaryColorValue[1] || "#FF0000"); // Fallback to red if no color found
        }

        // Set top 1 data
        const sortedData = formattedData.sort(
          (a, b) =>
            (typeof b.playerkills === "number" ? b.playerkills : 0) -
            (typeof a.playerkills === "number" ? a.playerkills : 0)
        );
        setTop1(sortedData[0]); // Assuming the top player is the one with the highest kills
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchData(); // Fetch the data when the component mounts
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!top1) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {top1 && (
        <motion.div
          variants={fadeInAnimation} // Using the fadeInAnimation defined above
          initial="hidden"
          animate="visible"
          className="Group6 h-[1080px] w-[1920px]"
          style={{ position: "relative" }}
        >
          <div className="h-[1080px] flex w-[1920px] justify-center ">
            <motion.img
              initial={{ x: -800 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-[1000px] relative "
              src="https://res.cloudinary.com/dqckienxj/image/upload/v1737809848/Layer_6_cnd9gl_ugaxek.png"
              alt="Player Image"
            />
          </div>
          <div className="relative bottom-[300px]">
            <div>
              <div
                style={{ backgroundColor: primaryColor }}
                className="Rectangle8 w-[1920px] h-0.5"
              ></div>
              <div className="Rectangle8 relative -top-0.5 w-[300px] h-0.5 bg-white"></div>
            </div>

            <div className="flex relative bottom-0.5">
              <div className="w-[300px] h-[300px] bg-white">
                <div
                  style={{ backgroundColor: primaryColor }}
                  className="h-14 font-tungsten text-white bg-red-500"
                >
                  <div className="flex justify-center font-[300] items-start text-6xl text-white font-teko">
                    {top1.playerName}
                  </div>
                  <img
                    className="relative left-3 h-[230px]"
                    src={top1.teamLogo}
                    alt="Team Logo"
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
                      className="flex justify-center font-bebas-neue  items-start relative bottom-[55px] text-[256px] text-white"
                    >
                      EVENT FRAGGER
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
                      K/D-{top1.kd}
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      className="flex justify-center font-[300] items-start text-6xl text-white font-teko"
                    >
                      CONTRIBUTION-{top1.contribution}%
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                      className="flex justify-center font-[300] items-start text-6xl text-white font-teko "
                    >
                      KILLS-{top1.playerkills}
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

export default EventFragger;
