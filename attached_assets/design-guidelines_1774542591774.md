## **Emotional tone**

**Feels like a calm mission control for AI visibility — sharp, deliberate, fast, and stripped of noise.**

This direction follows the design-tips principle of **starting with feeling before features**, then grounding the system with strong visual anchors like Linear and shadcn/ui. It also follows the idea that products should be designed as emotional experiences, not just efficient screens.

## **Emotional design intent**

bVisible should make in-house SEO teams feel:

- **Clear**
  - I know where we stand
- **In control**
  - I know what changed
- **Confident**
  - I trust the signal
- **Calm**
  - The interface respects my attention
- **In motion**
  - I know the next move

This is a product for operators. It should feel capable, but never loud.

The design-tips file frames this well: kindness is not softness or decoration. It is confidence, restraint, second chances, patient empty states, and guidance that never blames the user.

## **Visual system**

### **Style anchors**

Use these references as the main visual grammar:

- **Linear**
  - Compact hierarchy
  - Dense information
  - Quiet confidence
  - Fast workspace feel
- **shadcn/ui**
  - Reliable component baseline
  - Minimal chrome
  - Clean primitives
- **Apple Human Interface**
  - Restraint
  - Motion polish
  - Calm interaction feedback

### **Visual translation**

The emotional thesis should show up as:

- Monochrome by default
- Precise spacing
- Sharp but not harsh borders
- High information density with breathing room
- Semantic color used only for state
- Motion that confirms, never distracts

## **Typography**

Typography should feel **operational, crisp, and disciplined**.

Use a clean sans-serif primary family. A neo-grotesk or modern system sans works best. Add a mono accent only for technical labels, model names, timestamps, and structured data.

### **Type families**

- **Primary**
  - Inter, Geist, or system sans
  - Use for all interface and marketing text
- **Secondary mono**
  - JetBrains Mono, IBM Plex Mono, or ui-monospace
  - Use sparingly for:
    - model names
    - prompt IDs
    - compact labels
    - numeric deltas

### **Typographic hierarchy**

| Style        | Size | Weight | Line height | Use                                       |
| ------------ | ---- | ------ | ----------- | ----------------------------------------- |
| H1           | 40px | 700    | 48px        | Landing headline, major page titles       |
| H2           | 28px | 650    | 36px        | Section titles, major dashboard headers   |
| H3           | 22px | 600    | 30px        | Card titles, panel headings               |
| H4           | 18px | 600    | 26px        | Table section headers, modal titles       |
| Body Large   | 16px | 450    | 24px        | Main explanatory text                     |
| Body         | 14px | 450    | 22px        | Standard UI text                          |
| Label        | 12px | 500    | 18px        | Filter labels, metadata                   |
| Caption      | 11px | 500    | 16px        | Helper text, timestamps, footnotes        |
| Mono Utility | 12px | 500    | 18px        | Model names, status codes, structured IDs |

### **Typographic rules**

- Keep body copy at **14–16px**
- Maintain **1.5× line-height or more** for body text
- Use weight and spacing before using color
- Avoid all-caps except tiny utility labels
- Keep headline copy short and assertive
- Let tables and cards do the heavy lifting, not long paragraphs

### **Tone through type**

- **Bold headlines** \= confidence
- **Compact body text** \= speed
- **Quiet labels** \= calm structure
- **Minimal mono accents** \= technical credibility without developer-tool coldness

## **Color system**

The palette should feel **confident, monochrome, and surgical**.

Color is for meaning, not decoration. This matches the design-tips guidance toward minimal, focused systems with neutral tones and quiet motion.

### **Core palette — light mode**

- **Primary text**
  - Hex: `#0F0F10`
  - RGB: `15, 15, 16`
- **Background**
  - Hex: `#FFFFFF`
  - RGB: `255, 255, 255`
- **Panel background**
  - Hex: `#F7F7F8`
  - RGB: `247, 247, 248`
