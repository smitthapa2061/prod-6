// app/schedule/page.tsx
import React from "react";

type MatchData = {
  MATCH_NAME: string;
  MAP_NAME: string;
  IMAGE_LINK: string;
  CHECK_BOX: string;
  MATCH_NUMBER: string;
  MATCH_TIME: string;
  WWCD_TEAM: string;
  WWCD_TEAM_LOGO: string;
};

type SetupData = {
  ColumnB: string;
};

const apiKey = "AIzaSyD5aSldQht9Aa4Snmf_aYo2jSg2A8bxhws";
const spreadsheetId = "1f1eVMjmhmmgBPxnLI8FGkvhusLzl55jPb4_B8vjjgpo";
const matchScheduleRange = "matchSchedule!A2:H6";
const setupRange = "setup!A2:B10";

const fetchMatchScheduleData = async (): Promise<MatchData[]> => {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${matchScheduleRange}?key=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok)
      throw new Error("Failed to fetch data from Google Sheets API");
    const result = await response.json();
    return result.values
      .filter((row: string[]) => row[3]?.toLowerCase() === "true") // Filter by status "true"
      .map((row: string[]) => ({
        MATCH_NAME: row[0] || "",
        MAP_NAME: row[1] || "",
        IMAGE_LINK: row[2] || "",
        CHECK_BOX: row[3] || "",
        MATCH_NUMBER: row[4] || "",
        MATCH_TIME: row[5] || "",
        WWCD_TEAM: row[6] || "",
        WWCD_TEAM_LOGO: row[7] || "",
      }));
  } catch (err) {
    console.error("Error fetching MatchSchedule data:", err);
    return [];
  }
};

const fetchSetupData = async (): Promise<SetupData[]> => {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${setupRange}?key=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch Setup data");
    const result = await response.json();
    return result.values.map((row: string[]) => ({ ColumnB: row[1] || "" }));
  } catch (err) {
    console.error("Error fetching Setup data:", err);
    return [];
  }
};

const Schedule = async () => {
  const matchScheduleData = await fetchMatchScheduleData();
  const setupData = await fetchSetupData();

  const primaryColor: string = setupData[5]?.ColumnB || "#cb201e";

  return (
    <div className="w-[1920px] h-[1080px] ">
      <div className="text-white text-[160px] font-bebas-neue w-[900px] h-[200px] border-[1px] border-transparent rounded-[10px] flex justify-center relative top-[30px] mx-auto">
        <div className="absolute top-[-10px] w-[900px] left-[83px]">
          MATCH SCHEDULE
        </div>
        <div
          style={{ backgroundColor: primaryColor }}
          className="w-[1000px] absolute h-[60px] mb-[-40px] left-[0px] text-[40px] text-white font-[orbitron] font-[800] text-center tracking-wider top-[190px]"
        >
          <div>
            {setupData[2]?.ColumnB || ""} | DAY - {setupData[3]?.ColumnB || ""}{" "}
            | MATCH - {setupData[4]?.ColumnB || ""}
          </div>
        </div>
      </div>

      {matchScheduleData.length === 0 ? (
        <p className="text-white">No matches are selected</p>
      ) : (
        <div className="flex flex-row flex-wrap justify-center gap-6 mt-8">
          {matchScheduleData.map((match, index) => (
            <div
              key={index}
              className="bg-white border-[8px] border-black w-[22rem] h-[43rem] relative top-[80px] left-[0px] flex flex-col font-bebas-neue"
            >
              <div className="bg-[#f5f5f5] w-[100%] h-[139px] relative top-[0px] z-10 ">
                <div className="text-[40px] relative left-[220px] top-[15px] scale-150">
                  {match.WWCD_TEAM ? match.WWCD_TEAM : match.MATCH_TIME}
                </div>
              </div>
              <div
                className="bg-red-600 w-[90px] h-[140px] top-[-85px] relative z-10 flex justify-center"
                style={{
                  backgroundColor: primaryColor,
                }}
              >
                <div className="text-[3.6rem] text-white p-0 m-0 scale-150 top-[6px] relative">
                  {match.MATCH_NUMBER}
                </div>
              </div>

              {match.WWCD_TEAM ? (
                <div
                  className="bg-violet-800 w-[full] h-[850px] relative top-[-87px] z-0"
                  style={{
                    background: `url(${match.IMAGE_LINK}) no-repeat center center`,
                    backgroundSize: "cover",
                  }}
                >
                  <img
                    src={
                      match.WWCD_TEAM_LOGO ||
                      "https://res.cloudinary.com/dqckienxj/image/upload/v1730785916/default_ryi6uf_edmapm.png"
                    }
                    alt=""
                    className="mb-[-315px]"
                  />
                  <div className="bg-gradient-to-b from-transparent to-black h-[360px] relative top-[200px]"></div>
                  <div
                    className="bg-red-800 h-[96px] w-[340px] absolute top-[496px]"
                    style={{
                      backgroundColor: primaryColor,
                    }}
                  >
                    <div className="text-white text-[80px] relative left-[88px] top-[-5px] font-bebas-neue font-[500] tracking-wide">
                      WWCD
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="bg-violet-800 w-[full] h-[850px] relative top-[-87px] z-0"
                  style={{
                    background: `url(${match.IMAGE_LINK}) no-repeat center center`,
                    backgroundSize: "cover",
                  }}
                >
                  <div
                    className="bg-red-800 h-[96px] w-[full] relative top-[496px]"
                    style={{
                      backgroundColor: primaryColor,
                    }}
                  >
                    <div className="text-white text-[80px] relative left-[60px] top-[-5px] font-bebas-neue font-[500] tracking-wide">
                      {match.MAP_NAME}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Schedule;
