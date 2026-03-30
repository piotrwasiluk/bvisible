## **Build goal**

Ship an MVP that helps **in-house SEO teams** answer three questions fast:

- Which prompts matter?
- Where is our brand missing or weak?
- What should we publish next?

The build should favor **clarity, speed, and repeatable audits** over feature breadth.

## **Delivery principles**

- **Fast first value**
  - Get users from signup to first audit with minimal setup
  - Show useful insight before adding collaboration depth
- **Evidence before abstraction**
  - Every score should connect to prompts, citations, or competitor proof
- **Operational, not decorative**
  - Build the product like a workspace, not a dashboard toy
- **Weekly-use behavior**
  - Prioritize reruns, deltas, and action tracking early
- **Quiet UX**
  - Keep flows short
  - Keep choices obvious
  - Keep state visible

## **Step-by-step build sequence**

## **Phase 0 — Product framing**

### **Outcome**

A shared definition of the MVP and success criteria.

### **Tasks**

- Lock the MVP audience:
  - In-house SEO teams
- Lock the MVP promise:
  - Measure AI visibility
  - Surface gaps
  - Recommend next content moves
- Define core user actions:
  - Start audit
  - Review visibility
  - Compare competitors
  - Prioritize actions
- Define MVP metrics:
  - Time to first audit
  - Audit completion rate
  - Recommendation adoption rate
  - Weekly rerun rate
- Freeze MVP scope
- Push non-core items to later phases

### **Exit checkpoint**

Everyone can explain the MVP in one sentence without adding extra features.

## **Phase 1 — System foundation**

### **Outcome**

The workspace skeleton exists and feels fast.

### **Tasks**

- Create the app shell
  - Side navigation
  - Top command area
  - Workspace layout
- Define the information architecture
  - Dashboard
  - Prompt discovery
  - Citation intelligence
  - Topic gaps
  - Competitors
  - Recommendations
  - Reports
  - Settings
- Set up auth flow
  - Email/password
  - Optional Google OAuth
- Set up plan purchase flow
  - Pricing page
  - Stripe checkout
  - Post-checkout redirect into setup
- Set up workspace model
  - User
  - Workspace
  - Website
  - Competitor
  - Subscription
- Create empty states for every core page

### **Exit checkpoint**

A new user can create an account, buy a plan, enter the workspace, and see a clean setup path.

## **Phase 2 — Website intake and setup**

### **Outcome**

Users can configure a workspace without friction.

### **Tasks**

- Build the website intake flow
  - Website URL
  - Brand name
  - Competitor domains
  - Region / language
  - Priority categories
- Break setup into short steps
  - Brand basics
  - Competitors
  - Focus areas
  - Review
- Add helper text where users may hesitate
- Add progress indicators
- Save partial progress
- Confirm setup completion with a calm handoff into audit

### **Exit checkpoint**

The setup feels like configuring a workspace, not filling out a form.

## **Phase 3 — Audit engine and job flow**

### **Outcome**

The product can run and track audits reliably.

### **Tasks**

- Define the audit lifecycle
  - Queued
  - Running
  - Completed
  - Failed
  - Rerun scheduled
- Create background audit job behavior
- Create audit status surfaces
  - Setup confirmation
  - In-progress state
  - Completion state
  - Failure recovery state
- Store audit runs historically
- Create model check records
- Create a simple rerun trigger
- Add basic notifications inside the workspace

### **Exit checkpoint**

A user can launch an audit and understand its status without confusion.

## **Phase 4 — Prompt discovery**

### **Outcome**

Users can see and manage the prompts that shape AI visibility.

### **Tasks**

- Generate prompt sets from site and category inputs
- Group prompts into clusters
  - Brand lookup
  - Category intent
  - Comparison intent
  - Alternatives intent
  - Trust / proof intent
  - Purchase intent
- Build prompt set pages
- Allow prompt saving
- Allow prompt reruns
- Allow prompt organization by cluster
- Show why each cluster matters

### **Exit checkpoint**

Users can review a prompt universe that feels relevant, prioritized, and usable.

## **Phase 5 — Visibility dashboard**

### **Outcome**

The main command center shows status, deltas, and momentum.

### **Tasks**

- Define top-level metrics
  - Brand appearance rate
  - Citation rate
  - Prompt coverage
  - Omission rate
  - Sentiment framing
- Build compact metric cards
- Build model comparison views
- Build answer visibility summaries
- Show trend direction where possible
- Add filters
  - Model
  - Prompt cluster
  - Region / language
  - Competitor set
- Keep the first screen highly scannable

### **Exit checkpoint**

