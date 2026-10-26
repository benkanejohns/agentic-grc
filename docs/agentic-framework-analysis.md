# Analysis: OWASP Agentic Skills Top 10 relevance to Agentic GRC

## Context

Ben asked for an analysis-only review of the new OWASP "Agentic Skills Top 10" (AST01–AST10) whitepaper, and whether it has relevance to the Agentic GRC project, specifically whether/how it could be woven into `docs/grc-handbook.md`, the site's declared "ground truth" document. No changes were made; this is pure analysis, per explicit instruction.

## Verdict: Yes, high relevance, and it's a near-perfect fit for the handbook's existing "GRC of agents" pillar

The handbook (v2.0) already runs a "GRC of agents" thread throughout: the agent registry, autonomy appetite statements, the autonomy ladder, the agentic risk register, and "controls on the agents themselves." OWASP AST01–10 is a concrete, evidence-backed taxonomy for exactly one slice of that surface, **agent Skills** (SKILL.md bundles: Claude Skills, OpenClaw/ClawHub skills, etc.), which the handbook currently only touches indirectly.

Three reasons this isn't just "another framework to cite":

1. **Direct structural overlap, not duplication.** Several AST risks sharpen or extend rows already in the handbook's "agentic risk register" (`docs/grc-handbook.md:151-158`) rather than repeating them:
   - AST03 (Over-Privileged Skills) ↔ existing "Autonomy overreach" row; AST03 gives it teeth: permission manifests, LPCI (logic-layer prompt control injection).
   - AST01/AST02/AST04 (Malicious Skills / Supply Chain / Insecure Metadata): a supply-chain flavor not currently named as its own register line: skills as a distribution channel, distinct from model/vendor concentration.
   - AST05 (Untrusted External Instructions): a genuinely new nuance: skills that fetch external docs *at runtime* are a mutable trust surface with no pinning equivalent. Not covered by anything currently in the register.
   - AST07 (Update Drift) vs. existing "Silent behaviour drift": worth distinguishing: the handbook's row is about model updates; AST07 is about skill/package updates. Different failure mode, same "pin and verify" mitigation family.
   - AST09 (No Governance) maps almost 1:1 onto the "Governing agents" subsection (`docs/grc-handbook.md:105-113`), but from an auditor's checklist angle rather than a governance-design angle. Complementary, not redundant.
   - AST10 (Cross-Platform Reuse): a new angle entirely: what happens when a skill moves between OpenClaw → Claude Code → Cursor and its permission manifest gets silently stripped. Nothing in the current handbook addresses portability loss.

2. **Standards alignment is already compatible.** OWASP's own ISO/IEC 42001 Annex A crosswalk (in the source doc) lines up with obligations the handbook already lists (ISO 42001, EU AI Act, NIST AI RMF are already in the handbook's glossary and obligations table at `docs/grc-handbook.md:196`). This isn't a competing framework; it's a shared vocabulary extension.

3. **It's operationally true of this very project, not just a checklist.** AgenticGRC.io is itself built and maintained using Claude Skills (`.claude/skills/`, the gstack skill suite invoked throughout this session, including `/browse`, `/ship`, `/qa`, etc.). Manifesto Principle 4 ("Agents are controls, and controls get assessed... We apply ISO 42001 thinking to our own tooling before we point it at anyone else's") means the org publishing this handbook is, by its own stated standard, on the hook to actually assess the skills it uses. That's an authentic, checkable case study, not slideware.

## Where it could concretely land (for a future pass, not this one)

Three independent integration points, each low-friction and additive (no restructuring needed):

