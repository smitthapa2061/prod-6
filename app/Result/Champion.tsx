import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image"; // Import Next.js Image component

// Define types for the data structure
interface TeamData {
  teamTag: string;
  teamLogo: string;
  totalkills: number;
  rankpoint: number;
  totalpoints: number;
}

const apiKey: string = "AIzaSyD5aSldQht9Aa4Snmf_aYo2jSg2A8bxhws";
const spreadsheetId: string = "1f1eVMjmhmmgBPxnLI8FGkvhusLzl55jPb4_B8vjjgpo";
const range = "overall1!A2:G25"; // Range for overall data
const range2 = "setup!A2:B10"; // Range for setup data (primary color)

const fadeInAnimation = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const Champions: React.FC = () => {
  const [top1, setTop1] = useState<TeamData | null>(null); // Top team data (null initially)
  const [primaryColor, setPrimaryColor] = useState<string>("#FF0000"); // Default red color
  const [error, setError] = useState<string | null>(null); // Error message state

  useEffect(() => {
    // Fetch data from Google Sheets API
    const fetchData = async () => {
      try {
        // Fetch main team data
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
        const response = await axios.get<{ values: string[][] }>(url);
        const values = response.data.values || [];

        // Process data
        const formattedData: TeamData[] = values.map((row) => ({
          teamTag: row[0] || "",
          teamLogo: row[1] || "https://default-image-url.com", // Fallback logo
          totalkills: row[3] ? Number(row[3]) : 0,
          rankpoint: row[4] ? Number(row[4]) : 0,
          totalpoints: row[2] ? Number(row[2]) : 0,
        }));

        // Remove duplicates based on teamTag, keeping the first occurrence of each team
        const uniqueTeams = formattedData.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.teamTag === value.teamTag)
        );

        // Set top 1 data
        const sortedData = uniqueTeams.sort(
          (a, b) => b.totalpoints - a.totalpoints
        );
        setTop1(sortedData[0]); // Assuming the top team is the one with the highest total points

        // Fetch primary color data
        const url2 = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range2}?key=${apiKey}`;
        const response2 = await axios.get<{ values: string[][] }>(url2);
        const values2 = response2.data.values || [];

        // Extract primary color
        const primaryColorValue = values2.find(
          (row) => row[0] === "PRIMARY COLOR"
        );
        if (primaryColorValue) {
          setPrimaryColor(primaryColorValue[1] || "#FF0000"); // Fallback to red if no color found
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
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
          <div className="h-[1080px] flex w-[1920px] items-start top-[120px] relative ">
            <motion.div
              initial={{ x: -800 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-[800px] relative right-[116px] "
            >
              <Image
                src="https://res.cloudinary.com/dqckienxj/image/upload/v1735762279/defult_chach_apsjhc_dwnd7n.png"
                alt="Team Image"
                width={800}
                height={800}
              />
            </motion.div>
            <motion.div
              initial={{ x: -800 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-[800px] relative right-[424px]"
            >
              <Image
                src="https://res.cloudinary.com/dqckienxj/image/upload/v1735762279/defult_chach_apsjhc_dwnd7n.png"
                alt="Team Image"
                width={800}
                height={800}
              />
            </motion.div>
            <motion.div
              initial={{ x: -800 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-[800px] relative right-[800px]"
            >
              <Image
                src="https://res.cloudinary.com/dqckienxj/image/upload/v1735762279/defult_chach_apsjhc_dwnd7n.png"
                alt="Player Image"
                width={800}
                height={800}
              />
            </motion.div>
            <motion.div
              initial={{ x: -800 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-[800px] relative right-[1108px]"
            >
              <Image
                src="https://res.cloudinary.com/dqckienxj/image/upload/v1735762279/defult_chach_apsjhc_dwnd7n.png"
                alt="Player Image"
                width={800}
                height={800}
              />
            </motion.div>
          </div>
          <div className="relative bottom-[300px]">
            <div>
              <div
                style={{ backgroundColor: primaryColor }}
                className="Rectangle8 w-[1920px] h-0.5"
              ></div>
              <div className="Rectangle8 relative -top-0.5 w-[300px] h-0.5  bg-[#1c1c1c]"></div>
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
                      className="flex justify-center font-bebas-neue  items-start relative bottom-[55px] text-[256px] text-white"
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
                      className="flex justify-center font-[300] items-start text-6xl text-white font-teko "
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

export default Champions;
