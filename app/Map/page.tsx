import React from "react";

// Google Sheets API details
const apiKey: string = "AIzaSyD5aSldQht9Aa4Snmf_aYo2jSg2A8bxhws";
const spreadsheetId: string = "1f1eVMjmhmmgBPxnLI8FGkvhusLzl55jPb4_B8vjjgpo";
const range = "SlotList!A1:C21";
const range2 = "setup!A2:B10";

// Define type for the row structure
interface SlotRow {
  ColumnA: string;
  ColumnB: string;
  ColumnC: string;
}

// Function to fetch SlotList data
const fetchSlotListData = async (): Promise<SlotRow[]> => {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch SlotList data");
    const result = await response.json();

    return (
      result.values?.map(
        (row: string[]): SlotRow => ({
          ColumnA: row[0] || "",
          ColumnB: row[1] || "",
          ColumnC: row[2] || "",
        })
      ) || []
    );
  } catch (err) {
    console.error("Error fetching SlotList data:", err);
    return [];
  }
};

// Function to fetch setup data
const fetchSetupData = async (): Promise<Record<string, string>> => {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range2}?key=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch setup data");
    const result = await response.json();

    return Object.fromEntries(
      (result.values as string[][])?.map((row: string[]) => [row[0], row[1]]) ||
        []
    );
  } catch (err) {
    console.error("Error fetching Setup data:", err);
    return {};
  }
};

// **Server-side rendered component**
const Map = async () => {
  const slotData = await fetchSlotListData();
  const setupData = await fetchSetupData();

  // Colors from setup sheet
  const primaryColor = setupData["PRIMARY COLOR"] || "#cb201e";
  const textColor = setupData["TEXT COLOR 1"] || "black";

  // Split data into two halves for left & right containers
  const firstHalf = slotData.slice(0, 7);
  const secondHalf = slotData.slice(7, 14);

  return (
    <div className="w-[1920px] h-[1080px] flex justify-center items-center">
      {/* Left side container */}
      <div className="flex flex-col gap-3 items-center relative left-[-520px]">
        {firstHalf.map((row: SlotRow, index: number) =>
          row.ColumnB ? (
            <div
              key={index}
              className="flex flex-col gap-3 p-0 w-[480px] h-[140px] relative"
              style={{ backgroundColor: primaryColor }}
            >
              <div className="w-[230px] h-[120px] flex justify-center absolute top-[2px] left-[0px]">
                <img
                  src={
                    row.ColumnC ||
                    "https://res.cloudinary.com/dqckienxj/image/upload/v1730785916/default_ryi6uf_edmapm.png"
                  }
                  alt=""
                  className="w-[170px] h-[160px]"
                />
              </div>
              <div
                className="w-[250px] h-[90px] bg-white flex justify-center items-center font-[300] text-[80px] font-bebas-neue relative top-[20px] left-[230px]"
                style={{ color: textColor }}
              >
                {row.ColumnB}
              </div>
            </div>
          ) : null
        )}
      </div>

      {/* Spacer */}
      <div className="w-[50px]" />

      {/* Right side container */}
      <div className="flex flex-col gap-3 items-center relative left-[500px]">
        {secondHalf.map((row: SlotRow, index: number) =>
          row.ColumnB ? (
            <div
              key={index}
              className="flex flex-col gap-3 p-0 w-[450px] h-[140px] relative"
              style={{ backgroundColor: primaryColor }}
            >
              <div className="w-[230px] h-[120px] flex justify-center absolute top-[2px] left-[0px]">
                <img
                  src={
                    row.ColumnC ||
                    "https://res.cloudinary.com/dqckienxj/image/upload/v1730785916/default_ryi6uf_edmapm.png"
                  }
                  alt=""
                  className="w-[170px] h-[160px]"
                />
              </div>
              <div
                className="w-[250px] h-[90px] bg-white flex justify-center items-center font-[300] text-[80px] font-bebas-neue relative top-[20px] left-[220px]"
                style={{ color: textColor }}
              >
                {row.ColumnB}
              </div>
            </div>
          ) : null
        )}
      </div>

      {/* Border box */}
      <div className="w-[1080px] h-[1080px] border-white border-[10px] absolute left-[430px] top-[-0px]" />
    </div>
  );
};

export default Map;
