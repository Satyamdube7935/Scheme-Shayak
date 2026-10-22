/**
 * Seed catalog of Indian welfare / central schemes.
 * Eligibility is expressed as structured rules the engine can evaluate.
 */
module.exports = [
  {
    code: "PM-KISAN",
    name: "PM-Kisan Samman Nidhi",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    category: "Agriculture",
    description:
      "Income support of ₹6,000 per year to landholding farmer families, paid in three equal instalments.",
    benefits: "₹6,000 per year directly into the bank account.",
    officialUrl: "https://pmkisan.gov.in/",
    documentsRequired: ["Aadhaar", "Land records", "Bank passbook"],
    tags: ["farmer", "income-support", "rural"],
    eligibility: [
      { field: "isFarmer", op: "eq", value: true, label: "Applicant should be a farmer" },
      { field: "landHoldingAcres", op: "gt", value: 0, label: "Should hold cultivable land" },
      { field: "occupation", op: "in", value: ["farmer", "agricultural labour"], label: "Occupation related to farming" }
    ]
  },
  {
    code: "PM-JAY",
    name: "Ayushman Bharat – PM-JAY",
    ministry: "Ministry of Health & Family Welfare",
    category: "Health",
    description:
      "Health insurance cover of up to ₹5 lakh per family per year for secondary and tertiary hospitalisation.",
    benefits: "Cashless treatment up to ₹5 lakh per family per year.",
    officialUrl: "https://nha.gov.in/PM-JAY",
    documentsRequired: ["Aadhaar", "Ration card"],
    tags: ["health", "insurance", "low-income"],
    eligibility: [
      { field: "annualIncome", op: "lte", value: 500000, label: "Annual household income typically up to ₹5 lakh" },
      { field: "rationCardType", op: "in", value: ["BPL", "AAY", "PHH"], label: "Priority / BPL ration card holders are preferred" }
    ]
  },
  {
    code: "PMAY-U",
    name: "Pradhan Mantri Awas Yojana – Urban",
    ministry: "Ministry of Housing and Urban Affairs",
    category: "Housing",
    description: "Credit-linked subsidy and housing assistance for urban households without pucca housing.",
    benefits: "Interest subsidy on home loan and support for a first pucca house.",
    officialUrl: "https://pmaymis.gov.in/",
    documentsRequired: ["Aadhaar", "Income certificate", "Address proof"],
    tags: ["housing", "urban", "ews", "lig"],
    eligibility: [
      { field: "ruralUrban", op: "eq", value: "urban", label: "Must reside in an urban area" },
      { field: "hasOwnHouse", op: "eq", value: false, label: "Should not already own a pucca house" },
      { field: "annualIncome", op: "lte", value: 1800000, label: "Household income within EWS / LIG / MIG limits" }
    ]
  },
  {
    code: "PMAY-G",
    name: "Pradhan Mantri Awas Yojana – Gramin",
    ministry: "Ministry of Rural Development",
    category: "Housing",
    description: "Financial assistance to rural households for construction of a pucca house with basic amenities.",
    benefits: "Unit assistance for constructing a pucca house in rural areas.",
    officialUrl: "https://pmayg.nic.in/",
    documentsRequired: ["Aadhaar", "SECC / Gram Sabha listing"],
    tags: ["housing", "rural"],
    eligibility: [
      { field: "ruralUrban", op: "eq", value: "rural", label: "Must reside in a rural area" },
      { field: "hasOwnHouse", op: "eq", value: false, label: "Should not already have a pucca house" }
    ]
  },
  {
    code: "UJJWALA",
    name: "Pradhan Mantri Ujjwala Yojana",
    ministry: "Ministry of Petroleum & Natural Gas",
    category: "Energy",
    description: "Free LPG connections to women from poor households to reduce indoor air pollution.",
    benefits: "Deposit-free LPG connection and first refill support as per scheme rules.",
    officialUrl: "https://www.pmuy.gov.in/",
    documentsRequired: ["Aadhaar", "BPL / priority ration card", "Bank account of woman applicant"],
    tags: ["women", "lpg", "energy"],
    eligibility: [
      { field: "gender", op: "eq", value: "female", label: "Connection is issued in the name of an adult woman" },
      { field: "hasLPG", op: "eq", value: false, label: "Household should not already have an LPG connection" },
      { field: "annualIncome", op: "lte", value: 300000, label: "Low-income / priority household" }
    ]
  },
  {
    code: "MGNREGA",
    name: "Mahatma Gandhi NREGA",
    ministry: "Ministry of Rural Development",
    category: "Employment",
    description: "Legal guarantee of 100 days of unskilled wage employment in a financial year to rural households.",
    benefits: "Wage employment for up to 100 days per rural household per year.",
    officialUrl: "https://nrega.nic.in/",
    documentsRequired: ["Aadhaar", "Job card"],
    tags: ["employment", "rural", "wages"],
    eligibility: [
      { field: "ruralUrban", op: "eq", value: "rural", label: "Must be a rural household" },
      { field: "age", op: "gte", value: 18, label: "Adult member willing to do unskilled manual work" }
    ]
  },
  {
    code: "NSAP-IGNOAPS",
    name: "Indira Gandhi National Old Age Pension",
    ministry: "Ministry of Rural Development",
    category: "Social security",
    description: "Monthly pension for elderly persons belonging to BPL households.",
    benefits: "Monthly old-age pension as per central and state contribution.",
    officialUrl: "https://nsap.nic.in/",
    documentsRequired: ["Aadhaar", "Age proof", "BPL / income certificate"],
    tags: ["pension", "elderly"],
    eligibility: [
      { field: "age", op: "gte", value: 60, label: "Age 60 years or above" },
      { field: "annualIncome", op: "lte", value: 150000, label: "Belonging to a low-income / BPL household" }
    ]
  },
  {
    code: "NSAP-IGNWPS",
    name: "Indira Gandhi National Widow Pension",
    ministry: "Ministry of Rural Development",
    category: "Social security",
    description: "Monthly pension for widows belonging to BPL households.",
    benefits: "Monthly widow pension as notified by the state.",
    officialUrl: "https://nsap.nic.in/",
    documentsRequired: ["Aadhaar", "Widow certificate / death certificate of spouse", "BPL card"],
    tags: ["pension", "widow", "women"],
    eligibility: [
      { field: "gender", op: "eq", value: "female", label: "Applicant should be a woman" },
      { field: "maritalStatus", op: "eq", value: "widow", label: "Marital status should be widow" },
      { field: "age", op: "gte", value: 40, label: "Age typically 40 years or above (state rules may vary)" },
      { field: "annualIncome", op: "lte", value: 150000, label: "Low-income / BPL household" }
    ]
  },
  {
    code: "NSAP-IGNDPS",
    name: "Indira Gandhi National Disability Pension",
    ministry: "Ministry of Rural Development",
    category: "Social security",
    description: "Monthly pension for persons with severe or multiple disabilities in BPL households.",
    benefits: "Monthly disability pension.",
    officialUrl: "https://nsap.nic.in/",
    documentsRequired: ["Aadhaar", "Disability certificate", "BPL / income certificate"],
    tags: ["pension", "disability"],
    eligibility: [
      { field: "hasDisability", op: "eq", value: true, label: "Person with benchmark disability" },
      { field: "disabilityPercent", op: "gte", value: 80, label: "Severe disability (80% or more) for NSAP central component" },
      { field: "annualIncome", op: "lte", value: 150000, label: "Low-income / BPL household" }
    ]
  },
  {
    code: "NSP-POSTMATRIC",
    name: "Post-Matric Scholarship (SC/ST/OBC)",
    ministry: "Ministry of Social Justice / Tribal Affairs",
    category: "Education",
    description: "Financial assistance for students from notified categories pursuing post-matric education.",
    benefits: "Tuition and maintenance allowance as per course and category.",
    officialUrl: "https://scholarships.gov.in/",
    documentsRequired: ["Aadhaar", "Caste certificate", "Income certificate", "Bonafide / marksheet"],
    tags: ["student", "scholarship", "education"],
    eligibility: [
      { field: "isStudent", op: "eq", value: true, label: "Must be a student" },
      { field: "educationLevel", op: "in", value: ["12th", "diploma", "undergraduate", "postgraduate"], label: "Pursuing post-matric education" },
      { field: "category", op: "in", value: ["SC", "ST", "OBC"], label: "Belong to SC, ST or OBC" },
      { field: "annualIncome", op: "lte", value: 250000, label: "Family income within scholarship ceiling" }
    ]
  },
  {
    code: "SUKANYA",
    name: "Sukanya Samriddhi Yojana",
    ministry: "Ministry of Finance",
    category: "Savings",
    description: "Small-savings scheme for the girl child with attractive interest and tax benefits.",
    benefits: "High interest small-savings account until the girl turns 21.",
    officialUrl: "https://www.nsiindia.gov.in/",
    documentsRequired: ["Aadhaar of girl / guardian", "Birth certificate"],
    tags: ["girl-child", "savings"],
    eligibility: [
      { field: "gender", op: "eq", value: "female", label: "Account is for a girl child" },
      { field: "age", op: "lte", value: 10, label: "Girl should generally be 10 years or younger at opening" }
    ]
  },
  {
    code: "PM-SVANIDHI",
    name: "PM Street Vendor's AtmaNirbhar Nidhi",
    ministry: "Ministry of Housing and Urban Affairs",
    category: "Livelihood",
    description: "Affordable working-capital loan for street vendors.",
    benefits: "Working capital loan starting ₹10,000 with interest subsidy and digital-payment incentives.",
    officialUrl: "https://pmsvanidhi.mohua.gov.in/",
    documentsRequired: ["Aadhaar", "Vendor certificate / Letter of Recommendation"],
    tags: ["street-vendor", "loan", "urban"],
    eligibility: [
      { field: "occupation", op: "eq", value: "street vendor", label: "Applicant should be a street vendor" },
      { field: "age", op: "gte", value: 18, label: "Adult applicant" }
    ]
  },
  {
    code: "PMEGP",
    name: "Prime Minister's Employment Generation Programme",
    ministry: "Ministry of MSME",
    category: "Livelihood",
    description: "Credit-linked subsidy to set up micro-enterprises in the non-farm sector.",
    benefits: "Margin money subsidy on bank-financed projects.",
    officialUrl: "https://www.kviconline.gov.in/pmegpeportal/",
    documentsRequired: ["Aadhaar", "Project report", "Caste / special category certificate if applicable"],
    tags: ["msme", "self-employed", "subsidy"],
    eligibility: [
      { field: "age", op: "gte", value: 18, label: "Minimum age 18 years" },
      { field: "occupation", op: "in", value: ["unemployed", "self-employed", "homemaker"], label: "Suitable for those wanting to start a micro-enterprise" },
      { field: "educationLevel", op: "in", value: ["8th", "10th", "12th", "diploma", "undergraduate", "postgraduate"], label: "VIII pass for manufacturing projects above a threshold" }
    ]
  },
  {
    code: "ATAL-PENSION",
    name: "Atal Pension Yojana",
    ministry: "Ministry of Finance",
    category: "Social security",
    description: "Guaranteed pension scheme for workers in the unorganised sector.",
    benefits: "Guaranteed monthly pension of ₹1,000 to ₹5,000 after age 60.",
    officialUrl: "https://www.npscra.nsdl.co.in/",
    documentsRequired: ["Aadhaar", "Bank account / savings account"],
    tags: ["pension", "unorganised"],
    eligibility: [
      { field: "age", op: "gte", value: 18, label: "Age between 18 and 40 at joining" },
      { field: "age", op: "lte", value: 40, label: "Age not more than 40 years at joining" },
      { field: "hasBankAccount", op: "eq", value: true, label: "Must have a savings bank account" }
    ]
  },
  {
    code: "PM-VISHWAKARMA",
    name: "PM Vishwakarma",
    ministry: "Ministry of Micro, Small and Medium Enterprises",
    category: "Livelihood",
    description: "Support for traditional artisans and craftspeople with skill training, toolkit and credit.",
    benefits: "Toolkit incentive, skill training, and collateral-free credit.",
    officialUrl: "https://pmvishwakarma.gov.in/",
    documentsRequired: ["Aadhaar", "Artisan self-declaration"],
    tags: ["artisan", "skill", "credit"],
    eligibility: [
      { field: "occupation", op: "in", value: ["artisan", "self-employed"], label: "Traditional artisan / craftsperson" },
      { field: "age", op: "gte", value: 18, label: "Adult artisan" }
    ]
  },
  {
    code: "KCC",
    name: "Kisan Credit Card",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    category: "Agriculture",
    description: "Short-term credit for cultivation, post-harvest and farm-related needs.",
    benefits: "Flexible farm credit at concessional interest with prompt-repayment incentive.",
    officialUrl: "https://www.nabard.org/",
    documentsRequired: ["Aadhaar", "Land records", "Bank KYC"],
    tags: ["farmer", "credit"],
    eligibility: [
      { field: "isFarmer", op: "eq", value: true, label: "Farmer, tenant farmer or sharecropper" },
      { field: "hasBankAccount", op: "eq", value: true, label: "Bank account required to issue KCC" }
    ]
  },
  {
    code: "E-SHRAM",
    name: "e-Shram registration benefits",
    ministry: "Ministry of Labour & Employment",
    category: "Labour",
    description: "National database of unorganised workers enabling access to social security schemes.",
    benefits: "Universal Account Number and gateway to social security and accidental insurance benefits.",
    officialUrl: "https://eshram.gov.in/",
    documentsRequired: ["Aadhaar", "Bank account", "Mobile number"],
    tags: ["labour", "unorganised"],
    eligibility: [
      { field: "age", op: "gte", value: 16, label: "Age 16 to 59" },
      { field: "age", op: "lte", value: 59, label: "Below 60 years" },
      { field: "occupation", op: "in", value: ["unemployed", "self-employed", "agricultural labour", "street vendor", "artisan"], label: "Unorganised / informal worker" }
    ]
  },
  {
    code: "NSP-MINORITY",
    name: "Merit-cum-Means Scholarship for Minorities",
    ministry: "Ministry of Minority Affairs",
    category: "Education",
    description: "Scholarship for students from notified minority communities pursuing professional / technical courses.",
    benefits: "Course fee and maintenance allowance.",
    officialUrl: "https://scholarships.gov.in/",
    documentsRequired: ["Aadhaar", "Minority community certificate", "Income certificate"],
    tags: ["student", "scholarship", "minority"],
    eligibility: [
      { field: "isStudent", op: "eq", value: true, label: "Must be a student" },
      { field: "category", op: "eq", value: "Minority", label: "Belong to a notified minority community" },
      { field: "annualIncome", op: "lte", value: 250000, label: "Parental income not exceeding ₹2.5 lakh" }
    ]
  }
];
