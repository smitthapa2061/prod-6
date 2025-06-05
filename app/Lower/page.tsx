"use client";

import React, { useEffect, useState } from "react";

interface LowerData {
  TOR_NAME: string;
  TOR_LOGO: string;
  ROUND: string;
  DAY: string;
  MATCHES: string;
  PRIMARY_COLOR: string;
  DAY_NAME: string;
  SECONDARY_COLOR: string;
  TEXT_COLOR_1: string;
  TEXT_COLOR_2: string;
}

const apiKey: string = "AIzaSyD5aSldQht9Aa4Snmf_aYo2jSg2A8bxhws";
const spreadsheetId: string = "1f1eVMjmhmmgBPxnLI8FGkvhusLzl55jPb4_B8vjjgpo";
const range = "setup!A2:B16";

const Lower = () => {
  const [data, setData] = useState<LowerData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchLowerData = async () => {
      try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
        const response = await fetch(url, { cache: "no-store" });

        if (!response.ok) {
          throw new Error("Failed to fetch data from Google Sheets API");
        }

        const result = await response.json();
        const values = result.values;

        const fetchedData: LowerData = {
          TOR_NAME: values[0] ? values[0][1] : "",
          TOR_LOGO: values[1] ? values[1][1] : "",
          ROUND: values[2] ? values[2][1] : "",
          DAY: values[3] ? values[3][1] : "",
          DAY_NAME: values[3] ? values[3][0] : "", // ← New value
          MATCHES: values[4] ? values[4][1] : "",
          PRIMARY_COLOR: values[5] ? values[5][1] : "",
          SECONDARY_COLOR: values[6] ? values[6][1] : "",
          TEXT_COLOR_1: values[7] ? values[7][1] : "",
          TEXT_COLOR_2: values[8] ? values[8][1] : "",
        };

        setData(fetchedData);
      } catch (err) {
        console.error(err);
        setError(true);
      }
    };

    fetchLowerData();
  }, []);

  if (error) {
    return <div>Error: Failed to load data</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-end w-[1920px] h-[1080px]">
      <div className="mb-[100px] ">
        <div
          className="top-[100px] w-[560px] h-[180px] flex shadow-xl justify-between relative bg-gradient-to-r from-[#d3d3d3] to-white"
          style={{ backgroundColor: data.PRIMARY_COLOR }}
        >
          <div
            className="bg-black text-[2.5rem] font-[500] px-6  rounded uppercase w-fit tracking-wide absolute top-[-23px] z-[999] right-6 text-black shadow-xl font-[teko] skew-x-12"
            style={{
              backgroundColor: data.SECONDARY_COLOR,
              color: data.TEXT_COLOR_1,
            }}
          >
            {data.TOR_NAME}
          </div>

          <div className="w-max h-full flex items-center justify-center">
            <img
              src={data.TOR_LOGO}
              alt="Logo"
              className="h-full aspect-square object-contain"
            />
          </div>

          <div
            className="w-4/6 h-full flex flex-col justify-center items-end px-4 text-white skew-x-12"
            style={{
              clipPath:
                "polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%, 20% 30%, 0% 60%)",
              backgroundColor: data.PRIMARY_COLOR,
            }}
          >
            <div className="flex flex-col">
              <div className="text-[6.2rem] font-bebas-neue relative top-[20px] text-white">
                Match {data.MATCHES}
              </div>
              <div
                className="bg-black text-[1.7rem] font-[500]   rounded uppercase w-[180px] h-[35px]  font-[teko] text-center top-[-10px] left-[20px] relative text-black"
                style={{
                  backgroundColor: data.SECONDARY_COLOR,
                  color: data.TEXT_COLOR_1,
                }}
              >
                {data.DAY_NAME} - {data.DAY} 
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lower;
