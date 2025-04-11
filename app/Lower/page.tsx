// This is a full server component
import React from "react";
import Image from "next/image"; // Make sure you import Image from Next.js
import { Result } from "postcss";
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

const apiKey: string = "AIzaSyD5aSldQht9Aa4Snmf_aYo2jSg2A8bxhws";
const spreadsheetId: string = "1f1eVMjmhmmgBPxnLI8FGkvhusLzl55jPb4_B8vjjgpo";
const range = "setup!A2:B16"; // Range you want to fetch (adjust this as needed)

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
    <div className=" flex items-end  w-[1920px] h-[1080px]">
      <div className="mb-[100px] ">
        {/* Logo Left, Clipped Info Right */}
        <div
          className="top-[100px] w-[560px] h-[180px] flex shadow-xl  justify-between relative bg-gradient-to-r from-[#d3d3d3] to-white"
          style={{ backgroundColor: data.PRIMARY_COLOR }}
        >
          <div
            className="bg-black text-[2rem] font-bold px-2 py-1 rounded uppercase w-fit  tracking-wider absolute top-[-23px] z-[999] right-6 text-white shadow-xl  font-[orbitron] skew-x-12"
            style={{
              backgroundColor: data.SECONDARY_COLOR,
              color: data.TEXT_COLOR_1,
            }}
          >
            {data.TOR_NAME}
          </div>
          {/* Left Box - Logo (Rectangle) */}
          <div className="w-max h-full flex items-center justify-center">
            <img
              src={data.TOR_LOGO}
              alt="Logo"
              className="h-full aspect-square object-contain"
            />
          </div>

          {/* Right Box - Clipped Left Edge Info */}
          <div
            className="w-4/6 h-full flex flex-col justify-center items-end px-4 text-white skew-x-12"
            style={{
              clipPath:
                "polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%, 20% 30%, 0% 60%)",
              backgroundColor: data.PRIMARY_COLOR,
            }}
          >
            <div className="flex flex-col ">
              <div className="text-[6.2rem] font-bebas-neue relative top-[20px] ">
                Match {data.MATCHES}
              </div>
              <div
                className="bg-black text-[1rem] font-bold px-2 py-1 rounded uppercase w-[180px] h-[35px] tracking-widest font-[orbitron] text-center top-[-10px] left-[20px] relative"
                style={{
                  backgroundColor: data.SECONDARY_COLOR,
                  color: data.TEXT_COLOR_1,
                }}
              >
                DAY {data.DAY}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lower;
