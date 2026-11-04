/*
  VERIFIED FACTS used by the Skills Explorer and the Portfolio Assistant.
  Every line here comes from the CV, the certificates, the LifeFlow site, or text that is already on the page.
  If something is not documented, the entry says so instead of guessing. Edit freely, but keep it factual.
*/
window.PORTFOLIO_FACTS = (function () {
  var L = {
    github: 'https://github.com/sanjeetkumar989159-hub',
    weatherRepo: 'https://github.com/sanjeetkumar989159-hub/india-weather-analysis',
    linkedin: 'https://www.linkedin.com/in/sanjeet-kumar-706597s/',
    leetcode: 'https://leetcode.com/u/sanjeet1234/',
    lifeflow: 'https://sanjeetkumar989159-hub.github.io/Life-Flow-Blood-Bank/',
    resume: 'assets/Sanjeet_Kumar_Resume.pdf'
  };

  /* Where each skill is used. Only documented evidence is listed: no proficiency levels. */
  var columns = [
    { id: 'exp',  label: 'Internship',        href: '#experience' },
    { id: 'proj', label: 'Projects',          href: '#projects' },
    { id: 'dsa',  label: 'Problem solving',   href: '#dsa' },
    { id: 'cert', label: 'Certificates',      href: '#recognition' }
  ];

  var skills = [
    { name: 'Python', group: 'Data analysis', aliases: ['python'], evidence: {
      exp: 'Applied Python, Pandas and NumPy for data processing and analysis (Codec Technologies internship).',
      proj: 'India Weather Analysis 2026 is a Python project that collects and processes weather data.',
      cert: 'Scored 60% or above in the Industry Oriented Python Assessment (SAGEB campus).' } },
    { name: 'Pandas', group: 'Data analysis', aliases: ['pandas'], evidence: {
      exp: 'Applied Pandas for data processing and analysis (Codec Technologies internship).',
      proj: 'Used Pandas to process and organise the collected weather data.' } },
    { name: 'NumPy', group: 'Data analysis', aliases: ['numpy'], evidence: {
      exp: 'Applied NumPy for data processing and analysis (Codec Technologies internship).' } },
    { name: 'SQL', group: 'Data analysis', aliases: ['sql'], evidence: {
      exp: 'Worked on data analytics tasks using Python, SQL, Advanced Excel and data visualization.' } },
    { name: 'Excel (Advanced)', group: 'Data analysis', aliases: ['excel', 'spreadsheet', 'spreadsheets'], evidence: {
      exp: 'Worked on data analytics tasks using Advanced Excel (Codec Technologies internship).' } },
    { name: 'Power BI', group: 'Visualization and BI', aliases: ['power bi', 'powerbi'], evidence: {
      exp: 'Listed among the tools for the Codec Technologies internship.' } },
    { name: 'Data Visualization Tools', group: 'Visualization and BI', aliases: ['visualization', 'visualisation', 'visualize', 'visualise', 'charts'], evidence: {
      exp: 'Used data visualization tools to analyze and present data-driven insights.',
      proj: 'Created data visualizations that present weather information and insights.',
      cert: 'The Industry Oriented Python Assessment covers data analysis and data visualization (60% or above).' } },
    { name: 'API Integration', group: 'Web, design and integration', aliases: ['api', 'apis'], evidence: {
      proj: 'Integrated the OpenWeather API to retrieve temperature and humidity.' } },
    { name: 'HTML/CSS', group: 'Web, design and integration', aliases: ['html', 'css'], evidence: {} },
    { name: 'Figma', group: 'Web, design and integration', aliases: ['figma'], evidence: {} },
    { name: 'Java', group: 'Programming and DSA', aliases: ['java'], evidence: {
      dsa: 'Solves data structures and algorithms problems in Java.' } },
    { name: 'C++', group: 'Programming and DSA', aliases: ['c++', 'cpp'], evidence: {
      dsa: 'Solves data structures and algorithms problems in C++.' } },
    { name: 'Data structures and algorithms', group: 'Programming and DSA', aliases: ['dsa', 'algorithms', 'algorithm', 'data structures'], evidence: {
      dsa: 'Arrays, strings, linked lists, stacks, queues, trees, graphs, hash maps and dynamic programming; regular practice on LeetCode and HackerRank.',
      cert: 'Scored 60% or above in the DSA Bootcamp Assessment (SAGEB campus).' } },
    { name: 'Big-O analysis', group: 'Programming and DSA', aliases: ['big-o', 'big o', 'complexity'], evidence: {
      dsa: 'Works with Big-O analysis when solving algorithm problems.' } },
    { name: 'OOP', group: 'Programming and DSA', aliases: ['oop', 'object-oriented', 'object oriented'], evidence: {
      dsa: 'Works with Object-Oriented Programming alongside DSA practice.' } },
    { name: 'Docker', group: 'Certified', aliases: ['docker'], evidence: {
      cert: 'IBM certificate: Docker Essentials: A Developer Introduction (Oct 23, 2026).' } },
    { name: 'Prompt Engineering', group: 'Certified', aliases: ['prompt engineering', 'prompting'], evidence: {
      cert: 'Prompt Engineering Mastery, Sunstone School of Technology (May 2026).' } },
    { name: 'UI/UX', group: 'Certified', aliases: ['ui/ux', 'ux'], evidence: {
      cert: 'UI/UX Professional Certification, Sunstone School of Technology (April 2026).' } }
  ];

  /* Technologies that are NOT on the CV: the assistant says so honestly instead of guessing. */
  var notListed = ['react', 'angular', 'vue', 'node', 'nodejs', 'django', 'flask', 'tableau', 'aws', 'azure', 'gcp',
    'tensorflow', 'pytorch', 'keras', 'mongodb', 'mysql', 'postgresql', 'postgres', 'spark', 'hadoop', 'javascript', 'typescript',
    'kubernetes', 'linux', 'scala', 'php', 'looker', 'snowflake', 'airflow', 'dbt', 'nlp', 'machine learning', 'deep learning',
    'selenium', 'jenkins', 'sap', 'sas', 'matlab', 'golang', 'rust', 'swift', 'kotlin', 'flutter'];

  function ist() {
    try { return new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; }
  }

  var faq = [
    { id: 'help', keys: ['hello', 'hi', 'hey', 'help', 'what can you do', 'what can i ask'],
      answer: 'I can answer questions about Sanjeet\'s skills, projects, experience, education, certificates, resume and how to contact him. I only use the information on this portfolio, and if something isn\'t here I\'ll say so.' },
    { id: 'about', keys: ['who is', 'about sanjeet', 'tell me about', 'introduce', 'background', 'summary', 'overview', 'about him', 'sanjeet'],
      answer: 'Sanjeet Kumar is a Computer Science Engineering student at SAGE University Bhopal (B.Tech, 2025–2029) building a career in data analytics. He works with Python, SQL, Advanced Excel and Power BI, and uses Pandas and NumPy to clean, process and analyze data. In July–August 2026 he completed a Data Analytics internship at Codec Technologies.',
      links: [{ label: 'About', href: '#about' }, { label: 'Resume (PDF)', href: L.resume, ext: true }] },
    { id: 'skills', keys: ['skills', 'skill', 'tools', 'stack', 'technologies', 'technology', 'tech', 'expertise', 'strengths', 'good at', 'proficient', 'know', 'languages', 'programming'],
      answer: 'Listed on his CV — Data analysis: Python, Pandas, NumPy, SQL, Excel (Advanced). Visualization and BI: Power BI, data visualization tools. Web, design and integration: HTML/CSS, API integration, Figma. Programming and DSA: Java, C++, Big-O analysis, OOP. Working style: communication, critical thinking, teamwork, problem-solving, adaptability. The Skills explorer shows where each skill is actually used.',
      links: [{ label: 'Skills explorer', href: '#skills' }] },
    { id: 'experience', keys: ['experience', 'intern', 'internship', 'work', 'job', 'codec', 'employment', 'worked', 'professional', 'career'],
      answer: 'Data Analytics Intern at Codec Technologies, 14 Jul – 16 Aug 2026 (a 1-month AICTE & ICAC approved program). He worked on analytics tasks with Python, SQL, Advanced Excel and data visualization, applied Python, Pandas and NumPy for processing and analysis, and used data visualization tools to present insights.',
      links: [{ label: 'Experience', href: '#experience' }, { label: 'Verify certificate', href: '#fx-verify' }] },
    { id: 'projects', keys: ['projects', 'project', 'built', 'portfolio work', 'made', 'created', 'developed'],
      answer: 'Two projects. (1) India Weather Analysis 2026: a Python project that collects real-time weather data (temperature and humidity) for Indian state capitals through the OpenWeather API, processes it with Pandas, visualizes it and stores it as CSV. (2) LifeFlow Blood Bank: a web app prototype that connects donors, hospitals and people who need blood, with donor registration, urgency-based requests, live inventory and a donor directory. Each has a case study.',
      links: [{ label: 'Projects', href: '#projects' }] },
    { id: 'weather', keys: ['weather', 'openweather', 'india weather', 'temperature', 'humidity', 'climate', 'state capitals'],
      answer: 'India Weather Analysis 2026 collects real-time weather data for Indian state capitals. It calls the OpenWeather API for temperature and humidity, uses Python and Pandas to process and organize the data, creates visualizations, and stores the processed data as CSV for later analysis.',
      links: [{ label: 'Source code', href: L.weatherRepo, ext: true }, { label: 'Case study', href: '#projects' }] },
    { id: 'lifeflow', keys: ['lifeflow', 'blood', 'donor', 'donors', 'donation', 'hospital', 'hospitals', 'blood bank', 'life flow'],
      answer: 'LifeFlow Blood Bank is a web app prototype hosted on GitHub Pages. It has donor registration (blood type, weight, city, availability), hospital blood requests with three urgency levels (critical within 2 hours, urgent within 24 hours, standard in 2–5 days), a live inventory by blood type and hospital, a donor directory filterable by blood type, and sign-up/login with OTP verification. It runs on demo data and a demo OTP.',
      links: [{ label: 'Open live site', href: L.lifeflow, ext: true }, { label: 'Case study', href: '#lifeflow' }] },
    { id: 'education', keys: ['education', 'study', 'studying', 'degree', 'college', 'university', 'sage', 'btech', 'b.tech', 'school', 'marks', 'percentage', 'graduation', 'graduate', 'qualification', 'qualifications', 'cgpa'],
      answer: 'B.Tech in Computer Science Engineering at SAGE University Bhopal (2025–2029). Before that: Class XII (2025) at Project High School Pihra Gowan with 71%, and Class X (2023) at UHS Hariharpur with 71%.',
      links: [{ label: 'Education', href: '#education' }] },
    { id: 'certs', keys: ['certificate', 'certificates', 'certification', 'certifications', 'certified', 'sunstone', 'ibm', 'credential', 'credentials', 'verify', 'verification', 'courses', 'course'],
      answer: 'Three certificates: Docker Essentials: A Developer Introduction (IBM, Oct 23, 2026), Prompt Engineering Mastery (Sunstone School of Technology, May 2026) and UI/UX Professional Certification (Sunstone School of Technology, April 2026). He also has a Codec Technologies internship certificate. Each one has a verification link in the Verify credentials list.',
      links: [{ label: 'Certifications', href: '#recognition' }, { label: 'Verify credentials', href: '#fx-verify' }] },
    { id: 'achievements', keys: ['achievement', 'achievements', 'award', 'awards', 'recognition', 'recognized', 'techverse', 'assessment', 'assessments', 'bootcamp', 'accomplishments'],
      answer: 'Recognized for outstanding Presentation Design and Content skills at the SAGE University Techverse event; scored 60% or above in the DSA Bootcamp Assessment; and scored 60% or above in the Industry Oriented Python (Transforming Data into Insights) Assessment, both at the SAGEB campus.',
      links: [{ label: 'Achievements', href: '#achievements' }] },
    { id: 'contact', keys: ['contact', 'email', 'mail', 'phone', 'call', 'reach', 'number', 'linkedin', 'connect', 'message', 'talk', 'get in touch'],
      answer: 'Email: sumitkumar989159@gmail.com · Phone: 7065974303 · Location: Giridih, Jharkhand. He is also on LinkedIn, GitHub and LeetCode, and there is a contact form at the bottom of this page.',
      links: [{ label: 'Contact', href: '#contact' }, { label: 'LinkedIn', href: L.linkedin, ext: true }] },
    { id: 'resume', keys: ['resume', 'cv', 'curriculum', 'download', 'pdf', 'résumé'],
      answer: 'His one-page resume is available as a PDF: you can view it in the browser or download it.',
      links: [{ label: 'View resume (PDF)', href: L.resume, ext: true }, { label: 'Download PDF', href: L.resume, download: true }] },
    { id: 'availability', keys: ['available', 'availability', 'hire', 'hiring', 'opening', 'openings', 'opportunity', 'opportunities', 'join', 'notice', 'relocate', 'relocation', 'remote', 'full-time', 'part-time', 'freelance', 'looking', 'open to work', 'recruiter'],
      answer: function (ctx) {
        var a = (ctx.CFG && ctx.CFG.availability) || {};
        if (a.status) return 'Current status: ' + a.status + (a.note ? '. ' + a.note : '.') + ' For details, email or message him on LinkedIn.';
        return 'This portfolio doesn\'t state an availability status, so I can\'t say whether he is open to a particular role. For context: he is a B.Tech student (2025–2029) and completed a Data Analytics internship in July–August 2026. The best way to ask is by email or LinkedIn.';
      },
      links: [{ label: 'For recruiters', href: '#recruiters' }, { label: 'Contact', href: '#contact' }] },
    { id: 'location', keys: ['location', 'based', 'live', 'lives', 'where', 'city', 'timezone', 'time zone', 'time', 'jharkhand', 'giridih', 'india', 'country'],
      answer: function () {
        var t = ist();
        return 'Sanjeet is based in Giridih, Jharkhand, India (IST, UTC+5:30)' + (t ? '. It is currently ' + t + ' there.' : '.');
      },
      links: [{ label: 'Contact', href: '#contact' }] },
    { id: 'dsa', keys: ['dsa', 'leetcode', 'hackerrank', 'algorithms', 'algorithm', 'data structures', 'problem solving', 'coding', 'competitive', 'java', 'c++'],
      answer: 'He practises data structures and algorithms in Java and C++ (arrays, strings, linked lists, stacks, queues, trees, graphs, hash maps and dynamic programming), works with Big-O analysis and Object-Oriented Programming, and practises regularly on LeetCode and HackerRank. He scored 60% or above in the DSA Bootcamp Assessment.',
      links: [{ label: 'Problem solving', href: '#dsa' }, { label: 'LeetCode profile', href: L.leetcode, ext: true }] },
    { id: 'github', keys: ['github', 'repo', 'repos', 'repository', 'repositories', 'code', 'source', 'git'],
      answer: 'His GitHub is github.com/sanjeetkumar989159-hub. The Projects section shows live statistics pulled from the GitHub API, and the weather project\'s source code is in the india-weather-analysis repository.',
      links: [{ label: 'GitHub', href: L.github, ext: true }, { label: 'Weather project code', href: L.weatherRepo, ext: true }] },
    { id: 'dashboards', keys: ['dashboard', 'dashboards', 'power bi', 'powerbi', 'reports', 'report', 'bi'],
      answer: function (ctx) {
        var n = ((ctx.DATA && ctx.DATA.dashboards) || []).length;
        if (n) return 'There are ' + n + ' Power BI dashboards in the Dashboards section, each with a screenshot' + ' and a description.';
        return 'No Power BI dashboards are published on this portfolio yet. Power BI is listed among Sanjeet\'s skills and among the tools for his Codec Technologies internship.';
      },
      links: [{ label: 'Skills explorer', href: '#skills' }] },
    { id: 'site', keys: ['this website', 'this site', 'how was this', 'built with', 'framework', 'made this', 'website built', 'how is this'],
      answer: 'This portfolio is built with plain HTML, CSS and JavaScript, with no framework.' }
  ];

  return { links: L, columns: columns, skills: skills, notListed: notListed, faq: faq, ist: ist };
})();