- **Releases (blog) post**: lowest-commitment option. Fits the site's stated purpose ("the record... working systems, stated limitations, no slideware"). Could double as a real self-audit: score AgenticGRC.io's own skill usage against AST01–10, which is exactly the kind of "eat your own cooking" content the manifesto promises.
- **Handbook update**: add 1–2 rows to "The agentic risk register" table (AST05 untrusted-external-instructions gap, AST10 cross-platform reuse gap), one row to "Controls on the agents themselves" (skill vetted against a known attack taxonomy before install; evidence: scan report / signature record), and cite OWASP AST01–10 as a source in the "Where obligations come from" table alongside EU AI Act / ISO 42001. The handbook's own review cadence is "Annually or on material change" (`docs/grc-handbook.md:9`); a new OWASP top-10 for a risk class the handbook already claims to cover is a reasonable trigger.
- **Both, sequenced**: blog post now (timely reaction), handbook update on the next material-change pass (durable reference), rather than editing the "bible" reactively.

No file changes have been made to the handbook. This document exists only to capture the analysis; nothing here should be executed without confirming which of the above (if any) is wanted next.

---

## Deep-dive: AST01–AST10 vs. the actual handbook, section by section

Ben asked for more depth before deciding on an integration path. Below is a risk-by-risk crosswalk against the live `docs/grc-handbook.md` v2.0 content (not a generic guess; each row cites the actual existing section), plus a grounding check against how this project itself consumes skills.

### Self-audit grounding (why this isn't a strained metaphor)

Checked `/Users/benjohns/repos/AgenticGRC/.claude/`: empty, no project-vendored skills. All skill execution for this project runs through the user-level `~/.claude/skills/` directory, which includes a third-party skill suite ("gstack") installed as a **git repository** with a `VERSION` file (`1.26.0.0`) and no visible per-skill cryptographic signature or permission manifest at the top level. It also ships a literal `.openclaw/` compatibility folder, the same platform OWASP's document uses as its running example. This is a live, checkable instance of the exact trust model AST01/AST02/AST07 describe: a third-party-authored bundle of instructions, updated via git pull, running with the host tool's full permissions, with version tracking but no visible signing. Good, honest material for a self-audit, not hypothetical.

### Risk-by-risk crosswalk

| AST | Risk | Handbook coverage today | Verdict |
|---|---|---|---|
| AST01 | Malicious Skills | "Prompt injection & tool misuse" register row (`:153`) covers a *live agent* being manipulated; it does not cover a *third-party skill artifact* shipping a hidden payload before it's ever invoked. Different threat shape: install-time vs. runtime. | **Gap** |
| AST02 | Supply Chain Compromise | Existing "Vendor / subprocessor review before adoption" control (v1.0 carryover) is scoped to SaaS vendors, not to skills/plugins as software dependencies. | **Gap** |
| AST03 | Over-Privileged Skills | Strong overlap: "Autonomy overreach" register row (`:156`) + most of "Controls on the agents themselves" (`:221-233`, least-privilege, human-in-loop gates). | **Well covered**: AST03's LPCI mechanism is good supporting detail, not a new control |
| AST04 | Insecure Metadata | The agent registry (`:109`) records self-declared purpose/autonomy/scope, but nothing asks "is that declaration honest?" No brand-impersonation, permission-understating, or risk-tier-spoofing check anywhere. | **Gap**: easy extension: validate declared capabilities against sandboxed behavior before registry entry |
| AST05 | Untrusted External Instructions | Not mentioned anywhere. No handbook content addresses skills that fetch external docs *at runtime* as a mutable, unpinned trust surface that can change after approval. | **Gap**: genuinely novel risk shape |
| AST06 | Weak Isolation | Loosely implied by "read-only scopes" language in the worked example (`:312`), but isolation/sandboxing of skill execution itself is never named as its own control. | **Partial** |
| AST07 | Update Drift | "Model updates through change management, with regression evals" control (`:232`) and "Silent behaviour drift" register row (`:158`) are both scoped to *model* updates, not skill/package version drift. | **Partial**: adjacent, worth broadening or adding a sibling row |
| AST08 | Poor Scanning | No pre-deployment vetting/scanning control exists in "Controls on the agents themselves" at all. | **Gap.** OWASP's "report bypass rate alongside detection rate" guidance is strong audit-engagement material |
| AST09 | No Governance | This is the handbook's strongest area already: the full "Governing agents" subsection, agent registry, and autonomy ladder are a mature answer. | **Well covered**, but OWASP's Bilateral Receipt Pattern (tamper-evident admission/outcome receipts, EU AI Act Article 12 tie-in) is genuinely better *implementation* detail than the handbook's current one-line "Complete action logging" control (`:228`) |
| AST10 | Cross-Platform Reuse | Not mentioned. Nothing addresses what happens to a skill's declared permissions when it moves between platforms, despite the handbook already discussing multi-agent relay pipelines. | **Gap**: genuinely novel |

