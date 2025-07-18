export interface TrainingArticle {
  id: string;
  title: string;
  content: string;
  category: 'Tech' | 'Finance' | 'Healthcare' | 'Sports' | 'Politics' | 'Entertainment';
}

export const CATEGORIES = ['Tech', 'Finance', 'Healthcare', 'Sports', 'Politics', 'Entertainment'] as const;

export const trainingData: TrainingArticle[] = [
  // Technology Articles
  {
    id: 'tech_1',
    title: 'Artificial Intelligence Revolutionizes Healthcare Diagnosis',
    content: 'Machine learning algorithms are transforming medical diagnosis by analyzing medical images with unprecedented accuracy. Deep learning models can now detect cancer cells, predict disease progression, and assist radiologists in making more precise diagnoses. These AI systems are trained on massive datasets of medical images and can identify patterns that human eyes might miss. The integration of AI in healthcare is reducing diagnostic errors and improving patient outcomes globally.',
    category: 'Tech'
  },
  {
    id: 'tech_2',
    title: 'Quantum Computing Breakthrough Achieves New Milestone',
    content: 'Researchers have achieved a significant breakthrough in quantum computing by successfully implementing error correction protocols that maintain quantum coherence for extended periods. This advancement brings us closer to practical quantum computers that could solve complex problems in cryptography, drug discovery, and climate modeling. The new quantum processors use superconducting qubits and advanced control systems to maintain stability.',
    category: 'Tech'
  },
  {
    id: 'tech_3',
    title: 'Blockchain Technology Transforms Supply Chain Management',
    content: 'Companies are implementing blockchain solutions to create transparent and immutable supply chains. This technology enables real-time tracking of products from manufacturing to delivery, reducing fraud and ensuring authenticity. Smart contracts automatically execute transactions when predefined conditions are met, streamlining logistics and reducing costs. The decentralized nature of blockchain provides security and trust in global trade.',
    category: 'Tech'
  },
  {
    id: 'tech_4',
    title: 'Next-Generation 6G Wireless Technology Development',
    content: 'Telecommunications companies are beginning research into 6G wireless technology that promises speeds up to 100 times faster than 5G. This next-generation network will enable new applications like holographic communications, advanced augmented reality, and real-time remote surgery. The technology will use terahertz frequencies and advanced antenna systems to achieve unprecedented data rates.',
    category: 'Tech'
  },
  {
    id: 'tech_5',
    title: 'Cybersecurity Advances Combat Evolving Threats',
    content: 'Security experts are developing AI-powered cybersecurity systems that can detect and respond to threats in real-time. These systems use machine learning to identify unusual patterns and potential attacks before they can cause damage. Zero-trust architecture and behavioral analytics are becoming standard practices to protect against sophisticated cyber threats targeting cloud infrastructure and IoT devices.',
    category: 'Tech'
  },

  // Finance Articles  
  {
    id: 'finance_1',
    title: 'Federal Reserve Announces Interest Rate Decision',
    content: 'The Federal Reserve has decided to maintain current interest rates at 5.25-5.50% following their latest policy meeting. Fed officials cited concerns about inflation persistence and labor market strength as key factors in their decision. The central bank indicated they will continue monitoring economic data closely before making future rate adjustments. Markets responded positively to the announcement with major indices gaining ground.',
    category: 'Finance'
  },
  {
    id: 'finance_2', 
    title: 'Cryptocurrency Market Sees Major Volatility',
    content: 'Bitcoin and other major cryptocurrencies experienced significant price swings this week as regulatory uncertainty continues to impact investor sentiment. The cryptocurrency market capitalization fluctuated by over 15% in a single trading session. Institutional investors remain cautious while retail traders drive much of the volume. Analysts attribute the volatility to ongoing regulatory discussions in major economies.',
    category: 'Finance'
  },
  {
    id: 'finance_3',
    title: 'Global Stock Markets Rally on Economic Data',
    content: 'International stock markets posted strong gains following the release of positive economic indicators from major economies. The S&P 500, FTSE 100, and Nikkei 225 all closed higher as investors showed renewed confidence in economic recovery. Manufacturing data exceeded expectations while unemployment figures showed continued improvement. The rally was broad-based across sectors with technology and financials leading gains.',
    category: 'Finance'
  },
  {
    id: 'finance_4',
    title: 'Banking Sector Adapts to Digital Transformation',
    content: 'Traditional banks are accelerating their digital transformation initiatives to compete with fintech companies. Mobile banking adoption has surged with over 80% of customers now using digital services for routine transactions. Banks are investing heavily in artificial intelligence for fraud detection and personalized financial advice. The shift to digital-first banking is reshaping branch networks and customer service strategies.',
    category: 'Finance'
  },
  {
    id: 'finance_5',
    title: 'ESG Investing Gains Momentum Among Institutional Investors',
    content: 'Environmental, Social, and Governance (ESG) criteria are becoming increasingly important factors in investment decisions. Institutional investors are allocating larger portions of portfolios to sustainable investments as returns demonstrate competitiveness with traditional strategies. ESG funds have attracted record inflows while companies with strong sustainability profiles command premium valuations in capital markets.',
    category: 'Finance'
  },

  // Healthcare Articles
  {
    id: 'healthcare_1',
    title: 'Gene Therapy Shows Promise for Rare Diseases',
    content: 'Clinical trials for new gene therapy treatments are showing remarkable success in treating previously incurable genetic disorders. Patients with inherited blindness, sickle cell disease, and muscular dystrophy are experiencing significant improvements. The therapy works by delivering functional genes to replace defective ones using modified viruses as delivery vehicles. Regulatory approval could make these treatments available within two years.',
    category: 'Healthcare'
  },
  {
    id: 'healthcare_2',
    title: 'Personalized Medicine Revolution Through Genomics',
    content: 'Healthcare providers are increasingly using genomic sequencing to tailor treatments to individual patients. By analyzing a patient\'s genetic makeup, doctors can predict which medications will be most effective and avoid adverse reactions. This personalized approach is particularly effective in cancer treatment where targeted therapies can significantly improve outcomes. The cost of genomic testing has decreased dramatically making it accessible to more patients.',
    category: 'Healthcare'
  },
  {
    id: 'healthcare_3',
    title: 'Telemedicine Adoption Transforms Patient Care',
    content: 'The widespread adoption of telemedicine has permanently changed how healthcare is delivered. Patients can now consult with specialists remotely, reducing travel time and increasing access to care. Remote monitoring devices allow continuous tracking of chronic conditions while AI-powered chatbots provide initial health assessments. Healthcare systems report improved efficiency and patient satisfaction with virtual care options.',
    category: 'Healthcare'
  },
  {
    id: 'healthcare_4',
    title: 'Breakthrough in Alzheimer\'s Disease Treatment',
    content: 'Researchers have developed a new treatment approach for Alzheimer\'s disease that targets the underlying causes rather than just symptoms. The therapy uses immunotherapy to clear amyloid plaques from the brain while protecting healthy neurons. Early clinical trials show cognitive improvement in patients and slower disease progression. The treatment represents a paradigm shift in Alzheimer\'s care and offers hope to millions of patients.',
    category: 'Healthcare'
  },
  {
    id: 'healthcare_5',
    title: 'Precision Surgery Enabled by Robotic Systems',
    content: 'Robotic surgical systems are enabling surgeons to perform increasingly complex procedures with greater precision and smaller incisions. The latest generation of surgical robots incorporates AI guidance and haptic feedback to enhance surgeon capabilities. Patients benefit from reduced recovery times, less scarring, and improved outcomes. Training programs are expanding to prepare more surgeons to use these advanced robotic systems.',
    category: 'Healthcare'
  },

  // Sports Articles
  {
    id: 'sports_1',
    title: 'World Cup Final Draws Record Global Audience',
    content: 'The FIFA World Cup final attracted a record-breaking global television audience of over 1.5 billion viewers. The match featured exceptional athleticism and dramatic moments that kept fans on the edge of their seats. Social media engagement reached unprecedented levels with millions of posts and reactions shared during the game. The tournament showcased the universal appeal of football and its ability to unite people across cultures.',
    category: 'Sports'
  },
  {
    id: 'sports_2',
    title: 'Olympic Games Preparation Intensifies',
    content: 'Athletes from around the world are in final preparations for the upcoming Olympic Games. Training facilities are operating at maximum capacity as competitors fine-tune their performances. New world records have been set in qualifying events, promising exciting competition. The host city has completed venue construction and is conducting final tests of all systems and security measures.',
    category: 'Sports'
  },
  {
    id: 'sports_3',
    title: 'Professional Basketball Season Reaches Playoffs',
    content: 'The professional basketball season has reached its most exciting phase as playoff competition intensifies. Star players are delivering outstanding performances while teams battle for championship advancement. Attendance figures have exceeded expectations with arenas filled to capacity. The competitive balance across teams has created unpredictable matchups and thrilling games for fans.',
    category: 'Sports'
  },
  {
    id: 'sports_4',
    title: 'Tennis Championship Features Rising Stars',
    content: 'This year\'s tennis championship is highlighting a new generation of players challenging established champions. Young athletes are bringing fresh energy and innovative playing styles to the sport. The tournament has featured several upset victories and marathon matches that have captivated audiences. Coaching techniques and sports science are contributing to improved player performance and longevity.',
    category: 'Sports'
  },
  {
    id: 'sports_5',
    title: 'Technology Integration Transforms Sports Analytics',
    content: 'Professional sports teams are leveraging advanced analytics and wearable technology to optimize player performance and injury prevention. Real-time data collection provides insights into player movement, fatigue levels, and tactical effectiveness. Machine learning algorithms analyze vast amounts of game data to identify patterns and strategic opportunities. This technological revolution is changing how coaches make decisions and players train.',
    category: 'Sports'
  },

  // Politics Articles
  {
    id: 'politics_1',
    title: 'International Climate Summit Reaches Historic Agreement',
    content: 'World leaders have reached a landmark agreement at the international climate summit to accelerate the transition to renewable energy. The accord includes binding commitments to reduce greenhouse gas emissions by 50% by 2030 and achieve net-zero emissions by 2050. Developing nations will receive increased financial support for clean energy infrastructure. The agreement represents the most ambitious global climate action plan to date.',
    category: 'Politics'
  },
  {
    id: 'politics_2',
    title: 'Trade Negotiations Conclude with New Partnership Agreement',
    content: 'After months of negotiations, trading partners have finalized a comprehensive economic partnership agreement that will reduce tariffs and increase market access. The deal covers trade in goods, services, and digital commerce while including provisions for labor rights and environmental protection. Economic analysts project the agreement will boost GDP growth and create new employment opportunities in participating countries.',
    category: 'Politics'
  },
  {
    id: 'politics_3',
    title: 'Electoral Reform Legislation Advances Through Parliament',
    content: 'Comprehensive electoral reform legislation is moving through the parliamentary process with bipartisan support. The bill includes measures to modernize voting systems, enhance election security, and improve voter access. Key provisions address campaign finance transparency, redistricting reforms, and expanded early voting opportunities. Civic groups have praised the legislation as strengthening democratic institutions.',
    category: 'Politics'
  },
  {
    id: 'politics_4',
    title: 'Foreign Policy Initiative Addresses Regional Security',
    content: 'Government officials have announced a new foreign policy initiative aimed at strengthening regional security cooperation and diplomatic relations. The strategy includes increased military cooperation, intelligence sharing, and economic partnerships with allied nations. Diplomatic efforts focus on conflict prevention and peaceful resolution of territorial disputes. The initiative represents a comprehensive approach to maintaining regional stability.',
    category: 'Politics'
  },
  {
    id: 'politics_5',
    title: 'Healthcare Policy Reform Debate Continues',
    content: 'Congressional debates over healthcare policy reform continue as lawmakers seek to address rising medical costs and insurance coverage gaps. Proposed legislation includes measures to lower prescription drug prices, expand insurance access, and improve mental health services. Stakeholders from medical associations, insurance companies, and patient advocacy groups are actively participating in the policy development process.',
    category: 'Politics'
  },

  // Entertainment Articles
  {
    id: 'entertainment_1',
    title: 'Blockbuster Film Breaks Opening Weekend Records',
    content: 'The latest superhero blockbuster has shattered opening weekend box office records, earning over $200 million domestically and $500 million worldwide. The film features cutting-edge visual effects, spectacular action sequences, and compelling character development that has resonated with audiences. Critics praise the movie\'s emotional depth and technical achievements. The success positions the studio for a strong year and sets up sequels in the franchise.',
    category: 'Entertainment'
  },
  {
    id: 'entertainment_2',
    title: 'Streaming Platform Announces Original Content Expansion',
    content: 'A major streaming service has announced plans to invest $15 billion in original content production over the next three years. The expansion includes scripted series, documentaries, animated content, and international programming. The platform aims to compete with traditional television and other streaming services by offering exclusive, high-quality content. Several A-list directors and actors have signed exclusive production deals.',
    category: 'Entertainment'
  },
  {
    id: 'entertainment_3',
    title: 'Music Industry Embraces Digital Innovation',
    content: 'The music industry is experiencing a renaissance through digital platforms and innovative artist promotion strategies. Streaming revenues have reached record levels while artists are using social media to connect directly with fans. Virtual concerts and immersive experiences are creating new revenue streams and engagement opportunities. Independent artists have greater access to global audiences through digital distribution platforms.',
    category: 'Entertainment'
  },
  {
    id: 'entertainment_4',
    title: 'Award Season Celebrates Diverse Storytelling',
    content: 'This year\'s award season is celebrating unprecedented diversity in filmmaking and storytelling. Films from underrepresented communities are receiving critical acclaim and industry recognition. International productions are gaining mainstream attention and winning major awards. The entertainment industry\'s commitment to inclusive storytelling is reflected in the variety of nominated works and their global themes.',
    category: 'Entertainment'
  },
  {
    id: 'entertainment_5',
    title: 'Gaming Industry Reaches New Revenue Heights',
    content: 'The video game industry has achieved record revenue figures driven by mobile gaming growth and innovative monetization strategies. Major game releases are incorporating cutting-edge graphics, virtual reality elements, and cross-platform connectivity. Esports competitions are attracting massive audiences and substantial prize pools. The industry continues to push technological boundaries while expanding into new demographic markets.',
    category: 'Entertainment'
  },
];

export const getArticlesByCategory = (category: string): TrainingArticle[] => {
  return trainingData.filter(article => article.category === category);
};

export const getRandomArticles = (count: number): TrainingArticle[] => {
  const shuffled = [...trainingData].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}; 