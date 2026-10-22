const fs = require("fs");
const path = require("path");
const Tesseract = require("tesseract.js");

function ageFromDob(dob) {
  const match = String(dob).match(/(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})/);
  if (!match) return null;
  const [, d, m, y] = match;
  const birth = new Date(Number(y), Number(m) - 1, Number(d));
  if (Number.isNaN(birth.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const md = now.getMonth() - birth.getMonth();
  if (md < 0 || (md === 0 && now.getDate() < birth.getDate())) age -= 1;
  return age;
}

function parseAadhaar(text) {
  const fields = {};
  const aadhaar = text.match(/\b(\d{4}\s\d{4}\s\d{4}|\d{12})\b/);
  if (aadhaar) fields.aadhaarLast4 = aadhaar[1].replace(/\s/g, "").slice(-4);
  const dob = text.match(/\b(\d{2}[\/\-]\d{2}[\/\-]\d{4})\b/);
  if (dob) {
    fields.dateOfBirth = dob[1];
    fields.age = ageFromDob(dob[1]);
  }
  if (/\bmale\b/i.test(text) && !/\bfemale\b/i.test(text)) fields.gender = "male";
  else if (/\bfemale\b/i.test(text)) fields.gender = "female";
  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
    "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
    "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"
  ];
  const found = states.find((s) => new RegExp(s, "i").test(text));
  if (found) fields.state = found;
  const nameLine = text.split("\n").map((l) => l.trim()).find((l) =>
    l.length > 6 && /^[A-Za-z][A-Za-z .]+$/.test(l) && !/government|aadhaar|uidai|india|male|female/i.test(l)
  );
  if (nameLine) fields.fullName = nameLine;
  return fields;
}

function parsePan(text) {
  const fields = {};
  const pan = text.match(/\b([A-Z]{5}[0-9]{4}[A-Z])\b/i);
  if (pan) fields.pan = pan[1].toUpperCase();
  const nameLine = text.split("\n").map((l) => l.trim()).find((l) =>
    l.length > 6 && /^[A-Za-z][A-Za-z .]+$/.test(l) && !/income|tax|department|govt|permanent/i.test(l)
  );
  if (nameLine) fields.fullName = nameLine;
  return fields;
}

function parseIncome(text) {
  const fields = {};
  const amounts = [...text.matchAll(/(?:rs\.?|₹|inr)\s*([0-9][0-9,]{2,})/gi)].map((m) =>
    Number(m[1].replace(/,/g, ""))
  );
  if (amounts.length) fields.annualIncome = Math.max(...amounts);
  return fields;
}

function parseCaste(text) {
  const fields = {};
  if (/\bscheduled\s+caste\b|\b\bsc\b/i.test(text)) fields.category = "SC";
  else if (/\bscheduled\s+tribe\b|\bst\b/i.test(text)) fields.category = "ST";
  else if (/\bother\s+backward|\bobc\b/i.test(text)) fields.category = "OBC";
  else if (/\bews\b|economically weaker/i.test(text)) fields.category = "EWS";
  else if (/\bminority\b/i.test(text)) fields.category = "Minority";
  return fields;
}

function parseDisability(text) {
  const fields = { hasDisability: true };
  const pct = text.match(/(\d{1,3})\s*%/);
  if (pct) fields.disabilityPercent = Math.min(100, Number(pct[1]));
  return fields;
}

function parseRation(text) {
  const fields = {};
  if (/\bantyodaya\b|\baay\b/i.test(text)) fields.rationCardType = "AAY";
  else if (/\bbpl\b|below poverty/i.test(text)) fields.rationCardType = "BPL";
  else if (/\bpriority\b|\bphh\b/i.test(text)) fields.rationCardType = "PHH";
  else if (/\bapl\b|above poverty/i.test(text)) fields.rationCardType = "APL";
  if (/\brural\b/i.test(text)) fields.ruralUrban = "rural";
  if (/\burban\b/i.test(text)) fields.ruralUrban = "urban";
  return fields;
}

function parseLand(text) {
  const fields = { isFarmer: true };
  const acres = text.match(/(\d+(?:\.\d+)?)\s*(acre|hectares?|ha)\b/i);
  if (acres) {
    const n = Number(acres[1]);
    fields.landHoldingAcres = /hect|ha/i.test(acres[2]) ? n * 2.47 : n;
  }
  fields.occupation = "farmer";
  return fields;
}

function parseByType(type, text) {
  switch (type) {
    case "aadhaar":
      return parseAadhaar(text);
    case "pan":
      return parsePan(text);
    case "income_certificate":
      return parseIncome(text);
    case "caste_certificate":
      return parseCaste(text);
    case "disability_certificate":
      return parseDisability(text);
    case "ration_card":
      return parseRation(text);
    case "land_record":
      return parseLand(text);
    default:
      return { ...parseAadhaar(text), ...parseIncome(text) };
  }
}

async function extractText(filePath, mimeType) {
  if (mimeType === "application/pdf") {
    const pdfParse = require("pdf-parse");
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    if (data.text && data.text.trim().length > 20) return data.text;
  }
  const { data } = await Tesseract.recognize(filePath, "eng");
  return data.text || "";
}

function applyFieldsToProfile(profile, fields) {
  const next = { ...profile };
  const map = [
    "fullName",
    "dateOfBirth",
    "age",
    "gender",
    "state",
    "annualIncome",
    "category",
    "hasDisability",
    "disabilityPercent",
    "rationCardType",
    "ruralUrban",
    "isFarmer",
    "landHoldingAcres",
    "occupation"
  ];
  for (const key of map) {
    if (fields[key] !== undefined && fields[key] !== null && fields[key] !== "") {
      next[key] = fields[key];
    }
  }
  return next;
}

module.exports = { extractText, parseByType, applyFieldsToProfile, ageFromDob };
