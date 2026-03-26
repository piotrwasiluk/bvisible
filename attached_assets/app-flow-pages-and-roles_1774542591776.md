## **Site map**

### **Public pages**

* **Homepage**  
* **Pricing**  
* **Sample workspace**  
* **Sign up**  
* **Log in**

### **App pages**

* **Workspace setup**  
* **Visibility dashboard**  
* **Prompt discovery**  
* **Citation intelligence**  
* **Topic gaps**  
* **Competitor benchmarking**  
* **Recommendations**  
* **Reports**  
* **Settings**

## **Purpose of each page**

### **Public pages**

* **Homepage**  
  * Explain the product fast and move qualified users into an audit.  
* **Pricing**  
  * Show clear software-style plans and move users into checkout.  
* **Sample workspace**  
  * Let prospects see the product’s signal quality before signing up.  
* **Sign up**  
  * Create an account with minimal friction.  
* **Log in**  
  * Return users to their workspace quickly.

### **App pages**

* **Workspace setup**  
  * Configure the site, brand, competitors, region, and focus areas for the first audit.  
* **Visibility dashboard**  
  * Show the current AI visibility state, key deltas, and the most important signals at a glance.  
* **Prompt discovery**  
  * Generate, group, save, and rerun the prompts that matter most.  
* **Citation intelligence**  
  * Show which pages, topics, and content types earn citations across models.  
* **Topic gaps**  
  * Surface where competitors lead and turn those gaps into clear content opportunities.  
* **Competitor benchmarking**  
  * Compare the brand against competitors across visibility, citations, coverage, and leadership.  
* **Recommendations**  
  * Turn insights into a prioritized action queue for the SEO team.  
* **Reports**  
  * Export clean, stakeholder-ready summaries of visibility, gaps, and next moves.  
* **Settings**  
  * Manage workspace details, billing, team access, rerun settings, and connected account preferences.

## **User roles and access levels**

### **1\) Workspace owner**

Best fit:

* Head of SEO  
* Organic lead  
* Team lead who bought the plan

Access:

* Full workspace access  
* Manage billing and plan  
* Manage team members  
* Edit setup and competitors  
* Launch and rerun audits  
* Edit recommendation status  
* Export reports  
* Delete or archive workspace

### **2\) Admin / editor**

Best fit:

* SEO manager  
* Content strategist  
* Growth marketer working inside the team

Access:

* View all workspace data  
* Edit website setup, competitors, and prompt sets  
* Launch and rerun audits  
* Update recommendation states  
* Export reports  
* Cannot manage billing unless granted separately

### **3\) Contributor**

Best fit:

* Content marketer  
* SEO specialist  
* Analyst supporting execution

Access:

* View dashboard, citations, gaps, benchmarking, and recommendations  
* Save prompt sets  
* Comment on or triage recommendations if enabled  
* Cannot change billing  
* Cannot change core workspace ownership settings

### **4\) Viewer**

Best fit:

* CMO  
* VP Marketing  
* Executive stakeholder  
* Cross-functional reviewer

Access:

* Read-only access to dashboards and reports  
* Can review exports and shared findings  
* Cannot edit setup  
* Cannot launch audits  
* Cannot change recommendation status unless upgraded

### **5\) Billing admin**

Best fit:

* Ops or finance contact in larger teams

Access:

* Manage plan and invoices  
* View billing settings  
* No access to editing SEO workflow unless separately granted

## **Recommended MVP role model**

For MVP, keep roles simple:

* **Owner**  
* **Editor**  
* **Viewer**

Why:

* Fewer decisions during setup  
* Easier permissions  
* Lower support load  
* Better fit for a fast-moving B2B product

## **Access rules by page**

| Page | Owner | Editor | Viewer |
| ----- | ----- | ----- | ----- |
| Homepage | Yes | Yes | Yes |
| Pricing | Yes | Yes | Yes |
| Sample workspace | Yes | Yes | Yes |
| Sign up / Log in | Yes | Yes | Yes |
| Workspace setup | Full | Edit | No |
| Visibility dashboard | Full | Full | View |
| Prompt discovery | Full | Full | View |
| Citation intelligence | Full | Full | View |
| Topic gaps | Full | Full | View |
| Competitor benchmarking | Full | Full | View |
| Recommendations | Full | Full | View |
| Reports | Full | Full | View |
| Settings | Full | Limited | No |

