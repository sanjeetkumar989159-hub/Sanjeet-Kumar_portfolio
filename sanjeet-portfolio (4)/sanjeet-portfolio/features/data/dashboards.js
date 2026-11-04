/*
  POWER BI DASHBOARD GALLERY
  The "Dashboards" section stays hidden until you add at least one real dashboard below.
  Nothing is shown (and nothing is invented) while this list is empty.

  For each dashboard:
    title        required  Name of the dashboard
    description  required  1-2 sentences: what question it answers, what data it uses
    image        required  Path to a screenshot, e.g. "assets/dashboards/sales-overview.webp"
    imageAlt     required  Describe the screenshot for screen-reader users
    tags         optional  e.g. ["Power BI", "Sales"]  (used for the filter chips)
    tools        optional  e.g. ["Power BI", "DAX", "Excel"]
    embedUrl     optional  A Power BI "Publish to web" link (must start with https://app.powerbi.com/)
                           When present, an "Open interactive" button opens it inside the page.
    sourceUrl    optional  Link to the dataset, repository or write-up

  Example (copy, remove the comment markers, and fill in your own real details):

  {
    title: "…",
    description: "…",
    image: "assets/dashboards/….webp",
    imageAlt: "…",
    tags: ["Power BI"],
    tools: ["Power BI"],
    embedUrl: "https://app.powerbi.com/view?r=…",
    sourceUrl: "https://github.com/…"
  }
*/
window.PORTFOLIO_DATA = window.PORTFOLIO_DATA || {};
window.PORTFOLIO_DATA.dashboards = [];
