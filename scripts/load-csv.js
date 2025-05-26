import fs from "fs";
import { parse } from "csv-parse";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const BATCH_SIZE = 100; // Process records in batches for better performance

function parseHeight(height) {
  if (!height) return { height: null, heightInches: null };

  // Handle format like "6'6""
  if (height.includes("'")) {
    const [feet, inches] = height
      .replace('"', "")
      .split("'")
      .map((x) => parseInt(x) || 0);
    const totalInches = feet * 12 + inches;
    return { height: `${feet}-${inches}`, heightInches: totalInches };
  }

  // Handle format like "6-6"
  if (height.includes("-")) {
    const [feet, inches] = height.split("-").map((x) => parseInt(x) || 0);
    const totalInches = feet * 12 + inches;
    return { height, heightInches: totalInches };
  }

  return { height, heightInches: null };
}

async function validateAndTransformRecord(record) {
  const { height, heightInches } = parseHeight(record.height);

  // Convert date string to proper ISO format
  let birthday = null;
  if (record.birthday) {
    try {
      birthday = new Date(record.birthday).toISOString().split("T")[0];
    } catch (err) {
      console.warn(
        `Invalid date format for playerid ${record.playerid}: ${record.birthday}`
      );
    }
  }

  // Clean and validate school name (sometimes it's in the wrong column)
  let school = record.school?.trim() || null;
  if (!school && record.draft_year?.includes("Hall")) {
    school = record.draft_year;
  }

  return {
    playerid: parseInt(record.playerid),
    firstName: record.fname?.trim() || "",
    lastName: record.lname?.trim() || "",
    position: record.position?.trim() || null,
    height,
    weight: record.weight ? parseInt(record.weight) : null,
    birthday,
    country: record.country?.trim() || null,
    school,
    draftYear: !isNaN(record.draft_year) ? parseInt(record.draft_year) : null,
    draftRound: !isNaN(record.draft_round)
      ? parseInt(record.draft_round)
      : null,
    draftNumber: !isNaN(record.draft_number)
      ? parseInt(record.draft_number)
      : null,
    heightInches,
  };
}

async function loadCsv() {
  console.log("Starting CSV import...");
  const parser = fs.createReadStream("./data/players.csv").pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true, // Allow inconsistent column counts
      on_record: (record) => {
        // Ensure all expected fields are present
        return {
          playerid: record.playerid || null,
          fname: record.fname || "",
          lname: record.lname || "",
          position: record.position || null,
          height: record.height || null,
          weight: record.weight || null,
          birthday: record.birthday || null,
          country: record.country || null,
          school: record.school || null,
          draft_year: record.draft_year || null,
          draft_round: record.draft_round || null,
          draft_number: record.draft_number || null,
        };
      },
    })
  );

  let count = 0;
  let batch = [];
  let errors = [];

  for await (const row of parser) {
    try {
      const transformedData = await validateAndTransformRecord(row);
      batch.push(
        prisma.player.upsert({
          where: { playerid: transformedData.playerid },
          update: transformedData,
          create: transformedData,
        })
      );

      // Process in batches
      if (batch.length >= BATCH_SIZE) {
        await prisma.$transaction(batch);
        count += batch.length;
        console.log(`Processed ${count} records...`);
        batch = [];
      }
    } catch (err) {
      errors.push({ playerid: row.playerid, error: err.message });
      console.error(`Error processing playerid ${row.playerid}:`, err.message);
    }
  }

  // Process remaining records
  if (batch.length > 0) {
    try {
      await prisma.$transaction(batch);
      count += batch.length;
    } catch (err) {
      console.error("Error processing final batch:", err.message);
    }
  }

  // Log summary
  console.log(`\nImport Summary:`);
  console.log(`Successfully loaded ${count} players into SQLite`);
  if (errors.length > 0) {
    console.log(`Failed to process ${errors.length} records:`);
    errors.forEach(({ playerid, error }) => {
      console.log(`- Player ID ${playerid}: ${error}`);
    });
  }

  await prisma.$disconnect();
}

loadCsv().catch((err) => {
  console.error("Failed to load CSV:", err);
  process.exit(1);
});