- **Border**
  - Hex: `#E6E7EB`
  - RGB: `230, 231, 235`
- **Muted text**
  - Hex: `#6B7280`
  - RGB: `107, 114, 128`
- **Accent black**
  - Hex: `#18181B`
  - RGB: `24, 24, 27`

### **Semantic palette**

- **Positive**
  - Hex: `#15803D`
  - RGB: `21, 128, 61`
- **Warning**
  - Hex: `#B45309`
  - RGB: `180, 83, 9`
- **Negative**
  - Hex: `#B91C1C`
  - RGB: `185, 28, 28`
- **Info**
  - Hex: `#2563EB`
  - RGB: `37, 99, 235`

### **Dark mode companion palette**

- **Primary text**
  - Hex: `#F4F4F5`
  - RGB: `244, 244, 245`
- **Background**
  - Hex: `#0B0B0C`
  - RGB: `11, 11, 12`
- **Panel background**
  - Hex: `#131316`
  - RGB: `19, 19, 22`
- **Border**
  - Hex: `#26272B`
  - RGB: `38, 39, 43`
- **Muted text**
  - Hex: `#9CA3AF`
  - RGB: `156, 163, 175`
- **Accent white**
  - Hex: `#FAFAFA`
  - RGB: `250, 250, 250`

### **Color behavior rules**

- Use monochrome for layout, structure, and typography
- Use semantic colors only for:
  - status
  - alerts
  - deltas
  - states requiring triage
- Never use green/red alone to signal meaning
- Pair color with:
  - icon
  - text label
  - directional change
- Keep all core text/background pairs at **WCAG AA minimum**
- Aim for **4.5:1 contrast or better** across standard text

### **Emotional read of the palette**

- **Black / white / gray** \= control, clarity, precision
- **Green / amber / red / blue** \= operational meaning only
- The product should feel **focused**, not colorful

## **Spacing and layout**

The layout system should feel like a disciplined workspace.

### **Grid system**

Use a strict **8pt spacing grid**.

Approved spacing tokens:

- 4
- 8
- 12
- 16
- 24
- 32
- 40
- 48
- 64

### **Layout structure**

#### **App shell**

- Left side navigation
- Top command area
- Main content region
- Optional right-side contextual panel for:
  - detail views
  - evidence
  - recommendations
  - citations

#### **Content rhythm**

- Use compact cards and table sections
- Prefer one strong primary pane over many competing panels
- Keep page intros short
- Put state first, delta second, explanation third

#### **Card rules**

- Card padding: **16px or 24px**
- Card gap: **16px**
- Border radius: **10px to 12px**
- Border weight: **1px**
- Avoid heavy shadows
- Prefer border and subtle tonal contrast over elevation

#### **Table rules**

- Row height: **44px to 52px**
- Dense mode allowed for advanced views
- Sticky headers where useful
- Strong column labels
- Sort and filter affordances should be visible, not hidden

### **Responsive breakpoints**

Use mobile-first scaling.

- **Mobile:** 0–639px
  - Stack sections
  - Collapse secondary metadata
  - Keep actions thumb-reachable
- **Tablet:** 640–1023px
  - Retain side nav as icon rail or drawer
  - Prioritize one primary panel
- **Desktop:** 1024–1439px
  - Full workspace layout
  - Multi-column comparisons
- **Wide desktop:** 1440px+
  - Support denser benchmarking and table views
  - Do not let pages become overly stretched

### **Layout principle**

This should feel like **a workspace, not a BI report**.

## **Motion and interaction**

The design-tips file recommends thinking in scenes, not screens, and prompting behavior, not just state. That is the right approach here. Motion should describe how the workspace behaves under pressure: calm, exact, and quietly responsive.

### **Motion tone**

- Gentle
- Confident
- Fast
- Low-amplitude
- Never theatrical

### **Motion standards**

