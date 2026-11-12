// ─── Company Data ────────────────────────────────────────────────────────────

export const COMPANY_INFO = {
  name: "ISM Data Technology",
  tagline: "Delivering Trusted Global Data Solutions",
  description:
    "Transforming global data needs while uplifting rural women professionals.",
  email: "official@ismdatatech.com",
  hrEmail: "hr@ismdatatech.com",
  website: "https://ismdatatech.com",
  launchDate: "22 Aug 2024",
  operationsHours: "Operations 24/7 (3 shifts) · Sales desk Mon–Sat 9 AM–6 PM IST",
  founder: {
    name: "Mr. Muthu Kulathur",
    title: "Founder & CEO",
  },
  address: {
    line1: "Selva Complex, V.A Nagar",
    line2: "Kadayam Road, Pavoorchatram",
    city: "Tenkasi",
    state: "Tamil Nadu",
    country: "India",
    full: "Selva Complex, V.A Nagar, Kadayam Road, Pavoorchatram, Tenkasi, Tamil Nadu, India",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3941.9!2d77.4!3d8.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOCw!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin",
    mapsUrl:
      "https://www.google.com/maps/search/Selva+Complex+VA+Nagar+Kadayam+Road+Pavoorchatram+Tenkasi+Tamil+Nadu",
    lat: 8.9167,
    lng: 77.4,
  },
  stats: [
    { value: 98, suffix: "%", label: "Quality Delivery" },
    { value: 3, suffix: "+", label: "International Partners" },
    { value: 100, suffix: "%", label: "Skilled Employees" },
    { value: 24, suffix: " hrs", label: "Operations (3 shifts)" },
  ],
  social: {
  linkedin: "https://www.linkedin.com/company/ism-data-technology/",
  instagram: "https://www.instagram.com/ism_data_technology/",
},
  businessHours: "Monday – Saturday: 9:00 AM – 6:00 PM IST",
};

// ─── Services ────────────────────────────────────────────────────────────────

export const SERVICE_PILLARS = [
  {
    id: "ai-data-annotation",
    title: "AI Data & Annotation",
    description: "Prepare and label data for machine-learning and structured information workflows.",
  },
  {
    id: "healthcare-medical-billing",
    title: "Healthcare & Medical Billing",
    description: "Support healthcare record and medical billing workflows with careful data handling.",
  },
  {
    id: "document-archive-digitisation",
    title: "Document & Archive Digitisation",
    description: "Convert, organise, and index documents and historical records for digital use.",
  },
  {
    id: "voice-customer-support",
    title: "Voice & Customer Support",
    description: "Assist customers and client teams through voice and blended communication workflows.",
  },
  {
    id: "it-software-development",
    title: "IT & Software Development",
    description: "Build software and process structured data to support business workflows.",
  },
] as const;

export type ServicePillarId = (typeof SERVICE_PILLARS)[number]["id"];

export interface ServiceScreenshot {
  src: string;
  alt: string;
}

export interface Service {
  id: string;
  title: string;
  pillar: ServicePillarId;
  description: string;
  icon: string;
  capabilities?: string[];
  screenshots?: ServiceScreenshot[];
}

