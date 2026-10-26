# Episode 1 video script: User Access Review

**Working title:** "I built a GRC agent that can't lie to you about what it decided"
**Target length:** 8-10 minutes
**Audience:** GRC/security practitioners, engineers, CTOs
**Goal:** make all three groups believe this is worth cloning and trying, for different reasons each

Stage directions are in *italics*. Everything else is said to camera or voiced over a screen recording.

---

## 1. Cold open (0:00-0:30)

*Screen: terminal, empty. Or face to camera, your call.*

"Every 'agentic GRC' demo you've seen sells you autonomy: an agent that runs the whole workflow and hands you a finished answer. I'm going to show you one that does the opposite on purpose, and I'm going to show you the exact place where it gets things wrong, because if I don't show you that, you have no reason to trust the places where it gets things right."

---

## 2. The problem, and why most answers to it are wrong (0:30-1:30)

*Screen: agenticgrc.io manifesto page, scrolling slowly as you talk.*

"GRC work, access reviews, control testing, risk assessments, is mostly manual, sampled, and done once a quarter because that's all anyone has time for. AI obviously helps here. But the current pitch for 'agentic GRC' from most vendors is: the agent reviews it, the agent decides, you get a dashboard. That's a great demo. It's a bad idea the first time an auditor asks 'why did the system approve this,' and the honest answer is 'the model felt like it.'

So I wrote down a different definition. Not autonomy, determinism, evidence, and a human decision point that never moves. That's the manifesto, at agenticgrc.io. And then I wrote the operating principles down as something stricter than a mission statement, I call it the Standard, agenticgrc.io/standard, it's structured to be pasted into an agent's own instructions. Today I'm showing you the first real thing built to it."

---

## 3. What we built, in one sentence (1:30-2:15)

*Screen: GitHub repo, benkanejohns/agentic-grc-access-review, README open.*

"This is a User Access Review agent. Every security team runs this process: who has access to what, is it still appropriate, has anyone gone stale. It's tedious, it's manual, and it's exactly the kind of work that gets rubber-stamped under deadline pressure, which is precisely when you don't want rubber-stamping.

Here's the one architectural decision that matters: the model never decides whether an access grant passes or fails. It reads the access data and classifies it; a separate, plain piece of code, no model involved, decides the verdict. I'm going to show you that split live, not describe it."

---

## 4. Live demo: the setup (2:15-3:00)

*Screen: terminal, repo cloned, `sample_data/aws_iam_sample.csv` open in an editor.*

"This is shaped like a real AWS IAM credential report, sixteen users, their roles, when they last logged in, whether MFA is on. In a real environment this comes from your AWS account. Here it's a sample file so you can run this in the next thirty seconds with zero AWS setup.

[*Run:*]
```
python review.py review --input sample_data/aws_iam_sample.csv --connector aws
```

[*Let it run. Narrate while it's calling the API:*] "Each row is going to Claude once, and only for one job: classify this role's privilege level, and whether it looks appropriate for this person's department. That's it. It doesn't get asked whether this is okay."

---

## 5. Walking the output: where it's effective (3:00-5:30)

*Screen: the rendered markdown table, scrolled to specific rows.*

"Here's the report. Every row, a status, and the reasons behind it, in plain English, not a score with no explanation.

[*Point to `bob.martinez`:*] "This one's flagged, full admin access, MFA not enabled, no activity in almost a thousand days. Nobody had to eyeball this. A deterministic rule caught it the moment the data came in, because the rule is just: is this privileged, and is it stale. Code did that, not the model's judgement.

[*Point to `olivia.turner`:*] "This one's more interesting. Full admin access, MFA on, recent activity, looks clean on every objective number. But she's in Marketing. The model read the role name against her department and flagged a mismatch, why does a marketing role have full administrative access to the AWS account? That's not a date comparison, that needed the model to actually read the context. And notice what it didn't do: it didn't revoke anything, it didn't approve anything. It surfaced a question for a named human to answer. That's the reviewer-decision column, still blank, on purpose."

---

## 6. Determinism, proven, not claimed (5:30-6:30)

*Screen: `runs/` directory, cat the `.jsonl` log file.*

"Every single one of those classifications got logged, the input, the model's raw answer, the rule that fired, the model version, the timestamp. Watch this:

[*Run:*]
```
python review.py replay --run runs/<timestamp>.jsonl
```

"Same report, instantly, zero API calls. If an auditor asks me to reproduce this finding from last quarter, I'm not re-running the model and hoping it agrees with itself. I'm handing them the record. That's the difference between 'the AI said so' and evidence."

---

## 7. Where this is not effective yet (6:30-8:00)

*Screen: back to the code, `models.py` or the README's "Adding Azure or GCP" section.*

"Now the part most people doing this kind of video skip, and it's the part that actually matters. This agent classifies off the *role name*, `Finance-Billing-Admin`, `ReadOnlyAccess`, whatever string AWS gives it. It has no visibility into the actual IAM policy document behind that name.

That means a role called `ReadOnlyAccess` that someone quietly attached broader permissions to, without renaming it, sails through this agent looking exactly like a genuinely read-only role. The model isn't failing here, it's doing exactly what it's told: classify what's in front of it. But what's in front of it is a label, not the ground truth. That's a real limitation, not a hypothetical one, and it's exactly why the Standard says the model should say 'I don't have enough information' rather than guess past a gap like this, which, honestly, this version doesn't do well enough yet either. That's next.

The fix isn't 'use a smarter model.' The fix is architectural: pull the actual attached policy document, not just its name, which is also exactly how this becomes a live AWS integration instead of a sample file, and exactly the same connector pattern that'll bring in Azure and GCP. Same core, better input."

---

## 8. Why this should matter to you, specifically (8:00-9:00)

*Screen: back to face camera, or the repo's root README.*

"If you do GRC work: this doesn't replace the access review, it removes the part where you're squinting at a spreadsheet trying to spot the one stale admin account in four hundred rows. You still sign off. You always sign off.

If you're an engineer: go read `classify.py` and `rules.py`, they're both under fifty lines. The interesting part isn't the AI call, it's the five lines of plain code next to it that actually make the decision. That's the whole argument of this project in one file.

If you're a CTO or a risk owner evaluating whether to let agents near GRC work at all: this is what 'eating your own cooking' looks like when it's not a slide. Clone it, run it against your own sample data, read the log file it produces, and ask your vendor's agent to show you the equivalent. If it can't, that tells you something.

It's at github.com/benkanejohns/agentic-grc-access-review, MIT licensed, the Standard it's built to is at agenticgrc.io/standard. Try it, break it, and if you find a case where the rules engine gets it wrong, that's not an embarrassment to me, that's the next episode."

---

## Production notes

- **B-roll/cutaways to consider:** the manifesto page's principle cards while discussing determinism/evidence; the Standard's "Enforced by" tags under Principle 2 specifically, it's the single clearest visual proof of the prompt-vs-enforcement argument.
- **The one risk in this script:** don't let section 7 (limitations) feel like an apology. The tone should be closer to a security engineer doing a credible self-assessment than a disclaimer. That's the whole differentiator from vendor demos.
- **Don't over-promise Azure/GCP:** say "same connector pattern," not "coming soon", no date's been committed to either.
- **Before recording:** run the live command yourself with a real key first. If Claude's actual classification output differs meaningfully from what's narrated above (it should be close, but it's a live model call, not scripted), adjust the specific examples in sections 5 and 7 to match what you actually see on screen.
