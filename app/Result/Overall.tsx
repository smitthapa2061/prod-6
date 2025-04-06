import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import Image from "next/image";
import { motion } from "framer-motion";

// Define the types for the fetched data
interface RowData {
  ColumnA: string | null; // Team Name
  ColumnB: string; // Logo URL
  ColumnC: number; // Kills
  ColumnD: number; // Placement
  ColumnE: number; // WWCD
  ColumnF: number; // Total Score
  ColumnG: number; // Sorting Score
}

interface SetupDataRow {
  ColumnB: string;
}

interface GoogleSheetsResponse {
  values: string[][]; // The data structure returned by the Google Sheets API
}

const apiKey: string = "AIzaSyD5aSldQht9Aa4Snmf_aYo2jSg2A8bxhws";
const spreadsheetId: string = "1f1eVMjmhmmgBPxnLI8FGkvhusLzl55jPb4_B8vjjgpo";

const range = "overall1!A2:P100"; // Range you want to fetch (adjust this as needed)
const range2 = "setup!A2:B10"; // Another range for setup data

const Overall: React.FC = () => {
  const [data, setData] = useState<RowData[]>([]);
  const [data2, setData2] = useState<SetupDataRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
        const response = await axios.get<GoogleSheetsResponse>(url);

        const values = response.data.values || [];

        const seen = new Set<string>();
        const formattedData: RowData[] = values
          .map((row) => ({
            ColumnA: row[0] || null, // Team Name
            ColumnB:
              row[1] ||
              "https://res.cloudinary.com/dqckienxj/image/upload/v1730785916/default_ryi6uf_edmapm.png", // Logo
            ColumnC: row[3] ? parseInt(row[3], 10) : 0, // Kills
            ColumnD: row[4] ? parseInt(row[4], 10) : 0, // Placement (Position Points)
            ColumnE: row[9] ? parseInt(row[9], 10) : 0, // WWCD
            ColumnF: row[2] ? parseInt(row[2], 10) : 0, // Total Score (from column 2)
            ColumnG: row[10] ? parseInt(row[10], 10) : 0, // Contribution Score
          }))
          .filter((row) => {
            if (!row.ColumnA) return false;
            const normalized = row.ColumnA.trim().toLowerCase();
            if (seen.has(normalized)) return false;
            seen.add(normalized);
            return true;
          });

        setData(formattedData);

        const url2 = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range2}?key=${apiKey}`;
        const response2 = await axios.get<GoogleSheetsResponse>(url2);
        const values2 = response2.data.values || [];

        const formattedData2: SetupDataRow[] = values2.map((row) => ({
          ColumnB: row[1] || "",
        }));

        setData2(formattedData2);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message); // Now we safely access 'message'
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    fetchData();
  }, []);

  // Dynamically divide data into two equal parts
  const sortedData = [...data].sort((a, b) => {
    // Sort by Total Score (ColumnF) in descending order
    if (b.ColumnF !== a.ColumnF) {
      return b.ColumnF - a.ColumnF;
    }
    // Then by Placement (ColumnD) in ascending order
    if (a.ColumnD !== b.ColumnD) {
      return a.ColumnD - b.ColumnD;
    }
    // Then by Kills (ColumnC) in descending order
    if (b.ColumnC !== a.ColumnC) {
      return b.ColumnC - a.ColumnC;
    }
    // Finally, by WWCD (ColumnE) in descending order
    return b.ColumnE - a.ColumnE;
  });

  const half = Math.ceil(sortedData.length / 2);
  const firstColumnData = sortedData.slice(0, half); // Top-ranking teams
  const secondColumnData = sortedData.slice(half); // Lower-ranking teams

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (data.length === 0) {
    return <div>Loading...</div>;
  }
  return (
    <div className="w-[1920px] h-[1080px]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }} // Fade out on exit
        transition={{ duration: 0.5 }}
      >
        <div className="text-white text-[130px] font-[500] text-center mb-[-100px] font-bebas-neue relative top-[-15px]">
          OVERALL RANKING
        </div>
        {data2.length > 0 && (
          <div>
            <div
              style={{
                backgroundColor: `${data2[5].ColumnB}`,
              }}
              className="w-[1000px] h-[60px] bg-[white] mb-[-40px] relative left-[465px] text-[40px] text-white font-[orbitron] font-[800] text-center tracking-wider top-[50px]"
            >
              <div className="relative top-[0px]">
                {data2[2].ColumnB} | DAY - {data2[3].ColumnB} | MATCH -{" "}
                {data2[4].ColumnB}
              </div>
            </div>
            <div
              style={{
                borderColor: `${data2[5].ColumnB}`,
              }}
              className="w-[769px] h-[35px] bg-white mb-[-80px] relative left-[145px] border-red-800 border-[1px] top-[110px]"
            >
              <div className="flex ">
                <div
                  style={{
                    color: `${data2[5].ColumnB}`,
                  }}
                  className="flex font-[orbitron] font-[800] text-[20px] text-red-800 tracking-wider "
                >
                  <div className="ml-[40px]">#</div>
                  <div className="ml-[40px]">TEAM</div>
                  <div className="ml-[190px]">WWCD</div>
                  <div className="ml-[23px]">PLACE</div>
                  <div className="ml-[23px]">KILLS</div>
                  <div className="ml-[23px]">TOTAL</div>
                </div>
              </div>
            </div>
            <div
              style={{
                borderColor: `${data2[5].ColumnB}`,
              }}
              className="w-[769px] h-[35px] bg-white mb-[-30px] relative left-[1010px] border-red-800 border-[1px] top-[155px]"
            >
              <div className="flex ">
                <div
                  style={{
                    color: `${data2[5].ColumnB}`,
                  }}
                  className="flex font-[orbitron] font-[800] text-[20px] text-red-800 tracking-wider "
                >
                  <div className="ml-[40px]">#</div>
                  <div className="ml-[40px]">TEAM</div>
                  <div className="ml-[190px]">WWCD</div>
                  <div className="ml-[23px]">PLACE</div>
                  <div className="ml-[23px]">KILLS</div>
                  <div className="ml-[23px]">TOTAL</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 relative top-[180px] font-bebas-neue font-[500] left-[10px]">
              {/* First Column */}
              <ul>
                {firstColumnData.map((row, index) => (
                  <motion.div
                    className="p-4 mb-2 w-[800px] h-[65px] relative left-[120px] flex"
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: "easeOut",
                      delay: index * 0.2,
                    }} // Staggered animation
                  >
                    {/* First Red Box */}
                    <div
                      style={{
                        backgroundColor: `${data2[5].ColumnB}`,
                      }}
                      className="bg-red-800 text-white w-[150px] h-[63px] text-[58px] flex justify-center items-center"
                    >
                      <div className="relative top-[4px]">{index + 1}</div>
                    </div>

                    {/* Second Black Box */}
                    <div className="bg-[#000000cf] w-[460px] h-[63px] flex">
                      <div className="w-[62px] h-[62px]">
                        <Image
                          src={row.ColumnB || ""}
                          alt="Team Logo"
                          width={62}
                          height={62}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="text-white text-[58px] mt-[-7px] ml-[10px]">
                        {row.ColumnA}
                      </div>
                    </div>

                    {/* Third Red Box */}
                    <div
                      style={{
                        backgroundColor: `${data2[5].ColumnB}`,
                      }}
                      className="bg-red-800 text-white w-[140px] h-[63px] flex justify-center items-center text-[56px]"
                    >
                      {row.ColumnE}
                    </div>

                    {/* Fourth Red Box */}
                    <div
                      style={{
                        backgroundColor: `${data2[5].ColumnB}`,
                      }}
                      className="bg-red-800 text-white w-[140px] h-[63px] flex justify-center items-center text-[56px]"
                    >
                      {row.ColumnD}
                    </div>

                    {/* Fifth Red Box */}
                    <div
                      style={{
                        backgroundColor: `${data2[5].ColumnB}`,
                      }}
                      className="bg-red-800 text-white w-[140px] h-[63px] flex justify-center items-center text-[56px]"
                    >
                      {row.ColumnC}
                    </div>

                    {/* Sixth Red Box */}
                    <div
                      style={{
                        backgroundColor: `${data2[5].ColumnB}`,
                      }}
                      className="bg-red-800 text-white w-[140px] h-[63px] flex justify-center items-center text-[56px]"
                    >
                      {row.ColumnF}
                    </div>
                  </motion.div>
                ))}
              </ul>

              {/* Second Column */}
              <ul>
                {secondColumnData.map((row, index) => (
                  <motion.div
                    className="p-4 mb-2 w-[800px] h-[65px] relative left-[20px] flex"
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: "easeOut",
                      delay: index * 0.2,
                    }}
                  >
                    {/* First Red Box */}
                    <div
                      style={{
                        backgroundColor: `${data2[5].ColumnB}`,
                      }}
                      className="bg-red-800 text-white w-[150px] h-[63px] text-[58px] flex justify-center items-center"
                    >
                      <div className="relative top-[4px]">
                        {index + half + 1}
                      </div>
                    </div>

                    {/* Second Black Box */}
                    <div className="bg-[#000000cf] w-[460px] h-[63px] flex">
                      <div className="w-[62px] h-[62px]">
                        <Image
                          src={row.ColumnB || ""}
                          alt="Team Logo"
                          width={62}
                          height={62}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="text-white text-[58px] mt-[-7px] ml-[10px]">
                        {row.ColumnA}
                      </div>
                    </div>

                    {/* Third Red Box */}
                    <div
                      style={{
                        backgroundColor: `${data2[5].ColumnB}`,
                      }}
                      className="bg-red-800 text-white w-[140px] h-[63px] flex justify-center items-center text-[56px]"
                    >
                      {row.ColumnE}
                    </div>

                    {/* Fourth Red Box */}
                    <div
                      style={{
                        backgroundColor: `${data2[5].ColumnB}`,
                      }}
                      className="bg-red-800 text-white w-[140px] h-[63px] flex justify-center items-center text-[56px]"
                    >
                      {row.ColumnD}
                    </div>

                    {/* Fifth Red Box */}
                    <div
                      style={{
                        backgroundColor: `${data2[5].ColumnB}`,
                      }}
                      className="bg-red-800 text-white w-[140px] h-[63px] flex justify-center items-center text-[56px]"
                    >
                      {row.ColumnC}
                    </div>

                    {/* Sixth Red Box */}
                    <div
                      style={{
                        backgroundColor: `${data2[5].ColumnB}`,
                      }}
                      className="bg-red-800 text-white w-[140px] h-[63px] flex justify-center items-center text-[56px]"
                    >
                      {row.ColumnF}
                    </div>
                  </motion.div>
                ))}
              </ul>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Overall;