A user can answer “How visible are we?” in under 30 seconds.

## **Phase 6 — Citation intelligence**

### **Outcome**

Users can see what content gets cited and what is underperforming.

### **Tasks**

- Show cited pages
- Group cited assets by content type
- Group citations by topic
- Compare citation performance across models
- Highlight strong citation assets
- Highlight weak or uncited pages
- Surface missed citation opportunities
- Make every insight link back to evidence

### **Exit checkpoint**

A user can identify which assets deserve improvement or expansion.

## **Phase 7 — Topic gap analysis**

### **Outcome**

Users can turn competitive weakness into a content backlog.

### **Tasks**

- Detect topics where competitors appear more often
- Score strategic importance
- Show competitor strength by topic
- Suggest content format for each gap
- Estimate expected upside
- Sort gaps by opportunity
- Add backlog actions
  - Add to backlog
  - In progress
  - Published
  - Recheck later

### **Exit checkpoint**

A content strategist can leave the page with a ranked publishing plan.

## **Phase 8 — Competitor benchmarking**

### **Outcome**

Users can see where they win, tie, or lose.

### **Tasks**

- Build competitor comparison summaries
- Compare by:
  - Visibility
  - Citation frequency
  - Prompt coverage
  - Category leadership
- Add topic cluster breakdowns
- Use obvious states
  - Winning
  - Tied
  - Losing
- Keep tables compact and sortable

### **Exit checkpoint**

A user can explain competitive position without building a custom spreadsheet.

## **Phase 9 — Recommendations workflow**

### **Outcome**

Insights turn into action.

### **Tasks**

- Generate recommendation items from:
  - Topic gaps
  - Citation weakness
  - Missing comparison content
  - Thin trust assets
- Assign a clear “why this matters”
- Add action states
  - Backlog
  - In progress
  - Published
  - Recheck later
- Add owner and due date fields if needed for MVP
- Build a recommendation queue view
- Show the highest-impact next move first

### **Exit checkpoint**

The product feels like a planning tool, not just a reporting layer.

## **Phase 10 — Reports and exports**

### **Outcome**

Users can share findings cleanly with internal stakeholders.

### **Tasks**

- Create export-ready report views
- Keep styling monochrome and presentation-safe
- Summarize:
  - Current visibility
  - Key competitor gaps
  - Best citation assets
  - Recommended actions
- Support PDF or shareable report output
- Preserve evidence links in the report structure

### **Exit checkpoint**

An SEO lead can share a polished update without rebuilding slides manually.

## **Phase 11 — Quality, accessibility, and polish**

### **Outcome**

The product feels fast, clear, and trustworthy.

### **Tasks**

- Test keyboard navigation
- Test focus states
- Test table semantics
- Test contrast and semantic colors
- Review loading states
- Replace disruptive spinners with skeletons where possible
- Tighten empty states and error copy
- Remove non-essential UI chrome
- Stress-test dense data views on smaller screens

### **Exit checkpoint**

The interface feels calm under real usage, not just in static mocks.

## **Timeline with checkpoints**

## **Week 1 — Scope and structure**

- Finalize MVP scope
- Finalize page map
- Finalize data model
- Finalize top-level product language

**Checkpoint:** shared product blueprint approved

## **Week 2 — Workspace foundation**

- App shell
- Navigation
- Auth
- Pricing flow structure
- Workspace creation

**Checkpoint:** user can sign up and enter a clean workspace

## **Week 3 — Intake and onboarding**

- Website intake flow
- Competitor setup
- Focus area setup
- Progress states

**Checkpoint:** user can complete setup without friction

## **Week 4 — Audit lifecycle**

- Audit jobs
- Run states
- Historical run structure
- Rerun logic

**Checkpoint:** audits can be launched and tracked end to end

## **Week 5 — Prompt discovery**

- Prompt generation
- Prompt clustering
- Prompt saving and reruns
- Prompt organization

**Checkpoint:** user sees a useful prompt universe

## **Week 6 — Visibility dashboard**

- Metric summaries
- Model comparison
- Filter system
- Delta logic

**Checkpoint:** dashboard answers the core visibility question clearly

## **Week 7 — Citation intelligence**

- Citation views
- Cited pages
- Topic-level citation summaries
- Strong vs weak asset surfacing

**Checkpoint:** citation evidence is usable and clear

## **Week 8 — Topic gaps and benchmarking**

- Topic gap scoring
- Competitor comparison
- Winning / tied / losing states

**Checkpoint:** users can spot where competitors lead and why

## **Week 9 — Recommendations and action flow**

