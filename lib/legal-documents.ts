// Indian Legal Documents Dataset for Search System
export interface LegalDocument {
  id: string;
  title: string;
  content: string;
  category: 'Income Tax' | 'GST' | 'Court Judgment' | 'Property Law';
  section?: string;
  keywords: string[];
  entities: string[]; // Legal entities for hybrid similarity
}

export const LEGAL_DOCUMENTS: LegalDocument[] = [
  // Income Tax Act Documents
  {
    id: 'it_001',
    title: 'Section 80C - Deduction for Education',
    content: 'Section 80C of the Income Tax Act provides deduction for tuition fees paid for full-time education of any two children of the individual. The deduction is available for tuition fees paid to any university, college, school or other educational institution situated within India for the purpose of full-time education. The maximum deduction under this section is Rs. 1,50,000. The education loan interest under Section 80E provides additional deduction for interest paid on education loans taken for higher education.',
    category: 'Income Tax',
    section: '80C',
    keywords: ['deduction', 'education', 'tuition fees', 'children', 'school', 'college', 'university'],
    entities: ['Section 80C', 'Income Tax Act', 'education loan', 'Section 80E']
  },
  {
    id: 'it_002',
    title: 'Section 24 - House Property Income Deduction',
    content: 'Under Section 24 of the Income Tax Act, deduction is allowed for interest on borrowed capital for house property. For self-occupied property, the maximum deduction is Rs. 2,00,000 per annum. For let-out property, there is no maximum limit. Municipal taxes paid during the year are also deductible. Standard deduction of 30% is allowed from net annual value for repairs and maintenance.',
    category: 'Income Tax',
    section: '24',
    keywords: ['house property', 'interest', 'borrowed capital', 'self-occupied', 'let-out', 'municipal taxes'],
    entities: ['Section 24', 'Income Tax Act', 'house property', 'municipal taxes']
  },
  {
    id: 'it_003',
    title: 'Section 10 - Income Exemptions',
    content: 'Section 10 of the Income Tax Act provides various exemptions from income tax. These include agricultural income, HRA exemption, LTA exemption, gratuity exemption under Section 10(10), and other allowances. Agricultural income derived from land situated in India is completely exempt from income tax. House Rent Allowance is exempt subject to certain conditions and calculations.',
    category: 'Income Tax',
    section: '10',
    keywords: ['exemptions', 'agricultural income', 'HRA', 'LTA', 'gratuity', 'allowances'],
    entities: ['Section 10', 'Income Tax Act', 'HRA', 'LTA', 'agricultural income']
  },

  // GST Act Documents
  {
    id: 'gst_001',
    title: 'GST Rate for Textile Products',
    content: 'Textile products under GST are classified into different categories with varying tax rates. Cotton textiles generally attract 5% GST, while man-made fiber textiles attract 12% GST. Readymade garments are taxed at 12% GST. Luxury textiles like silk and branded garments may attract 18% GST. Export of textiles is zero-rated under GST. Input tax credit is available for GST paid on inputs used in textile manufacturing.',
    category: 'GST',
    section: 'Schedule I & II',
    keywords: ['textile', 'cotton', 'garments', 'silk', 'export', 'input tax credit', 'manufacturing'],
    entities: ['GST', 'textile products', 'input tax credit', 'zero-rated', 'Schedule I', 'Schedule II']
  },
  {
    id: 'gst_002',
    title: 'GST Registration Process',
    content: 'GST registration is mandatory for businesses with annual turnover exceeding Rs. 20 lakhs (Rs. 10 lakhs for special category states). Online registration is done through GST portal with required documents including PAN, address proof, bank account details, and digital signature. GSTIN (GST Identification Number) is issued upon successful registration. Composition scheme is available for small taxpayers with turnover up to Rs. 1.5 crores.',
    category: 'GST',
    section: 'Section 22',
    keywords: ['registration', 'turnover', 'online', 'GSTIN', 'composition scheme', 'documents'],
    entities: ['GST registration', 'GSTIN', 'PAN', 'composition scheme', 'Section 22']
  },
  {
    id: 'gst_003',
    title: 'Input Tax Credit Rules',
    content: 'Input Tax Credit (ITC) under GST allows set-off of tax paid on inputs against output tax liability. ITC is available only when the supplier has filed GST return and paid tax to the government. Time limit for claiming ITC is generally by 30th November of following financial year or filing of annual return, whichever is earlier. Blocked credits include GST on motor vehicles (except specified cases), food and beverages, and personal use items.',
    category: 'GST',
    section: 'Section 16',
    keywords: ['input tax credit', 'ITC', 'set-off', 'time limit', 'blocked credits', 'motor vehicles'],
    entities: ['Input Tax Credit', 'ITC', 'Section 16', 'annual return', 'blocked credits']
  },

  // Court Judgment Documents
  {
    id: 'cj_001',
    title: 'Court Fee Structure for Civil Cases',
    content: 'Court fees for civil cases are governed by the Court Fees Act, 1870. Ad valorem fees are calculated as percentage of suit value. For money suits, court fee is typically 1-7% of the claimed amount subject to minimum and maximum limits. Fixed fees apply for specific reliefs like injunctions, declarations, and possession suits. Additional process fees are charged for serving summons and notices. Appeal fees are generally 2-3 times the original court fee.',
    category: 'Court Judgment',
    section: 'Court Fees Act 1870',
    keywords: ['court fee', 'civil cases', 'ad valorem', 'suit value', 'injunction', 'appeal', 'summons'],
    entities: ['Court Fees Act 1870', 'ad valorem fees', 'civil cases', 'appeal fees']
  },
  {
    id: 'cj_002',
    title: 'Limitation Period for Various Suits',
    content: 'The Limitation Act, 1963 prescribes time limits for filing various legal suits. For money recovery suits, the limitation period is 3 years from the date when the right to sue accrues. For property possession suits, it is 12 years. For contract-related disputes, the period is 3 years from breach. Criminal cases have different limitation periods - 3 years for most offenses, 7 years for serious crimes. The court can condone delay in exceptional circumstances.',
    category: 'Court Judgment',
    section: 'Limitation Act 1963',
    keywords: ['limitation period', 'money recovery', 'possession', 'contract', 'criminal cases', 'condone delay'],
    entities: ['Limitation Act 1963', 'limitation period', 'right to sue', 'breach of contract']
  },
  {
    id: 'cj_003',
    title: 'Evidence Rules in Indian Courts',
    content: 'The Indian Evidence Act, 1872 governs admissibility of evidence in court proceedings. Primary evidence is original documents which are preferred over secondary evidence. Hearsay evidence is generally not admissible except in specific circumstances. Expert testimony is admissible on technical matters. Electronic evidence is governed by Information Technology Act provisions. Burden of proof lies on the party asserting a fact.',
    category: 'Court Judgment',
    section: 'Indian Evidence Act 1872',
    keywords: ['evidence', 'primary evidence', 'secondary evidence', 'hearsay', 'expert testimony', 'electronic evidence'],
    entities: ['Indian Evidence Act 1872', 'primary evidence', 'hearsay evidence', 'Information Technology Act']
  },

  // Property Law Documents
  {
    id: 'pl_001',
    title: 'Property Registration Process in India',
    content: 'Property registration in India is mandatory under the Registration Act, 1908 for transactions above Rs. 100. The process involves payment of stamp duty and registration fees, submission of required documents including sale deed, title documents, NOCs, and identity proofs. Registration must be done within 4 months of execution of documents. Online registration facilities are available in most states. Sub-registrar office handles the registration process.',
    category: 'Property Law',
    section: 'Registration Act 1908',
    keywords: ['property registration', 'stamp duty', 'registration fees', 'sale deed', 'title documents', 'sub-registrar'],
    entities: ['Registration Act 1908', 'stamp duty', 'sale deed', 'sub-registrar', 'NOCs']
  },
  {
    id: 'pl_002',
    title: 'Property Ownership Rights and Types',
    content: 'Property ownership in India includes freehold, leasehold, and cooperative ownership. Freehold gives absolute ownership rights including right to sell, mortgage, and lease. Leasehold ownership is for specified period with renewal options. Joint ownership can be as joint tenants or tenants-in-common. Women have equal inheritance rights under various personal laws. Property cards and revenue records establish ownership documentation.',
    category: 'Property Law',
    section: 'Transfer of Property Act 1882',
    keywords: ['ownership rights', 'freehold', 'leasehold', 'cooperative', 'joint ownership', 'inheritance', 'revenue records'],
    entities: ['Transfer of Property Act 1882', 'freehold', 'leasehold', 'joint tenants', 'property cards']
  },
  {
    id: 'pl_003',
    title: 'Property Tax and Municipal Laws',
    content: 'Property tax is levied by municipal corporations and panchayats on built-up properties. Tax is calculated based on Annual Rental Value (ARV) or Capital Value. Residential properties generally have lower tax rates compared to commercial properties. Exemptions are available for religious institutions, educational institutions, and charitable organizations. Property tax collections fund municipal services like water, sanitation, and roads.',
    category: 'Property Law',
    section: 'Municipal Laws',
    keywords: ['property tax', 'municipal corporation', 'annual rental value', 'commercial', 'residential', 'exemptions'],
    entities: ['property tax', 'municipal corporation', 'Annual Rental Value', 'ARV', 'panchayats']
  },

  // Additional Income Tax Documents
  {
    id: 'it_004',
    title: 'TDS Provisions and Rates',
    content: 'Tax Deducted at Source (TDS) under various sections of Income Tax Act ensures tax collection at source. TDS on salary is under Section 192, on professional fees under Section 194J (10%), on rent under Section 194I (10%), and on interest under Section 194A (10%). TDS certificates (Form 16/16A) must be issued to deductees. Online TDS payment and return filing is mandatory through TRACES portal.',
    category: 'Income Tax',
    section: '192, 194J, 194I, 194A',
    keywords: ['TDS', 'tax deducted at source', 'salary', 'professional fees', 'rent', 'interest', 'Form 16', 'TRACES'],
    entities: ['TDS', 'Section 192', 'Section 194J', 'Section 194I', 'Section 194A', 'Form 16', 'TRACES']
  },

  // Additional GST Documents
  {
    id: 'gst_004',
    title: 'GST Return Filing Requirements',
    content: 'GST return filing is mandatory for all registered taxpayers. GSTR-1 for outward supplies filed monthly/quarterly, GSTR-3B is monthly summary return with tax payment. Annual return GSTR-9 filed by December 31st. Composition taxpayers file quarterly GSTR-4. Late filing attracts penalty of Rs. 50 per day per return (CGST + SGST). Online filing through GST portal with digital signature or EVC.',
    category: 'GST',
    section: 'Section 39',
    keywords: ['GST returns', 'GSTR-1', 'GSTR-3B', 'GSTR-9', 'GSTR-4', 'penalty', 'digital signature'],
    entities: ['GSTR-1', 'GSTR-3B', 'GSTR-9', 'GSTR-4', 'GST portal', 'Section 39', 'EVC']
  },

  // Additional Court Judgment Documents
  {
    id: 'cj_004',
    title: 'Alternative Dispute Resolution Methods',
    content: 'Alternative Dispute Resolution (ADR) includes arbitration, mediation, and conciliation as alternatives to court litigation. Arbitration Act, 2015 governs arbitration proceedings with institutional and ad-hoc arbitration options. Mediation is voluntary process with neutral mediator facilitating settlement. Lok Adalat provides speedy disposal of cases with compromise settlements. ADR methods are cost-effective and time-saving compared to regular court proceedings.',
    category: 'Court Judgment',
    section: 'Arbitration Act 2015',
    keywords: ['alternative dispute resolution', 'ADR', 'arbitration', 'mediation', 'conciliation', 'Lok Adalat'],
    entities: ['Arbitration Act 2015', 'ADR', 'Lok Adalat', 'institutional arbitration', 'ad-hoc arbitration']
  },

  // Additional Property Law Documents  
  {
    id: 'pl_004',
    title: 'Real Estate Regulation Act (RERA)',
    content: 'Real Estate Regulation Act, 2016 regulates real estate sector and protects homebuyers interests. RERA registration is mandatory for projects above 500 sq mtrs or 8 apartments. Developers must deposit 70% of collections in escrow account. Buyers can file complaints with RERA Authority for project delays or defects. RERA mandates project approvals, timely completion, and quality standards. Penalties include project deregistration and criminal action.',
    category: 'Property Law',
    section: 'RERA 2016',
    keywords: ['RERA', 'real estate regulation', 'homebuyers', 'escrow account', 'project delays', 'registration'],
    entities: ['RERA', 'Real Estate Regulation Act 2016', 'RERA Authority', 'escrow account', 'homebuyers']
  }
];

// Test queries for evaluation
export const TEST_QUERIES = [
  {
    query: "Income tax deduction for education",
    expectedCategory: "Income Tax",
    relevantDocIds: ["it_001", "it_004"]
  },
  {
    query: "GST rate for textile products", 
    expectedCategory: "GST",
    relevantDocIds: ["gst_001"]
  },
  {
    query: "Property registration process",
    expectedCategory: "Property Law", 
    relevantDocIds: ["pl_001", "pl_004"]
  },
  {
    query: "Court fee structure",
    expectedCategory: "Court Judgment",
    relevantDocIds: ["cj_001"]
  }
];

export const LEGAL_CATEGORIES = ['Income Tax', 'GST', 'Court Judgment', 'Property Law'] as const; 