**Net finding:** 6 of 10 (AST01, AST02, AST04, AST05, AST08, AST10) are outright gaps against the handbook's own stated "GRC of agents" scope, not decorative citations. 2 (AST03, AST09) reinforce and could deepen existing sections. 2 (AST06, AST07) are partial/adjacent and worth broadening rather than adding fresh.

## Deep-dive 2: how the two pieces of work coexist (not just where they overlap)

Ben's follow-up: not "where are the gaps" but "how do these two documents interchangeably coexist", i.e. what's the actual relationship model between a company-wide GRC operating handbook and a narrow, technical, community-maintained attack taxonomy, and can they be used together without conflict or duplication.

### A. They sit at different altitudes, which is why they don't compete

The handbook is **horizontal and decisive**: whole company, all four functions (Governance/Risk/Compliance/Audit), one page, answers "who is accountable and what do we do." OWASP AST is **vertical and diagnostic**: one narrow artifact type (agent Skills), exhaustive attack scenarios, code samples, CVEs. This is the same relationship the handbook already has with SOC 2 and ISO 27001: the handbook doesn't inline the SOC 2 Trust Services Criteria, it cites SOC 2 as an external thing the org gets certified against. OWASP AST slots into the same role: an external, specialist reference the handbook points to rather than absorbs.

### B. Where they structurally interlock (not just conceptually related)

These aren't loose analogies; they're literal plug-in points in the handbook's *existing* machinery:

- **Risk lifecycle** (`docs/grc-handbook.md`, "Identify → Assess → Treat → Monitor → Report"): OWASP's own "Decision Tree: Which AST Does My Finding Belong To?" (source doc p.9) is a ready-made triage tool for exactly the *Identify* step, scoped to skill-sourced findings. It doesn't replace the handbook's lifecycle; it feeds it, the same way an incident post-mortem or a vendor review already feeds the register today (`:121`).
- **Three lines of defence / "agent inherits the line of its human owner"** (`:285`): OWASP's MAESTRO-layer mapping and "Related Agentic Skill Risks" cross-references use the same layered-independence logic. AST08's warning about scanner impersonation and AST01's warning about scanner skills being malicious are just concrete instances of the handbook's existing rule "agents never audit themselves" (`:348`), reinforcement, not a new rule.
- **Internal audit engagement list** (`:185`, "did the quarterly access reviews actually happen..."): AST08's guidance to "report bypass rate alongside detection rate" is a natural additional bullet on that same list, a skill-scanning-specific version of an audit test the handbook already runs for other controls.
- **Control rationalization (one control, multiple frameworks satisfied)**: the strongest form of "coexistence," and a named GRC practice, not just my framing: implementing OWASP's Bilateral Receipt Pattern would simultaneously (a) satisfy the handbook's existing "Complete action logging" control (`:228`), (b) count as evidence for the EU AI Act Article 12 obligation already in the handbook's obligations table (`:196`), and (c) address AST09. One piece of engineering work, three compliance claims. That's the concrete, actionable form of "interchangeable."

### C. Where they'd actually clash if merged carelessly: needs active reconciliation, not just adoption