- Hover response: **120–160ms**
- Filter updates: **180–220ms**
- Modals and drawers: **220–280ms**
- Toasts and confirmations: **180–240ms**
- Avoid motion longer than **300ms** unless there is a rare cinematic moment on marketing pages

### **Easing**

- Use soft ease-out for UI transitions
- Use subtle spring for:
  - drawers
  - modals
  - command surfaces
- Avoid bounce-heavy motion
- Avoid layered motion stacks that make dense pages feel busy

### **Interaction behaviors**

#### **Hover**

- Rows highlight softly
- Buttons darken or lighten slightly
- Icons gain clarity, not glow
- No dramatic scaling

#### **Tap / click**

- Immediate visual response
- Respectful pressed state
- No ambiguous loading gaps

#### **Loading**

- Use inline skeletons
- Use optimistic framing where possible
- Avoid blocking spinners unless the whole view truly depends on one result

#### **Audit completion**

Should feel satisfying, but restrained:

- subtle success state
- clear timestamp
- immediate path to findings

#### **Empty states**

Must feel patient and useful.

Example:

- “No competitor gaps yet. Run your first audit to surface where rivals lead.”

#### **Error states**

Must guide, never scold.

Example:

- “We couldn’t finish this audit run. Your setup is saved. Try again or review the last completed run.”

### **Kindness in interaction**

The design-tips file is clear here: kindness shows up in forgiveness, patient empty states, invisible friction removal, and micro-interactions that acknowledge action without demanding attention.

For bVisible, that means:

- saved progress in setup
- clear undo where possible
- non-destructive defaults
- helpful retry states
- gentle confirmations
- no blame language

## **Voice and tone**

The copy should feel:

- Precise
- Calm
- Competent
- Understated
- Execution-first

### **Copy principles**

- Prefer short, direct sentences
- Name the state clearly
- Explain why it matters
- Suggest the next action
- Avoid hype language
- Avoid marketing fluff inside the workspace

### **Microcopy examples**

#### **Onboarding**

- “Set up your workspace.”
- “Add your site, competitors, and focus areas.”
- “You can refine this later.”

#### **Success**

- “Audit complete.”
- “Your brand appears in 42% of tracked prompts.”
- “Three topic gaps need attention.”

#### **Error**

- “We couldn’t finish this check.”
- “Your previous results are still available.”
- “Try again or review audit settings.”

#### **Recommendations**

- “Recommended next move.”
- “Publish a comparison page for this topic cluster.”
- “This could improve visibility in high-intent prompts.”

## **System consistency**

Consistency should come from **recurring behavior**, not visual repetition alone.

### **Recurring patterns**

- Metric strip at top of analytical pages
- Compact filter bar
- Dense table or list as primary work surface
- Evidence available one layer deeper
- Recommendation triage pattern repeated across pages
- “Winning / tied / losing” used consistently in comparisons
- Monochrome first, semantic state second

### **Recurring metaphors**

- **Mission control**
  - You are monitoring signal
- **Operator workspace**
  - You are triaging, not browsing
- **Content backlog**
  - Topic gaps are work, not just insight

### **Pattern anchors**

- Linear for compact operations
- shadcn/ui for structure and component discipline
- Apple HIG for restraint and polished feedback

## **Accessibility**

Accessibility should be built into the visual system, not added late.

### **Semantic structure**

- One clear H1 per page
- Logical H2/H3 nesting
- Landmark regions for:
  - navigation
  - main content
  - filters
  - supporting details
- Use semantic tables for benchmarking and citation views

### **Keyboard navigation**

- All filters usable by keyboard
- Visible focus states on all interactive elements
- Command surfaces navigable without pointer dependence
- Modals trap focus correctly
- Escape closes non-destructive overlays
- Tables support clear tab order and row actions

### **Focus indicators**

- Focus ring must be obvious in both light and dark mode
- Do not rely on browser default alone
- Focus state should fit the monochrome system but still stand out clearly

