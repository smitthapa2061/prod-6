import React from "react";
import Image from "next/image"; // Import Image from next/image

// Define types for fetched data
interface SlotData {
  ColumnA: string;
  ColumnB: string;
  ColumnC: string;
}

interface SetupData {
  ColumnB: string;
}

// Server-side function to fetch slot list data
const fetchSlotList = async (): Promise<SlotData[]> => {
  const apiKey: string = "AIzaSyD5aSldQht9Aa4Snmf_aYo2jSg2A8bxhws";
  const spreadsheetId: string = "1f1eVMjmhmmgBPxnLI8FGkvhusLzl55jPb4_B8vjjgpo";
  const range: string = "SlotList!A1:C21"; // Range you want to fetch (adjust this as needed)

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch slot list data");

  const result = await response.json();
  return result.values.map((row: string[]) => ({
    ColumnA: row[0] || "",
    ColumnB: row[1] || "",
    ColumnC: row[2] || "",
  }));
};

// Server-side function to fetch setup data
const fetchSetupData = async (): Promise<SetupData[]> => {
  const apiKey: string = "AIzaSyD5aSldQht9Aa4Snmf_aYo2jSg2A8bxhws";
  const spreadsheetId: string = "1f1eVMjmhmmgBPxnLI8FGkvhusLzl55jPb4_B8vjjgpo";
  const range2: string = "setup!A2:B10";

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range2}?key=${apiKey}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch setup data");

  const result = await response.json();
  return result.values.map((row: string[]) => ({
    ColumnB: row[1] || "",
  }));
};

const SlotListData = async () => {
  // Fetch data on the server
  const data = await fetchSlotList();
  const data2 = await fetchSetupData();

  return (
    <div className="w-[1920px] h-[1080px]">
      <div className="text-white text-[140px] font-bebas-neue w-[780px] h-[170px] border-[1px] border-transparent rounded-[10px] flex justify-center relative left-[550px] top-[10px] mb-[70px]">
        <div className="relative top-[-10px]">PLAYING TEAMS</div>
      </div>

      {data2.length > 0 && (
        <div
          style={{ backgroundColor: data2[5]?.ColumnB || "white" }}
          className="w-[900px] h-[70px] mb-[-70px] relative left-[475px] text-[60px] text-white font-[orbitron] font-[800] text-center tracking-wider top-[-70px]"
        >
          <div className="relative top-[-9px]">{data2[0]?.ColumnB}</div>
        </div>
      )}

      <div className="grid grid-cols-7 p-0">
        {data2.length > 0 &&
          data.map((row, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 p-0 border rounded-lg bg-white w-[230px] h-[170px] mt-[70px] relative top-[-15px] left-[34px]"
            >
              <div className="bg-[#ffffff] w-[230px] h-[400px] border rounded-lg flex justify-center relative top-[2px]">
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
                style={{ backgroundColor: data2[5]?.ColumnB || "red" }}
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