- Recommendation generation
- Status tracking
- Action queue design

**Checkpoint:** insights convert into a usable content backlog

## **Week 10 — Reports, polish, and launch readiness**

- Exports
- Accessibility review
- Performance pass
- Onboarding polish
- QA and bug fixes

**Checkpoint:** MVP is ready for pilot users

## **Launch sequence**

### **Internal dogfood**

- Use 2–3 internal test workspaces
- Review output clarity
- Find confusing metrics
- Fix the top 3 friction points first

### **Friendly pilot**

- Invite 5–10 in-house SEO teams
- Watch first-run onboarding live
- Track where they hesitate
- Track what they ignore
- Track which recommendations they trust

### **Public MVP release**

- Launch with the cleanest possible landing page
- Focus messaging on one promise:
  - Track how AI models see your brand

## **Team roles**

## **Product lead**

Owns:

- Scope
- priorities
- user interviews
- usability review
- launch decisions

Success looks like:

- fewer features
- clearer workflows
- stronger adoption

## **Design lead**

Owns:

- UI system
- interaction clarity
- information density
- accessibility
- emotional consistency

Success looks like:

- calm scanning
- obvious hierarchy
- compact flows
- low cognitive load

## **Full-stack builder**

Owns:

- app foundation
- workspace flows
- audit workflow plumbing
- data presentation surfaces
- export mechanics

Success looks like:

- stable flows
- fast iteration
- reliable state handling

## **Data / AI systems owner**

Owns:

- prompt generation quality
- audit logic
- citation extraction quality
- topic gap logic
- recommendation signal quality

Success looks like:

- outputs feel trustworthy
- recommendations feel specific
- evidence feels easy to inspect

## **Growth / customer lead**

Owns:

- pilot recruitment
- onboarding feedback
- pricing clarity
- homepage messaging
- retention learning

Success looks like:

- users reach value fast
- feedback loops stay tight
- the product language matches user language

## **Recommended rituals**

## **Weekly product review**

Review:

- onboarding friction
- audit completion
- dashboard clarity
- top user confusion points

Keep it short and evidence-based.

## **Weekly build planning**

- Re-rank priorities
- Cut non-essential work
- Protect the MVP promise

## **Bi-weekly usability test**

Run a 30-minute session with 2–3 target users.

Test:

- signup to first audit
- dashboard interpretation
- recommendation trust
- export usefulness

Log:

- top 3 confusion points
- top 3 “this is valuable” moments

## **Weekly design QA**

Check:

- hierarchy
- spacing
- density
- state clarity
- accessibility

## **Monthly product reset**

Ask:

- What are users actually doing?
- What do they skip?
- Which insight pages drive action?
- Which features should be trimmed?

## **Success metrics for MVP**

## **Activation metrics**

- Signup to completed setup rate
- Setup to first audit completion rate
- Time to first useful insight

## **Product engagement metrics**

- Weekly rerun rate
- Prompt set save rate
- Dashboard revisit rate
- Recommendation status update rate

## **Trust metrics**

- Percent of users who inspect supporting evidence
- Percent of users who export reports
- Qualitative confidence in recommendations

## **Outcome metrics**

- Recommendations turned into published work
- Visibility improvements after reruns
- Retention of teams after first month

## **Optional integrations**

Useful after MVP proves the core workflow.

- Google Search Console
  - Connect AI visibility with search demand context
- Google Analytics or product analytics
  - Tie discovery insight to downstream behavior
- CMS integration
  - Move from recommendation to content production faster
- Slack or email alerts
  - Notify teams when visibility shifts
- Task management tools
  - Push recommendations into team workflows
- Shared links for stakeholder review
  - Reduce friction in internal reporting

## **Stretch goals**

Do only after the core product feels reliable.

- AI Visibility Analyst
  - Explain gaps in plain English
  - Recommend next pages to create
- Historical benchmarking over longer periods
- Multi-region and multi-language tracking
- Topic ownership maps
- Executive summary reports
- Agency mode for multi-client workspaces
- Custom prompt libraries by industry

## **Kill list for MVP**

Do not let these slow the first release.

- Heavy custom dashboards
- Decorative charts that need explanation
- Too many filters on day one
- Complex permissions
- Deep task management
- Overbuilt reporting templates
- Chat-first AI assistant behavior

## **Final build test**

Before launch, ask five simple questions:

- Can a new user finish setup fast?
- Can they understand the dashboard fast?
- Can they trust the evidence fast?
- Can they pick the next action fast?
- Does the product feel calm, sharp, and quietly powerful?

If any answer is “not yet,” keep trimming.