export const SERVICES: Service[] = [
  {
    id: "ai-data-annotation",
    title: "AI Data Collection & Annotation",
    pillar: "ai-data-annotation",
    description:
      "Collect, classify, and label text or image data for machine-learning workflows, with quality checks to support consistent training datasets.",
    icon: "Database",
    capabilities: [
      "Image and text labelling",
      "Data classification and tagging",
      "Named entity and sentiment annotation",
      "Quality checks for training datasets",
    ],
  },
  {
    id: "video-annotation",
    title: "Video Annotation",
    pillar: "ai-data-annotation",
    description:
      "Label video frames for computer-vision workflows, including objects, movement, and events, to prepare footage for analysis.",
    icon: "FileCheck",
    capabilities: [
      "Frame-by-frame object labelling",
      "Bounding boxes and object tracking",
      "Segmentation and event classification",
    ],
  },
  {
    id: "spanish-data",
    title: "Spanish Data Projects",
    pillar: "ai-data-annotation",
    description:
      "Enter and organise Spanish-language records with attention to language-specific fields and consistent formatting.",
    icon: "Languages",
  },
  {
    id: "australian-leads",
    title: "Australian Business Leads Collection",
    pillar: "ai-data-annotation",
    description:
      "Identify and verify Australian business contacts for targeted B2B outreach.",
    icon: "Target",
  },
  {
    id: "australian-business-data",
    title: "Australian Business Data Research",
    pillar: "ai-data-annotation",
    description:
      "Research and structure Australian business information from selected sources to support market analysis.",
    icon: "Globe",
  },
  {
    id: "healthcare",
    title: "Healthcare Data Entry",
    pillar: "healthcare-medical-billing",
    description:
      "Enter and validate healthcare records with careful handling of sensitive information, helping teams keep data organised.",
    icon: "HeartPulse",
  },
  {
    id: "medical-billing",
    title: "Medical Billing",
    pillar: "healthcare-medical-billing",
    description:
      "Provide back-office support for medical billing operations in partnership with Exela Technologies, helping keep billing workflows organised.",
    icon: "Receipt",
  },
  {
    id: "epub",
    title: "EPUB Services",
    pillar: "document-archive-digitisation",
    description:
      "Convert and format digital books into EPUB to make content easier to publish and read across supported devices.",
    icon: "BookOpen",
  },
  {
    id: "filipino-data",
    title: "Filipino Civil Registry Data Entry",
    pillar: "document-archive-digitisation",
    description:
      "Enter and verify birth, marriage, and death records to support accurate civil registry digitisation.",
    icon: "FileCheck",
  },
  {
    id: "sri-lanka-data",
    title: "Sri Lanka Data Projects",
    pillar: "document-archive-digitisation",
    description:
      "Process government, business, and financial documents from Sri Lankan projects into organised digital records.",
    icon: "Database",
  },
  {
    id: "baptism-records",
    title: "Indexing Handwritten Baptism Records",
    pillar: "document-archive-digitisation",
    description:
      "Transcribe and index handwritten baptism records to make historical archives easier to search and preserve.",
    icon: "Archive",
  },
  {
    id: "burial-records",
    title: "Burial Records Projects",
    pillar: "document-archive-digitisation",
    description:
      "Transcribe handwritten burial records into searchable digital indexes for preservation and research.",
    icon: "ScrollText",
  },
  {
    id: "vital-records-usa",
    title: "Vital Records Processing – USA",
    pillar: "document-archive-digitisation",
    description:
      "Convert birth, death, and marriage certificates into structured records for administrative workflows.",
    icon: "FileText",
  },
  {
    id: "newspaper-zoning",
    title: "Newspaper Zoning Projects",
    pillar: "document-archive-digitisation",
    description:
      "Classify newspaper content by page and section to make archived material easier to organise and retrieve.",
    icon: "Newspaper",
  },
  {
    id: "books-extraction",
    title: "Printed English Books Extraction",
    pillar: "document-archive-digitisation",
    description:
      "Extract structured text and data from printed English books, reducing manual re-entry and preparing content for reuse.",
    icon: "BookMarked",
  },
  {
    id: "usa-docs",
    title: "USA Documentation",
    pillar: "document-archive-digitisation",
    description:
      "Organise USA-related documents into consistent digital records to support reliable retrieval and data checks.",
    icon: "FileStack",
  },
  {
    id: "typing-projects",
    title: "Typing Projects",
    pillar: "document-archive-digitisation",
    description:
      "Transcribe supplied content into clean, consistently formatted documents to reduce manual data-entry work.",
    icon: "Keyboard",
  },
  {
    id: "tax-voice",
    title: "International Voice Support (UK & USA Tax Filing)",
    pillar: "voice-customer-support",
    description:
      "Support UK and US tax-filing workflows through voice-based client communication and process assistance.",
    icon: "Phone",
  },
  {
    id: "debit-support",
    title: "International Semi-Voice (Debit Support)",
    pillar: "voice-customer-support",
    description:
      "Assist customers with debit-related account queries through a mix of phone conversations and non-voice follow-up.",
    icon: "CreditCard",
  },
  {
    id: "xml-processing",
    title: "XML Processing",
    pillar: "it-software-development",
    description:
      "Convert, validate, and structure XML data to support reliable exchange between systems.",
    icon: "Code2",
  },
  {
    id: "software-development",
    title: "Custom Software Development",
    pillar: "it-software-development",
    description:
      "Develop and maintain custom software around agreed business requirements, helping streamline workflows and connect internal tools.",
    icon: "Code2",
    screenshots: [],
  },
];

