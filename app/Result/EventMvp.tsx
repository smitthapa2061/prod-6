import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image"; // Importing Image for optimization

// Define types for the fetched data
interface PlayerData {
  playerName: string;
  playerkills: number | string;
  teamTag: string | number;
  teamLogo: string;
  PlayerPhoto: string;
  kd: string;
  contribution: string;
}

const apiKey: string = "AIzaSyD5aSldQht9Aa4Snmf_aYo2jSg2A8bxhws";
const spreadsheetId: string = "1f1eVMjmhmmgBPxnLI8FGkvhusLzl55jPb4_B8vjjgpo";

const range = "overall1!A2:P25";
const range2 = "setup!A2:B10";

const fadeInAnimation = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const EventFragger: React.FC = () => {
  const [top1, setTop1] = useState<PlayerData | null>(null);
  const [primaryColor, setPrimaryColor] = useState<string>("#FF0000");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
        const response = await axios.get<{ values: string[][] }>(url);
        const values = response.data.values || [];

        const formattedData: PlayerData[] = values.map((row: string[]) => ({
          playerName: row[6] || "",
          playerkills: row[7] || "0",
          teamTag: row[0] || 0,
          teamLogo: row[1] || "",
          PlayerPhoto: row[8] || "",
          kd: row[5] || "0",
          contribution: row[10] || "0",
        }));

        const url2 = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range2}?key=${apiKey}`;
        const response2 = await axios.get<{ values: string[][] }>(url2);
        const values2 = response2.data.values || [];

        const primaryColorValue = values2.find(
          (row: string[]) => row[0] === "PRIMARY COLOR"
        );
        if (primaryColorValue) {
          setPrimaryColor(primaryColorValue[1] || "#FF0000");
        }

        const sortedData = formattedData.sort(
          (a, b) =>
            (typeof b.playerkills === "number" ? b.playerkills : 0) -
            (typeof a.playerkills === "number" ? a.playerkills : 0)
        );
        setTop1(sortedData[0]);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    fetchData();
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
          variants={fadeInAnimation}
          initial="hidden"
          animate="visible"
          className="Group6 h-[1080px] w-[1920px]"
          style={{ position: "relative" }}
        >
          <div className="h-[1080px] flex w-[1920px] justify-center ">
            <motion.div
              initial={{ x: -800 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-[1000px] relative "
            >
              <Image
                src="https://res.cloudinary.com/dqckienxj/image/upload/v1737809848/Layer_6_cnd9gl_ugaxek.png"
                alt="Player Image"
                width={1000}
                height={500}
              />
            </motion.div>
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
                  <Image
                    className="relative left-3 h-[230px]"
                    src={top1.teamLogo}
                    alt="Team Logo"
                    width={200}
                    height={200}
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
