/*
 * Growing LSC-Tomball 3.0 — page content
 * ---------------------------------------------------------------------------
 * This is the ONLY file you need to edit for routine updates:
 * adding a milestone, posting a new document, or changing the team roster.
 * The layout (index.html) and behavior (main.js) read from it automatically.
 *
 * Editing rules
 *   - Keep the commas between items and the quotes around text.
 *   - Dates use the format "YYYY-MM-DD".
 *   - Links to lonestar.edu should be full URLs (https://www.lonestar.edu/...).
 *   - After saving, reload the page. If a section shows an error or goes blank,
 *     a comma or quote is usually missing near your change.
 *
 * Source of truth: https://www.lonestar.edu/tomball3-0.htm (reviewed 2026-10-13)
 */

window.TOMBALL3 = {

  /* Shown in the page footer. Update whenever content is reviewed. */
  lastReviewed: "2026-10-13",

  /* ------------------------------------------------------------------------
   * MILESTONES
   * Each item:
   *   date        Start date "YYYY-MM-DD" (used for sorting, year filter, and
   *               deciding "Completed" vs. "Upcoming" automatically)
   *   endDate     Optional. Last day for multi-day items.
   *   dateLabel   Optional. Overrides the displayed date, e.g. "July–August 2025".
   *   title       Short name of the milestone.
   *   description Optional. One or two sentences. Keep to what's officially stated.
   *   initiative  Optional. "249", "neurodiversity", or "gpa" (adds a small tag), or a
   *               list like ["gpa", "neurodiversity"]. Strategy pages embed the widget
   *               with ?initiative=gpa (etc.) to show only their milestones.
   *   links       Optional. [{ label, url, type }] where type is "pdf", "web", or "survey".
   * ---------------------------------------------------------------------- */
  milestones: [
    {
      date: "2025-03-18",
      title: "State of the College address",
      description: "LSC-Tomball President Dr. Lee Ann Nutt outlined four strategic frameworks and the three timeframe-based initiatives that make up LSC-Tomball 3.0.",
      links: [
        { label: "State of the College follow-up", url: "https://www.lonestar.edu/departments/academicaffairsstusuccess/State%20of%20the%20College%20Follow%20Up_%20Recording%20Survey%20Link%20Embedded.pdf", type: "pdf" }
      ]
    },
    {
      date: "2025-04-11",
      title: "Strategic Planning Survey for LSC-Tomball faculty and staff"
    },
    {
      date: "2025-04-24",
      title: "LSC-Tomball / Education Design Lab kickoff meeting",
      description: "Kickoff of LSC-Tomball's work in the Reimagining Community Colleges Design Challenge."
    },
    {
      date: "2025-07-01",
      endDate: "2025-08-31",
      dateLabel: "July–August 2025",
      title: "Community stakeholder interviews",
      description: "Interviews conducted with community stakeholders."
    },
    {
      date: "2025-09-23",
      endDate: "2025-09-30",
      title: "Feedback Forums",
      description: "Forums gathering input on the initiatives. Results are available by session and by initiative.",
      links: [
        { label: "Results by session", url: "https://www.lonestar.edu/departments/academicaffairsstusuccess/Feedback%20Forum%20Results%20by%20Session.pdf", type: "pdf" },
        { label: "Results by initiative", url: "https://www.lonestar.edu/departments/academicaffairsstusuccess/Feedback%20Forum%20Results%20by%20Initiative.pdf", type: "pdf" }
      ]
    },
    {
      date: "2025-10-20",
      endDate: "2025-10-21",
      initiative: ["gpa", "neurodiversity"],
      title: "Initiative team meetings",
      description: "GPA+ team met October 20; Neurodiversity Center team met October 21."
    },
    {
      date: "2025-11-03",
      endDate: "2025-11-04",
      initiative: ["gpa", "neurodiversity"],
      title: "Initiative sprint meetings",
      description: "GPA+ initiative sprint on November 3; Neurodiversity Center initiative sprint on November 4."
    },
    {
      date: "2025-11-05",
      title: "LSC-Tomball Employer Partnership Luncheon"
    },
    {
      date: "2025-11-20",
      title: "LSC-Tomball Reimagine Day",
      links: [
        { label: "Reimagine Day summary board sketch", url: "https://www.lonestar.edu/departments/academicaffairsstusuccess/25EDL02-graphic-recording-F.pdf", type: "pdf" }
      ]
    },
    {
      date: "2026-06-22",
      title: "Dell Foundation visit",
      initiative: "gpa",
      description: "Members of the Michael & Susan Dell Foundation, Education Design Lab, and LSC-Tomball met with local employers to co-design the GPA+ Transferable Skills Benchmark.",
      links: [
        { label: "News story", url: "https://www.lonestar.edu/news/119319.htm", type: "web" },
        { label: "Visit agenda", url: "https://www.lonestar.edu/departments/academicaffairsstusuccess/Dell%20Visit%20to%20Tomball.pdf", type: "pdf" }
      ]
    }
  ],

  /* ------------------------------------------------------------------------
   * RESOURCES
   * Each item:
   *   title       Document or page name.
   *   description One short sentence about what it is.
   *   category    Must match one of the names in resourceCategories below.
   *   url         Full link.
   *   type        "pdf", "web", or "survey" (controls the label and icon).
   *   date        Optional "YYYY-MM-DD".
   *   size        Optional file size label for PDFs, e.g. "2.3 MB".
   *   note        Optional short status, e.g. "Survey closed".
   *   featured    Optional true — shows the item as the large card at the top.
   *   image       Optional cover image URL (featured item only).
   * ---------------------------------------------------------------------- */
  resourceCategories: [
    "Strategic Planning",
    "Surveys & Feedback",
    "Presentations",
    "Meeting Materials",
    "News & Partners"
  ],

  resources: [
    {
      title: "Growing LSC-Tomball 3.0: Agent of Efficacy and Opportunity",
      description: "The LSC-Tomball 3.0 strategic plan: vision, strategic frameworks, and detail on each of the three strategies.",
      category: "Strategic Planning",
      url: "https://www.lonestar.edu/departments/academicaffairsstusuccess/Growing%20LSC-Tomball%203.0-Agent%20of%20Efficacy%20and%20Opportunity.pdf",
      type: "pdf",
      size: "2.3 MB",
      featured: true,
      image: "https://www.lonestar.edu/images/COVER%20-%20Growing%20LSC-Tomball%203.0-Agent%20of%20Efficacy%20and%20Opportunity%201.jpg"
    },
    {
      title: "Campus Priorities Survey Report",
      description: "Summary of campus-wide survey results identifying short-, mid-, and long-term priorities.",
      category: "Surveys & Feedback",
      url: "https://www.lonestar.edu/departments/academicaffairsstusuccess/Campus%20Priorities%20Survey%20Report%20Revised%20.pdf",
      type: "pdf",
      size: "75 KB"
    },
    {
      title: "Feedback Forum Results by Session",
      description: "What we heard at each Feedback Forum session, September 2025.",
      category: "Surveys & Feedback",
      url: "https://www.lonestar.edu/departments/academicaffairsstusuccess/Feedback%20Forum%20Results%20by%20Session.pdf",
      type: "pdf",
      date: "2025-09-30",
      size: "690 KB"
    },
    {
      title: "Feedback Forum Results by Initiative",
      description: "Feedback Forum themes organized by initiative.",
      category: "Surveys & Feedback",
      url: "https://www.lonestar.edu/departments/academicaffairsstusuccess/Feedback%20Forum%20Results%20by%20Initiative.pdf",
      type: "pdf",
      date: "2025-09-30",
      size: "830 KB"
    },
    {
      title: "Strategic Planning Survey for Faculty and Staff",
      description: "Original survey for LSC-Tomball faculty and staff.",
      category: "Surveys & Feedback",
      url: "https://www.surveymonkey.com/r/QNXR7RX",
      type: "survey",
      date: "2025-04-11",
      note: "Survey closed"
    },
    {
      title: "State of the College follow-up",
      description: "President's follow-up message to the March 18, 2025 State of the College address, summarizing the three strategic initiatives.",
      category: "Presentations",
      url: "https://www.lonestar.edu/departments/academicaffairsstusuccess/State%20of%20the%20College%20Follow%20Up_%20Recording%20Survey%20Link%20Embedded.pdf",
      type: "pdf",
      date: "2025-03-18",
      size: "2.8 MB"
    },
    {
      title: "Reimagine Day summary board sketch",
      description: "Graphic recording from LSC-Tomball Reimagine Day.",
      category: "Meeting Materials",
      url: "https://www.lonestar.edu/departments/academicaffairsstusuccess/25EDL02-graphic-recording-F.pdf",
      type: "pdf",
      date: "2025-11-20",
      size: "9.9 MB"
    },
    {
      title: "Dell Foundation visit agenda",
      description: "Agenda for the Reimagining Community Colleges Design Challenge visit to LSC-Tomball.",
      category: "Meeting Materials",
      url: "https://www.lonestar.edu/departments/academicaffairsstusuccess/Dell%20Visit%20to%20Tomball.pdf",
      type: "pdf",
      date: "2026-06-22",
      size: "185 KB"
    },
    {
      title: "Dell Foundation, Employers, and LSC-Tomball Create Professional Competency Tool",
      description: "LSC news story on the employer design session for GPA+.",
      category: "News & Partners",
      url: "https://www.lonestar.edu/news/119319.htm",
      type: "web",
      date: "2026-06-24"
    },
    {
      title: "Reimagining Community Colleges Design Challenge",
      description: "Education Design Lab's overview of the national design challenge.",
      category: "News & Partners",
      url: "https://eddesignlab.org/project/reimagining-community-colleges-design-challenge/#colleges",
      type: "web"
    }
  ],

  /* ------------------------------------------------------------------------
   * CORE DESIGN TEAM
   * PROVISIONAL: names copied from the official page on 2026-10-13 and not yet
   * verified. Set rosterVerified to true once confirmed — this removes the
   * "pending verification" notice from the page.
   *
   * Each member: { name, title }. Move people between groups, or add/remove
   * groups, as needed. Empty groups are hidden automatically.
   * ---------------------------------------------------------------------- */
  rosterVerified: false,

  team: [
    {
      group: "College Leadership",
      members: [
        { name: "Dr. Jackie Thomas", title: "Vice President, Student Success" },
        { name: "Dr. Jerrel Wade", title: "Vice President, Administrative Services" },
        { name: "Dr. Katerina Wingfield", title: "Dean, Academic Affairs" }
      ]
    },
    {
      group: "Faculty & Staff",
      members: [
        { name: "Gracia Talbott", title: "Coordinator III, Professional Development" },
        { name: "Isabelle Chen", title: "Coordinator III, Research and Innovation" },
        { name: "Kawan Jaramillo", title: "Analyst II, Institutional Research, Lone Star College" },
        { name: "Kimberly Williams", title: "Professor, Mathematics" },
        { name: "Sarah Ho", title: "Director of Advising" }
      ]
    },
    {
      group: "Community Partners",
      members: [
        { name: "Brandy Beyer", title: "Greater Tomball Area Chamber of Commerce" },
        { name: "Tiffany Wooten", title: "Tomball Economic Development Council" }
      ]
    },
    {
      group: "Student Representatives",
      members: [
        { name: "Lorena Gonzalez-Ugarte", title: "LSC-Tomball student" },
        { name: "Emily White", title: "LSC-Tomball student" }
      ]
    }
  ]
};