- **Two different numbering schemes that look identical.** The handbook's Autonomy Ladder (`:326-330`) uses "Level 1/2/3" to mean *how much decision-making the agent holds* (assist / automate / supervised autonomy). OWASP's Universal Skill Format proposal uses `risk_tier: L0-L3` to mean *how destructive the skill's declared capability is* (safe / low / elevated / destructive). These measure completely different things but use near-identical labels. Any integration must explicitly keep these separate and re-labelled; otherwise the handbook, which is supposed to be the unambiguous "bible," would introduce its own internal ambiguity.
- **Voice/altitude mismatch.** OWASP's document is full of Python/YAML code blocks and CVE numbers: implementation detail for engineers building scanners. The handbook currently contains *zero* code, deliberately, because its audience is "anyone in the company" (`:29`), not just engineers. Anything code-level from OWASP AST belongs in a separate engineering runbook, not pasted into the handbook; pulling it in directly would break the handbook's own stated voice.
- **Versioning cadence mismatch.** The handbook reviews "Annually or on material change" (`:9`). OWASP AST is a live community project (GitHub PRs, versioned like other OWASP Top 10s). The handbook already has the exact mechanism needed for this: its closing note already says external frameworks cited (EU AI Act, ISO 42001, NIST AI RMF) are "pointers to check against current versions" (`:382`) rather than embedded content. OWASP AST should be added to that same pointer list, not copied in, so the handbook never goes stale relative to OWASP's own revisions.

### D. Net model for coexistence

Handbook = the stable, decisive operating document that says *who* is accountable for agent/skill risk and *how* it flows through the existing four-function loop. OWASP AST = a versioned, external, specialist input consumed **at the Identify/Assess step of the risk lifecycle and at the control-evidence level**, cited by name and version, not absorbed, with any code/implementation detail kept out of the handbook entirely. This is structurally identical to how SOC 2 and ISO 27001 already coexist with the handbook today.

## Deep-dive 3: are the two pieces of work actually at odds?

Ben's sharper question: OWASP AST catalogs threats/vulnerabilities *of* agentic systems (skills/tools). AgenticGRC describes an operational framework for *using* agentic systems to assist, and potentially, someday, replace, the human GRC function. Is there a real conflict there?

### My opinion, stated plainly

**No philosophical conflict between OWASP AST and the handbook as currently written.** They share the same worldview. **But there is a real tension, and it's not the one the framing implies**: it's not "risk catalog vs. operating framework," it's a **maturity/evidence gap**: the handbook describes a target operating state that OWASP's own evidence says the underlying technology cannot yet safely support. **And separately, the "someday replace the human GRC person" ambition is at odds with the handbook's own current published text**, not primarily with OWASP.

### 1. No worldview conflict: they're built on the same premise

AgenticGRC's founding documents are already deeply skeptical of ungoverned agent autonomy, independent of OWASP:
- Manifesto Principle 1: "Creativity is a defect in this context, not a feature."
- Handbook first principle (`:53`): "Accountability never transfers to an agent... 'the agent did it' is never an accepted root cause."
- Handbook autonomy ladder (`:332`): "There is no Level 4. Un-audited, unbounded autonomy is not a maturity stage; it is the anti-pattern the rest of this handbook exists to prevent."

OWASP AST's core thesis (that agent skills are currently under-governed and need signing, scanning, isolation, and audit trails) is the *same* governance-first instinct, applied to one specific technical substrate. If anything, OWASP AST reinforces the handbook's premise rather than opposing it.

### 2. The real tension: an aspiration/evidence gap, not a philosophy gap

The handbook's worked example (`:305-316`) describes an evidence-collection agent operating at **autonomy Level 2-3** (filing evidence, running with scoped credentials, subject to human-in-the-loop gates) as an achievable, safe target state today. That target implicitly depends on the underlying skill/tool substrate actually delivering: signed artifacts, isolated execution, effective pre-deployment scanning, and permissions that survive being ported between platforms.

OWASP AST's evidence says that substrate is not reliably there yet, in the ecosystem the handbook's own "agentic-GRC" pitch depends on:
- Trail of Bits (Jun 2026) bypassed **every scanner tested** across ClawHub, Cisco's scanner, and skills.sh; concluded the "trust model is broken at the root."
- LAAF (Atta et al.) confirmed LPCI (an agent performing a privileged action it was technically permitted to do, without real consent) reproducible across **five production LLM platforms**, including a single-attempt success against Claude specifically.
- ClawHub had no automated scanning at all at the time of a 1,184-skill malware campaign.

