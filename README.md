Sanjeet Kumar --- Data Analyst Portfolio

A responsive personal portfolio showcasing my data analytics skills,
internship experience, projects, education, certifications, and resume.

🌐 Live Portfolio: https://sanjeet-kumar-portfolio98.netlify.app/

About

I am an aspiring Data Analyst interested in turning raw data into
meaningful insights. This portfolio presents my learning journey,
practical work, and experience across the data analytics workflow:

Collect → Clean → Analyse → Visualise

Use the live website to explore my background, skills, projects,
certifications, and contact information.

Featured Projects

1. India Weather Analysis 2026

A data-focused project exploring weather information and presenting
findings in an understandable way.

2. LifeFlow Blood Bank

A web-based project focused on a blood bank use case.

For project details, screenshots, and available source links, visit the
Projects section of the live portfolio.

Skills

The portfolio highlights skills across these areas:

Data Analysis: data collection, cleaning, analysis, and
interpretation

Visualization & BI: dashboarding and communicating insights

Programming: Python and related data tools

Web Technologies: HTML, CSS, and JavaScript

Please refer to the Skills section of the live portfolio for the
current list and evidence of each skill.

Portfolio Features

Responsive portfolio layout

About, skills, experience, projects, education, and certifications
sections

Resume preview and PDF download

Project search and filters

GitHub activity/statistics section

Power BI dashboard gallery (shown when dashboard entries are
configured)

Skills explorer

Project case-study links

Contact form with email fallback

Portfolio QR code

Accessibility and SEO improvements

Custom 404 page

Built With

HTML5

CSS3

JavaScript (ES modules)

GitHub public API for repository statistics

Netlify for deployment

This is a static website and does not require a frontend build process.

Run Locally

Option 1: VS Code Live Server

Clone or download this repository.

Open the project folder in Visual Studio Code.

Install the Live Server extension.

Right-click index.html.

Select Open with Live Server.

Option 2: Node.js

Node.js 18 or later is recommended.

npm start

Then open:

http://localhost:5173

You can also open index.html directly in a browser. An internet
connection is needed for externally hosted fonts and API-powered
features.

Project Structure

sanjeet-portfolio/
├── index.html
├── style.css
├── script.js
├── 404.html
├── robots.txt
├── _headers
├── package.json
├── assets/
│   ├── portrait.webp
│   ├── Sanjeet_Kumar_Resume.pdf
│   ├── hero-bg.mp4
│   └── ...images and certificates
├── features/
│   ├── config.js
│   ├── features.css
│   ├── features.js
│   ├── data/
│   │   ├── dashboards.js
│   │   ├── facts.js
│   │   └── testimonials.js
│   └── vendor/
└── scripts/
    └── configure.mjs

Configuration

Optional settings are documented in .env.example.

To generate the public site configuration:

cp .env.example .env

Edit .env with the public values you want to use, then run:

npm run configure

Only use public configuration values in frontend files. Never add
private API keys, passwords, or secrets to this repository.

Some optional sections (such as dashboards, testimonials, analytics, and
the assistant endpoint) remain inactive until configured with real
content or settings.

Deployment

This project is deployed on Netlify:

https://sanjeet-kumar-portfolio98.netlify.app/

To deploy your own copy, upload the project folder to Netlify or connect
the GitHub repository to Netlify for automatic deployments.

Contact

For professional opportunities, collaboration, or questions, please use
the contact details and form on my portfolio:

https://sanjeet-kumar-portfolio98.netlify.app/

⭐ If you find this portfolio useful or interesting, feel free to
explore the projects and connect with me.