## **Primary user journeys**

### **1\) First audit setup**

Goal:

* Get a new SEO lead from plan purchase to first meaningful audit fast.

Steps:

1. **Create workspace**  
   * Sign up, choose plan, enter workspace  
2. **Configure tracking**  
   * Add site, brand, competitors, region, and focus categories  
3. **Run first audit**  
   * Launch audit and land in the dashboard when results are ready

### **2\) Daily or weekly visibility review**

Goal:

* Help the SEO team understand current status in one pass.

Steps:

1. **Open dashboard**  
   * Review visibility, citation rate, prompt coverage, and deltas  
2. **Inspect weak areas**  
   * Open topic gaps or prompt discovery to see where the brand is missing  
3. **Prioritize next move**  
   * Add or update a recommendation in the queue

### **3\) Competitor triage**

Goal:

* Show where competitors are gaining so the team can respond.

Steps:

1. **Open competitor benchmarking**  
   * Review winning, tied, and losing topic clusters  
2. **Open the weak topic**  
   * Inspect related prompts, citations, and competitor strength  
3. **Create action**  
   * Push the issue into recommendations with a clear status

### **4\) Citation optimization**

Goal:

* Help the team improve which pages get cited by AI answers.

Steps:

1. **Open citation intelligence**  
   * Review cited pages, top topics, and weak assets  
2. **Spot missed opportunity**  
   * Find pages with strategic importance but low citation performance  
3. **Create content task**  
   * Add a recommendation to improve, expand, or create the asset

### **5\) Content planning from gaps**

Goal:

* Turn insight into a content backlog.

Steps:

1. **Open topic gaps**  
   * Sort by importance and expected upside  
2. **Review suggestion**  
   * See recommended format and competitor strength  
3. **Triage**  
   * Mark as backlog, in progress, published, or recheck later

### **6\) Stakeholder reporting**

Goal:

* Help the SEO lead share progress without rebuilding slides.

Steps:

1. **Open reports**  
   * Choose the latest audit window or comparison period  
2. **Generate export**  
   * Include visibility, citations, gaps, and recommendations  
3. **Share**  
   * Send a clean report to leadership or cross-functional teams

## **Navigation model**

The app should use a simple, stable navigation pattern.

### **Left navigation**

Top-level items only:

* Dashboard  
* Prompts  
* Citations  
* Topic gaps  
* Competitors  
* Recommendations  
* Reports  
* Settings

### **Top command area**

Use this for:

* Workspace switcher  
* Global search or command palette  
* Date range or audit selector  
* Rerun audit action  
* Export action  
* User menu

### **Why this structure works**

* The page names match the user’s mental model  
* The left nav stays stable as the system grows  
* The top bar handles action and scope, not page identity  
* Users always know where they are and what they can do next

## **Page priority for MVP**

Build in this order:

1. Workspace setup  
2. Visibility dashboard  
3. Prompt discovery  
4. Citation intelligence  
5. Topic gaps  
6. Competitor benchmarking  
7. Recommendations  
8. Reports  
9. Settings

This order matches the main user journey:

* setup  
* insight  
* diagnosis  
* action  
* sharing

## **UX rules for flows**

### **Rule 1 — Keep every journey obvious**

Users should always know:

* where they are  
* what changed  
* what to do next

### **Rule 2 — Limit each page to one main job**

Example:

* Dashboard \= understand status  
* Topic gaps \= identify opportunity  
* Recommendations \= manage action

### **Rule 3 — Show evidence one layer deeper**

Do not overload top-level pages.

Example:

* Show “Competitors lead this topic cluster” first  
* Show prompt- and citation-level proof after click

### **Rule 4 — Preserve momentum**

Where possible:

* save setup progress  
* keep filters sticky  
* remember last audit view  
* make reruns easy

### **Rule 5 — Make states plain-English**

Prefer:

* Winning  
* Tied  
* Losing  
* Missing  
* Rising  
* Flat

Avoid labels that need explanation.

## **Final structure summary**

bVisible should feel simple at the top level:

* **Dashboard** tells the story  
* **Prompts, citations, gaps, and competitors** explain the story  
* **Recommendations** turns the story into work  
* **Reports** shares the story  
* **Settings** keeps the workspace running

