**Rails schema draft**. This is a draft. If we need to are other indexes or different migrations, just go ahead

1. **Core models + associations**
2. **Suggested fields (attributes)** for each

---

# 📐 Rails Schema Draft for *Job-tracker*

---

## **User**

*(if multi-user or just for you but future-proof)*

* `email:string`
* `password_digest:string` (if auth needed)
* `name:string`

---

## **Company**

Represents the organization.

* `name:string`
* `industry:string`
* `website:string`
* `linkedin_url:string`
* `notes:text`
* `tech_stack:text`

**Associations:**

* has\_many \:job\_openings
* has\_many \:contacts

---

## **Contact**

People connected to a company (recruiter, hiring manager, engineer).

* `name:string`
* `role:string` (Recruiter, Hiring Manager, Engineer, etc.)
* `email:string`
* `linkedin_url:string`
* `notes:text`
* `company_id:references`

**Associations:**

* belongs\_to \:company
* has\_many \:messages

---

## **JobOpening**

A role/offer at a company.

* `title:string`
* `description:text`
* `source:string` (LinkedIn, referral, etc.)
* `tech_stack:text`
* `values:text`
* `match_score:integer` (0–100, manual or computed)
* `interest_score:integer` (0–100)
* `is_public:boolean` (if it’s advertised)
* `company_id:references`

**Associations:**

* belongs\_to \:company
* has\_one \:application\_process
* has\_many \:content\_ideas

---

## **ApplicationProcess**

Tracks one job application from start to finish.

* `status:string` (enum: draft, applied, in\_review, interviewing, offer, rejected, closed)
* `applied_on:date`
* `job_posted_on:date`
* `last_follow_up_on:date`
* `next_follow_up_on:date`
* `job_opening_id:references`

**Associations:**

* belongs\_to \:job\_opening
* has\_many \:interviews
* has\_many \:messages

---

## **Message**

Any outreach or response.

* `direction:string` (sent, received)
* `content:text`
* `sent_at:datetime`
* `contact_id:references`
* `application_process_id:references`

**Associations:**

* belongs\_to \:contact
* belongs\_to \:application\_process

---

## **Interview**

Each interview round.

* `round_number:integer`
* `interview_type:string` (tech, HR, cultural, etc.)
* `scheduled_at:datetime`
* `duration:integer` (minutes)
* `notes:text`
* `transcript:text` (optional, Phase 2)
* `performance_score:integer` (0–10)
* `enjoyment_score:integer` (0–10)
* `application_process_id:references`

**Associations:**

* belongs\_to \:application\_process

---

## **ContentIdea**

Posts or MVP apps related to your search.

* `title:string`
* `idea_type:string` (post, project)
* `platforms:string` (LinkedIn, blog, etc. — could be array/jsonb)
* `scheduled_for:date`
* `urgency_score:integer`
* `interest_score:integer`
* `tags:string` (could be array/jsonb)
* `job_opening_id:references` (optional link to a role)

**Associations:**

* belongs\_to \:job\_opening, optional\:true

---

## **Task**

Custom todos not tied to a specific process.

* `title:string`
* `due_date:date`
* `completed:boolean`
* `notes:text`
* `user_id:references`

---

# 🚀 MVP Scope

* Company, Contact, JobOpening, ApplicationProcess, Interview, Message
* Simple Calendar view (interviews + follow-ups)
* Dashboard with pipeline summary
* ContentIdea (posts/projects)
* Profile Optimization module
* Tasks / Personal todos

---