export const OTHER_SERVICE_OPTION = "Other / Multiple Services";

// ─── Testimonials ─────────────────────────────────────────────────────────────

export const TESTIMONIALS = [
  {
    id: 1,
    quote:
      "This was a difficult project but ISM data tech did a great job and communicated progress throughout as I requested. Excellent worker. They were very focused on the task. I'll hire again when I have another project.",
    name: "Rob S",
    location: "Phoenix, United States",
    rating: 5,
    initials: "RS",
  },
  {
    id: 2,
    quote:
      "ISM data tech is an excellent freelancer you can completely rely on. You can hire them with confidence and will be very pleased with his work. Their communication skills are outstanding, and they deliver the job as expected. I will definitely work again with ISM data tech in the future.",
    name: "Victor B",
    location: "Montreuil, France",
    rating: 5,
    initials: "VB",
  },
  {
    id: 3,
    quote:
      "Great on time project completion. On time and really quick. Professional worker.",
    name: "J G",
    location: "Sydney, Australia",
    rating: 5,
    initials: "JG",
  },
];

// ─── Life at ISM ──────────────────────────────────────────────────────────────

export const LIFE_AT_ISM = [
  {
    title: "Brainstorming",
    description:
      "Innovative ideas and creative thinking sessions that spark solutions.",
    image: "/images/life/brainstorming.jpg",
    placeholder: "bg-gradient-to-br from-blue-900 to-cyan-900",
  },
  {
    title: "Cultural Events",
    description:
      "Celebrating diversity with vibrant festivals and traditions at work.",
    image: "/images/life/cultural.jpg",
    placeholder: "bg-gradient-to-br from-purple-900 to-blue-900",
  },
  {
    title: "Team Outing",
    description:
      "Building stronger bonds through adventures, trips, and shared experiences.",
    image: "/images/life/outing.jpg",
    placeholder: "bg-gradient-to-br from-teal-900 to-blue-900",
  },
  {
    title: "Workplace Fun",
    description: "Games, laughter, and activities that make every day enjoyable.",
    image: "/images/life/fun.jpg",
    placeholder: "bg-gradient-to-br from-blue-900 to-indigo-900",
  },
];

// ─── Timeline ────────────────────────────────────────────────────────────────

export const TIMELINE = [
  {
    year: "Aug 2024",
    title: "Company Founded",
    description:
      "ISM Data Technology was officially launched on 22 August 2024, with a clear vision to deliver global data solutions from India.",
  },
  {
    year: "Late 2024",
    title: "First International Partnerships",
    description:
      "Secured first international client partnerships across the United States, France, and Australia, establishing our global reach.",
  },
  {
    year: "2025",
    title: "Expanding Operations",
    description:
      "Scaled our team of skilled professionals, expanded service offerings, and deepened our commitment to rural women empowerment.",
  },
];

// ─── Why Choose ISM ───────────────────────────────────────────────────────────

export const WHY_CHOOSE = [
    {
    icon: "FileCheck",
    title: "NDA & Confidentiality",
    description:
      "Non-Disclosure Agreements help protect confidential client information and business data.",
  },
  {
    icon: "LockKeyhole",
    title: "Controlled Access",
    description:
      "Access to work areas and information is controlled to help protect client data.",
  },
  {
    icon: "Video",
    title: "CCTV Monitoring",
    description:
      "Workplace areas are monitored through CCTV as part of our physical security practices.",
  },
  {
    icon: "Smartphone",
    title: "No-Phone Floor Policy",
    description:
      "Personal phones are restricted in designated work areas to support a secure working environment.",
  },
];

// ─── Client Locations ─────────────────────────────────────────────────────────

export const CLIENT_LOCATIONS = [
  {
    country: "United States",
    description: "Voice support, documentation, vital records, and more.",
  },
  {
    country: "United Kingdom",
    description: "Voice support for UK tax-filing workflows.",
  },
  {
    country: "France",
    description: "Data processing and business support services.",
  },
  {
    country: "Australia",
    description: "Business leads and data collection projects.",
  },
];