### **Color and state accessibility**

- Never encode meaning in color alone
- Pair semantic color with:
  - label text
  - icons
  - directional markers
- Verify all text against **WCAG AA**
- Use accessible contrast on borders and muted labels

### **ARIA and assistive support**

- ARIA labels for filters and icon-only actions
- Table summaries where complex comparisons exist
- Live region support for audit completion and async updates
- Clear accessible names for model comparison controls

### **Comfort and inclusivity**

- Avoid overstimulating motion
- Support reduced-motion preferences
- Keep dense pages readable with spacing discipline
- Ensure touch targets remain usable on small screens

## **Emotional audit checklist**

Review each major design decision with these questions:

- Does this interface evoke the intended emotion:
  - calm
  - capable
  - precise
  - kind
- Are motion and copy reinforcing that emotion?
- Would a tired user still understand the next step?
- Does the product feel quietly powerful rather than cold?
- Do empty and error states support the user without blame?
- Does the experience build confidence after one minute of use?

## **Technical QA checklist**

- Typography scale follows spacing rhythm
- Body text line-height stays at 1.5× or higher
- Core text and backgrounds meet WCAG AA+
- Interactive states are distinct and perceivable
- Hover, focus, pressed, disabled, and loading states all exist
- Motion stays within **150–300ms** for standard UI
- Tables remain readable at common laptop widths
- Semantic color is not the only meaning carrier
- Dark mode preserves hierarchy and contrast
- Empty, loading, and failure states feel intentional

## **Adaptive system memory**

No prior `design-guidelines.md` exists in this project yet.

For future iterations, keep these elements stable unless the brand changes:

- monochrome base
- compact hierarchy
- quiet motion
- operational typography
- Linear-inspired information density

Future reuse suggestion:

- Keep the core monochrome palette and type rhythm as the long-term brand system
- Let only semantic states and marketing accents evolve

## **Design snapshot output**

### **Color palette preview**

Light  
\#0F0F10 Primary text  
\#FFFFFF Background  
\#F7F7F8 Panel background  
\#E6E7EB Border  
\#6B7280 Muted text  
\#18181B Accent black  
\#15803D Positive  
\#B45309 Warning  
\#B91C1C Negative  
\#2563EB Info

Dark  
\#F4F4F5 Primary text  
\#0B0B0C Background  
\#131316 Panel background  
\#26272B Border  
\#9CA3AF Muted text  
\#FAFAFA Accent white

### **Typographic scale**

| Token      | Size | Weight | Line height |
| ---------- | ---- | ------ | ----------- |
| H1         | 40px | 700    | 48px        |
| H2         | 28px | 650    | 36px        |
| H3         | 22px | 600    | 30px        |
| H4         | 18px | 600    | 26px        |
| Body Large | 16px | 450    | 24px        |
| Body       | 14px | 450    | 22px        |
| Label      | 12px | 500    | 18px        |
| Caption    | 11px | 500    | 16px        |

### **Spacing and layout summary**

- 8pt grid system
- 16px or 24px card padding
- 16px standard gaps
- left nav \+ top command area \+ main content
- compact cards and structured tables
- responsive density, never stretched emptiness

### **Emotional thesis**

**A calm, monochrome command center that turns AI visibility into clear, confident action.**

## **Design Integrity Review**

This system aligns emotional and technical intent well. The monochrome palette, compact hierarchy, and restrained motion support the product’s goal of feeling sharp, calm, and quietly powerful. The strongest quality is that the interface is built to reduce interpretation time, which fits both Steve Krug’s usability rule and the design-tips emphasis on kindness through invisible clarity.

The one improvement I would push next is **a more explicit empty-state system**. In a data product, early sessions can feel cold. If those empty and first-run moments are especially patient, clear, and confidence-building, bVisible will feel less like a monitor and more like a trusted operator tool.
