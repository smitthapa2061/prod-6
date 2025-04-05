// This is a full server component
import React from "react";
import Image from "next/image"; // Make sure you import Image from Next.js
// Define types for the data structure
interface LowerData {
  TOR_NAME: string;
  TOR_LOGO: string;
  ROUND: string;
  DAY: string;
  MATCHES: string;
  PRIMARY_COLOR: string;
  SECONDARY_COLOR: string;
  TEXT_COLOR_1: string;
  TEXT_COLOR_2: string;
}

const apiKey = "AIzaSyD5aSldQht9Aa4Snmf_aYo2jSg2A8bxhws";
const spreadsheetId = "1f1eVMjmhmmgBPxnLI8FGkvhusLzl55jPb4_B8vjjgpo";
const range = "setup!A2:B10"; // Range you want to fetch (adjust this as needed)

// Function to fetch data from Google Sheets
const fetchLowerData = async (): Promise<LowerData | null> => {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
    const response = await fetch(url, { cache: "no-store" }); // Disable caching for fresh data

    if (!response.ok) {
      throw new Error("Failed to fetch data from Google Sheets API");
    }

    const result = await response.json();
    const values = result.values;

    return {
      TOR_NAME: values[0] ? values[0][1] : "",
      TOR_LOGO: values[1] ? values[1][1] : "",
      ROUND: values[2] ? values[2][1] : "",
      DAY: values[3] ? values[3][1] : "",
      MATCHES: values[4] ? values[4][1] : "",
      PRIMARY_COLOR: values[5] ? values[5][1] : "",
      SECONDARY_COLOR: values[6] ? values[6][1] : "",
      TEXT_COLOR_1: values[7] ? values[7][1] : "",
      TEXT_COLOR_2: values[8] ? values[8][1] : "",
    };
  } catch (err) {
    console.error(err);
    return null;
  }
};

const Lower = async () => {
  const data = await fetchLowerData();

  if (!data) {
    return <div>Error: Failed to load data</div>;
  }

  return (
    <div className="flex items-end">
      <div className="flex items-center gap-2 w-[1920px] h-[1080px] absolute left-[3%] top-[390px]">
        <div
          className="bg-[#cb201e] mt-4 w-[10rem] h-[10rem] rotate-45 flex justify-center items-center shadow-xl"
          style={{ backgroundColor: `${data.PRIMARY_COLOR}` }}
        >
          <div
            className="bg-[#8a110f] border-4 border-black w-[8rem] h-[8rem] flex items-center justify-center"
            style={{ backgroundColor: `${data.PRIMARY_COLOR}` }}
          >
            <Image
              src={data.TOR_LOGO}
              alt="Tournament Logo"
              className="transform rotate-[-45deg] w-full h-full p-2"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="w-[14rem] h-[1rem] transform skew-x-[45deg] bg-white flex items-center">
            <span className="transform -skew-x-[45deg] text-black font-bebas-neue mx-2">
              <p className="font-[900] font-[orbitron] tracking-widest relative left-[8px]">
                {data.TOR_NAME}
              </p>
            </span>
          </div>

          <div
            className="w-[20rem] h-[4rem] transform skew-x-[45deg] bg-[#cb201e] flex justify-center items-center"
            style={{ backgroundColor: `${data.PRIMARY_COLOR}` }}
          >
            <span className="block transform -skew-x-[45deg] text-white font-[200] text-[3.1rem] font-bebas-neue mx-2 relative top-[2px]">
              DAY {data.DAY} - MATCH {data.MATCHES}
            </span>
          </div>
          <div className="flex items-center justify-start mt-2">
            <div className="bg-white w-[17rem] h-[4rem] transform skew-x-[135deg] shadow-lg flex items-center justify-center">
              <div className="block transform -skew-x-[135deg] text-black font-[500] text-5xl font-bebas-neue mx-2">
                {data.ROUND}
              </div>
            </div>
            <div className="w-[5rem] h-[0.4rem] bg-white transform rotate-[135deg] -ml-6 shadow-lg"></div>
            <div className="w-[5rem] h-[0.4rem] bg-white transform rotate-[135deg] -ml-16 shadow-lg"></div>
            <div className="w-[5rem] h-[0.4rem] bg-white transform rotate-[135deg] -ml-16 shadow-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lower;
