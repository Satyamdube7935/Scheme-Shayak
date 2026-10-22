const FIELD_LABELS = {
  age: "age",
  gender: "gender",
  ruralUrban: "rural/urban residence",
  category: "social category",
  annualIncome: "annual income",
  occupation: "occupation",
  maritalStatus: "marital status",
  hasDisability: "disability status",
  disabilityPercent: "disability percentage",
  isFarmer: "farmer status",
  landHoldingAcres: "land holding",
  isStudent: "student status",
  educationLevel: "education level",
  hasOwnHouse: "own house",
  hasLPG: "LPG connection",
  hasBankAccount: "bank account",
  rationCardType: "ration card type"
};

function isEmpty(value) {
  return value === null || value === undefined || value === "";
}

function checkRule(profile, rule) {
  const actual = profile[rule.field];
  const expected = rule.value;

  if (isEmpty(actual) && actual !== false && actual !== 0) {
    return { status: "unknown", reason: rule.label, missing: FIELD_LABELS[rule.field] || rule.field };
  }

  let pass = false;
  switch (rule.op) {
    case "eq":
      pass = actual === expected;
      break;
    case "neq":
      pass = actual !== expected;
      break;
    case "gte":
      pass = Number(actual) >= Number(expected);
      break;
    case "lte":
      pass = Number(actual) <= Number(expected);
      break;
    case "gt":
      pass = Number(actual) > Number(expected);
      break;
    case "lt":
      pass = Number(actual) < Number(expected);
      break;
    case "in":
      pass = Array.isArray(expected) && expected.map(String).includes(String(actual));
      break;
    default:
      pass = false;
  }

  return {
    status: pass ? "pass" : "fail",
    reason: rule.label
  };
}

function occupationBoost(profile, scheme) {
  const occ = (profile.occupation || "").toLowerCase();
  const tags = (scheme.tags || []).join(" ");
  if (!occ) return 0;
  if (tags.includes(occ.replace(/\s+/g, "-"))) return 12;
  if (scheme.name.toLowerCase().includes(occ)) return 8;
  return 0;
}

function documentBoost(user, scheme) {
  const docs = (user.documents || []).map((d) => d.type);
  let bonus = 0;
  if (docs.includes("aadhaar")) bonus += 4;
  if (scheme.documentsRequired?.some((d) => /income/i.test(d)) && docs.includes("income_certificate")) bonus += 6;
  if (scheme.documentsRequired?.some((d) => /caste|category/i.test(d)) && docs.includes("caste_certificate")) bonus += 6;
  if (scheme.documentsRequired?.some((d) => /disab/i.test(d)) && docs.includes("disability_certificate")) bonus += 8;
  if (scheme.documentsRequired?.some((d) => /land/i.test(d)) && docs.includes("land_record")) bonus += 6;
  if (scheme.documentsRequired?.some((d) => /ration/i.test(d)) && docs.includes("ration_card")) bonus += 5;
  return bonus;
}

function explain(scheme, { eligible, status, matched, failed, missing, score }) {
  if (status === "needs_more_info") {
    return `${scheme.name} could be relevant, but the profile is missing: ${missing.join(", ")}. Fill these fields or upload supporting documents to complete the check.`;
  }
  if (eligible) {
    return `Ranked with score ${score}/100. Matched criteria: ${matched.join("; ") || "profile overlap with scheme tags"}.`;
  }
  return `Not currently eligible. Unmet criteria: ${failed.join("; ")}.`;
}

function evaluateScheme(user, scheme) {
  const profile = user.profile || {};
  const matched = [];
  const failed = [];
  const missing = [];

  for (const rule of scheme.eligibility || []) {
    const result = checkRule(profile, rule);
    if (result.status === "pass") matched.push(result.reason);
    else if (result.status === "fail") failed.push(result.reason);
    else if (result.missing && !missing.includes(result.missing)) missing.push(result.missing);
  }

  let status;
  let eligible = false;
  if (failed.length > 0) {
    status = "not_eligible";
  } else if (missing.length > 0 && matched.length === 0) {
    status = "needs_more_info";
  } else if (missing.length > 0) {
    status = "needs_more_info";
  } else {
    status = "eligible";
    eligible = true;
  }

  const ruleScore = scheme.eligibility?.length
    ? Math.round((matched.length / scheme.eligibility.length) * 70)
    : 40;
  const score = Math.min(
    100,
    ruleScore + occupationBoost(profile, scheme) + documentBoost(user, scheme) + (eligible ? 10 : 0)
  );

  return {
    schemeId: scheme._id,
    code: scheme.code,
    name: scheme.name,
    ministry: scheme.ministry,
    category: scheme.category,
    description: scheme.description,
    benefits: scheme.benefits,
    officialUrl: scheme.officialUrl,
    documentsRequired: scheme.documentsRequired,
    tags: scheme.tags,
    eligible,
    status,
    score,
    matchedRules: matched,
    failedRules: failed,
    missingFields: missing,
    explanation: explain(scheme, { eligible, status, matched, failed, missing, score })
  };
}

function recommend(user, schemes) {
  const results = schemes.map((scheme) => evaluateScheme(user, scheme));
  const rankOrder = { eligible: 0, needs_more_info: 1, not_eligible: 2 };
  results.sort((a, b) => {
    const byStatus = rankOrder[a.status] - rankOrder[b.status];
    if (byStatus !== 0) return byStatus;
    return b.score - a.score;
  });
  return results;
}

module.exports = { recommend, evaluateScheme };
