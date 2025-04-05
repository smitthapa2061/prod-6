"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import WwcdTeamStats from "../Result/Wwcd";
import Mvp from "../Result/Mvp";
import Overall from "../Result/Overall";
import MatchData from "../Result/MatchData";
import MatchFragger from "../Result/MatchFraggers";
import Fragger from "../Result/OverallFraggers";
import Champions from "../Result/Champion";
import FirstRunnerUp from "../Result/firstRunner";
import SecondRunner from "../Result/SecondRunner";
import EventMvp from "../Result/EventMvp";

// Define the type for each row in the display sheet
interface DisplayRow {
  ColumnA: string;
  ColumnB: string | null;
}

const Controller: React.FC = () => {
  const [data, setData] = useState<DisplayRow[]>([]);
  const [nextData, setNextData] = useState<DisplayRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const apiKey: string = "AIzaSyD5aSldQht9Aa4Snmf_aYo2jSg2A8bxhws"; // Google Sheets API key
  const spreadsheetId: string = "1f1eVMjmhmmgBPxnLI8FGkvhusLzl55jPb4_B8vjjgpo"; // Google Sheets ID
  const range = "display!A2:B58";
  const SHEET_API = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<{ values: string[][] }>(SHEET_API);
        const values = response.data.values || [];

        const formattedData: DisplayRow[] = values
          .filter((row) => row.length >= 2)
          .map((row) => ({
            ColumnA: row[0] || "",
            ColumnB: row[1] || null,
          }));

        setNextData(formattedData);
        setError(null);
      } catch (err: any) {
        const errorMessage = `Error fetching data: ${
          err.response?.data?.error?.message || err.message
        }`;
        console.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 8000);

    return () => {
      clearInterval(interval);
      console.log("Fetching stopped: Component unmounted.");
    };
  }, []);

  useEffect(() => {
    if (nextData.length > 0) {
      setData(nextData);
    }
  }, [nextData]);

  const activeRow = data.find((item) => item.ColumnB === "TRUE");

  return (
    <div>
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      <div>
        {activeRow?.ColumnA === "WwcdTeamStats" && <WwcdTeamStats />}
        {activeRow?.ColumnA === "Mvp" && <Mvp />}
        {activeRow?.ColumnA === "OverallData" && <Overall />}
        {activeRow?.ColumnA === "MatchData" && <MatchData />}
        {activeRow?.ColumnA === "MatchFragger" && <MatchFragger />}
        {activeRow?.ColumnA === "OverallFragger" && <Fragger />}
        {activeRow?.ColumnA === "Champions" && <Champions />}
        {activeRow?.ColumnA === "1stRunnerUp" && <FirstRunnerUp />}
        {activeRow?.ColumnA === "2ndRunnerUp" && <SecondRunner />}
        {activeRow?.ColumnA === "EventMvp" && <EventMvp />}
      </div>
    </div>
  );
};

export default Controller;