So the honest framing isn't "OWASP thinks agents are dangerous, AgenticGRC thinks agents can help"; it's "AgenticGRC's operating model assumes a level of substrate maturity that OWASP's own evidence shows doesn't reliably exist yet." That's a real, citable gap between the handbook's aspiration and current technical reality, and naming it explicitly would actually be *in service of* the manifesto's own Principle 6 ("working systems over slideware... limitations stated plainly"), not a threat to it.

### 3. The sharper conflict is internal, not external

"Potentially someday replacing the human GRC person" is not at odds with OWASP AST specifically; it's at odds with **what the handbook itself currently says**, as the org's own declared single source of truth:
- `:53`: "No agent signs off a risk acceptance, approves a control exception, or attests to a regulator."
- `:332`: full autonomy is explicitly named as *the anti-pattern the handbook exists to prevent*, not a maturity milestone to reach.

If full replacement becomes a real direction, that's a material change to the handbook's own first principle, not an extension of it; worth being direct about rather than smoothing over, especially in a "bible" whose stated rule is "if the handbook is wrong, fix the handbook" (`:29`) rather than letting the roadmap silently diverge from the published doctrine.

## Deep-dive 4: ACSC/ASD "Opportunities for AI in cyber defence" vs. AgenticGRC

New source: https://www.cyber.gov.au/business-government/secure-design/artificial-intelligence/opportunities-for-ai-in-cyber-defence, published by ASD's ACSC, co-sealed by Canada's Cyber Centre, NZ's NCSC-NZ, and UK's NCSC-UK (first published 27 May 2026, updated 12 Aug 2026). Audience: CISOs and senior security leaders. Structured around the Australian Information Security Manual's (ISM) six functions: **Govern, Identify, Protect, Detect, Respond, Recover**.

### Where it sits relative to the other two documents

Three different altitudes, now confirmed across three real documents:
- **AgenticGRC handbook**: broadest: whole-company GRC operating model, any agentic system, any business function.
- **ACSC guidance**: domain-specific instance of the same idea: how does the CISO's own cyber-defence function specifically use AI/agentic AI to do its job, mapped to the ISM's six security functions.
- **OWASP AST**: narrowest/deepest: one artifact type (Skills) within agentic systems, exploit-evidence-driven.

None compete. ACSC's document is, if anything, the **closest sibling in tone** to AgenticGRC of the three; it's explicitly an "opportunity + governance" framing (agents doing defensive work, under supervision), not just a threat catalog, which maps directly onto AgenticGRC's own "Agents doing GRC" pillar. Cyber defence and GRC are adjacent, often-overlapping disciplines in practice.

### Strong alignment: often near word-for-word

- ACSC: "AI should support cyber defenders, not replace human judgment... ensure AI supports, rather than replaces, human accountability for cyber security outcomes." ↔ Handbook `:53`: "Accountability never transfers to an agent."
- ACSC: "limit autonomous actions to those that are narrowly scoped, preapproved and reversible." ↔ Handbook's autonomy ladder Level 2 "Automate: Agent runs the work; human approves before effect" (`:329`). ACSC's three-word test (*narrowly scoped, preapproved, reversible*) is arguably a cleaner articulation of the same idea and worth citing as a sharpening of the existing ladder language, not a replacement.
- ACSC: "The use of agentic AI introduces additional risk because these systems can initiate and carry out actions with reduced human involvement... tightly governed, clearly limited." ↔ Handbook's "no Level 4... the anti-pattern the rest of this handbook exists to prevent" (`:332`).
- ACSC's Govern function ("clear accountability, decision making structure and oversight mechanisms," "AI-specific threat intelligence sharing," policy interpretation via internal AI assistants) maps closely onto the handbook's existing "Governing agents" subsection (`:105-113`) and the Security Steering Committee forum (`:120`).

### A genuinely useful cross-reference: it validates the OWASP AST integration question directly

