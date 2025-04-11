"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface SlotData {
  ColumnA: string;
  ColumnB: string;
  ColumnC: string;
}

interface SetupData {
  ColumnB: string;
}

const SlotListData = () => {
  const [slotList, setSlotList] = useState<SlotData[]>([]);
  const [setupData, setSetupData] = useState<SetupData[]>([]);

  useEffect(() => {
    const fetchSlotList = async () => {
      const apiKey = "AIzaSyD5aSldQht9Aa4Snmf_aYo2jSg2A8bxhws";
      const spreadsheetId = "1f1eVMjmhmmgBPxnLI8FGkvhusLzl55jPb4_B8vjjgpo";
      const range = "SlotList!A1:C21";

      try {
        const res = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`
        );
        const data = await res.json();
        const mappedData = data.values.map((row: string[]) => ({
          ColumnA: row[0] || "",
          ColumnB: row[1] || "",
          ColumnC: row[2] || "",
        }));
        setSlotList(mappedData);
      } catch (err) {
        console.error("Failed to fetch slot list:", err);
      }
    };

    const fetchSetupData = async () => {
      const apiKey = "AIzaSyD5aSldQht9Aa4Snmf_aYo2jSg2A8bxhws";
      const spreadsheetId = "1f1eVMjmhmmgBPxnLI8FGkvhusLzl55jPb4_B8vjjgpo";
      const range = "setup!A2:B10";

      try {
        const res = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`
        );
        const data = await res.json();
        const mappedData = data.values.map((row: string[]) => ({
          ColumnB: row[1] || "",
        }));
        setSetupData(mappedData);
      } catch (err) {
        console.error("Failed to fetch setup data:", err);
      }
    };

    fetchSlotList();
    fetchSetupData();
  }, []);

  return (
    <div className="w-[1920px] h-[1080px]">
      <div className="text-white text-[140px] font-bebas-neue w-[780px] h-[170px] border border-transparent rounded-[10px] flex justify-center relative left-[550px] top-[10px] mb-[70px]">
        <div className="relative top-[-10px]">PLAYING TEAMS</div>
      </div>

      {setupData.length > 0 && (
        <div
          style={{ backgroundColor: setupData[5]?.ColumnB || "white" }}
          className="w-[900px] h-[70px] mb-[-70px] relative left-[475px] text-[60px] text-white font-[orbitron] font-[800] text-center tracking-wider top-[-70px]"
        >
          <div className="relative top-[-9px]">{setupData[0]?.ColumnB}</div>
        </div>
      )}

      <div className="grid grid-cols-7 p-0">
        {setupData.length > 0 &&
          slotList.map((row, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 p-0 border rounded-lg bg-white w-[230px] h-[170px] mt-[70px] relative top-[-15px] left-[34px]"
            >
              <div className="bg-white w-[230px] h-[400px] border rounded-lg flex justify-center relative top-[2px]">
                <Image
                  src={
                    row.ColumnC ||
                    "https://res.cloudinary.com/dqckienxj/image/upload/v1727161652/default_nuloh2.png"
                  }
                  alt="Slot Image"
                  width={170}
                  height={160}
                  className="relative top-[-10px]"
                />
              </div>
              <div
                style={{ backgroundColor: setupData[5]?.ColumnB || "red" }}
                className="w-[200px] h-[60px] flex justify-center items-center font-[300] text-white border rounded-lg text-[40px] font-bebas-neue relative top-[-40px] left-[-20px]"
              >
                <div className="relative top-[2px]">
                  {row.ColumnA}.{row.ColumnB}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SlotListData;
