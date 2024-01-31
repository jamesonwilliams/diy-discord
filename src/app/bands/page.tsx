import React from "react";
import { Band } from "../types/Band";
import fs from "fs";
import path from 'path';
import BandList from "./BandList";

export default async function Page() {
  return (
    <div>
      <BandList bands={getBands()} />
    </div>
  );
};

function getBands(): Band[] {
  const jsonPath = path.join(process.cwd(), "data", "bands.json");
  const bandsData = fs.readFileSync(jsonPath, "utf8");
  return JSON.parse(bandsData).sort((a: Band, b: Band) => {
    return a.name.localeCompare(b.name);
  });
}