Under its **Detect** function, ACSC explicitly instructs organisations to "leverage frameworks such as MITRE ATLAS™, **OWASP Top 10 for LLM Applications, OWASP Top 10 for Agentic Application**, NIST AI RMF Generative AI Profile and MAESTRO threat model to inform AI-supported detection of malicious behaviours." That's a national cyber authority naming the exact same reference family (OWASP + MAESTRO + NIST AI RMF) that the Agentic Skills Top 10 document maps itself onto in its own "OWASP Mapping" / "CSA MAESTRO Framework Mapping" sections reviewed earlier. This is independent confirmation that treating OWASP-family taxonomies as an external input to the handbook's risk register (Deep-dive 1/2 above) is well-directioned, not a stretch.

### New, concrete, genuinely borrowable content (not present in the handbook today)

- **"AI Secure by Demand"**: a named principle: buyers should only purchase Secure-by-Design AI products and hold vendors accountable for that responsibility. This is a natural, citable extension of the handbook's existing "Vendor / subprocessor review before adoption" control, currently a one-line control with no assessment mechanic behind it.
- **Appendices A & B (vendor assessment questions)**: structured procurement questions across measurable outcomes, human oversight, transparency/auditability, AI-system security, data sovereignty, and resilience/rollback. Directly usable as the evidence/assessment mechanic behind the handbook's vendor-review control, and equally applicable to AgenticGRC's own tooling choices (the same lens used for the gstack self-audit in Deep-dive 1).
- **AIBOM (AI bill of materials)**: cited alongside SBOM as a supply-chain visibility mechanism. Not mentioned anywhere in the handbook currently; a small, concrete addition to the "Where obligations come from" table.
- **Testing/assurance discipline for AI tools themselves**: "test how cyber defence activities continue when AI tools fail, are compromised, or produce unreliable outputs, including fallback and escalation arrangements." This is the same "test the fallback, not just the primary path" instinct already in the handbook's controls table (backup restore testing), just not yet applied to AI/agent tooling specifically.

### A genuine structural gap worth naming

ACSC/ISM's six functions (Govern, Identify, Protect, Detect, **Respond, Recover**) are an incident-lifecycle model. AgenticGRC's four functions (Governance, Risk, Compliance, Audit) are an accountability/assurance model, a different *shape* of framework, not a subset. Mapping is clean for four of the six: Govern↔Governance, Protect↔Compliance ("implement and maintain controls" is literally the Compliance function's own definition, `:143`), Identify spans Risk+Compliance, Detect spans Compliance+Audit. But **Respond and Recover have no clean home in the handbook's current four-function model**, and ACSC's sharpest autonomy-risk material lives specifically in those two functions (pre-approved reversible response actions, human approval required for high-impact containment/recovery, rollback of compromised AI models). This mirrors the risk_tier/autonomy-Level labelling clash found in Deep-dive 3: not a conflict, but a real seam that would need active reconciliation, most likely by locating incident response/recovery ownership explicitly within Risk or Compliance (where escalation paths and control operation already live) rather than assuming a dedicated pillar exists.

### Companion document not yet reviewed

ACSC's guidance cites, twice, a companion publication: **"Careful adoption of agentic AI services"** (co-authored by CISA, NSA, CCCS, NCSC-NZ, NCSC-UK), the canonical Five-Eyes-family guidance specifically on adopting agentic AI broadly (not scoped to cyber defence, not scoped to skills). Given the pattern across all three documents reviewed so far, this is likely the single most directly relevant companion piece to AgenticGRC's "GRC of agents" pillar, flagged here as a natural next document, not yet fetched or analysed.

### Scope caution

The source PDF is ~60 pages including leadership/acknowledgements and heavy vendor-specific detail (ClawHub, OpenClaw CVEs, specific scanner products). The handbook is ~380 lines, tightly written, deliberately opinionated. Any integration should borrow the *risk shape* and the *Bilateral Receipt Pattern* implementation guidance, not paste the taxonomy wholesale; pattern-matching the handbook's existing terse, table-driven style rather than OWASP's denser prose.
