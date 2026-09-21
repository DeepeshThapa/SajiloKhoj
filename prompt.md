# Build a Full-Stack Technician Marketplace — "Sajilo Khoj"

You are a senior full-stack software architect and developer. Build a **production-ready, responsive, modern full-stack web application** called **"Sajilo Khoj"**.

Sajilo Khoj is a technician marketplace where customers can discover and contact local technicians such as:

* Plumbers
* Electricians
* AC technicians
* Appliance repair technicians
* Carpenters
* Painters
* Handymen
* Cleaning professionals
* Other home/service professionals

The platform should allow technicians to register and create professional profiles, while customers can search, filter, compare, and contact technicians based on **service category, location, price/cost, rating, and availability**.

The system must include a powerful **Admin Dashboard** for managing the entire platform.

---

# 1. Technology Stack

Use the following technologies:

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Modern responsive UI
* Lucide React or another clean icon library
* Reusable component architecture

### Backend

Use Next.js full-stack architecture.

* Next.js App Router
* TypeScript
* Server Actions and/or API Routes
* Secure server-side validation
* REST-style APIs where appropriate

### Database

* MySQL
* Prisma ORM

### Authentication

* Role-based authentication
* Secure password hashing using **bcrypt**
* HTTP-only secure authentication cookies/session strategy
* Protected routes
* Server-side authorization checks

### Validation

Use a strong validation library such as:

* Zod

### Recommended supporting technologies

* Prisma
* bcrypt/bcryptjs
* React Hook Form
* Zod
* Lucide Icons

Do not use fake authentication or localStorage-based authentication.

---

# 2. Application Name

## Sajilo Khoj

Meaning: "Easy Search"

Brand positioning:

> Find trusted technicians near you.

The website should feel like a professional local service marketplace rather than a generic CRUD application.

---

# 3. User Roles

There are three primary roles:

## CUSTOMER

Customers can:

* Register
* Login
* Search technicians
* Browse service categories
* Filter technicians
* View technician profiles
* View ratings and reviews
* View approximate/service location
* Compare technician information
* Contact/request service
* Save/favorite technicians
* Submit reviews after completed services
* Manage their profile
* View their service requests
* View request status

---

## TECHNICIAN

Technicians can:

* Register
* Login
* Create technician profile
* Select service categories
* Add skills
* Add service description
* Add profile photo
* Add service area/location
* Set starting price or hourly/service rate
* Set availability
* Receive customer service requests
* Accept/reject requests
* Manage service requests
* View customer information relevant to a request
* Mark jobs as completed
* View reviews
* Respond to reviews if desired
* Manage their profile
* Change availability
* View basic dashboard statistics

Technicians should NOT immediately become publicly searchable after registration unless the business rules allow it.

Instead, support:

`PENDING → APPROVED → SUSPENDED/REJECTED`

Admin approval should be configurable.

---

## ADMIN

Admin has complete system control.

Admin can:

* Login
* View dashboard
* View statistics
* Manage customers
* Manage technicians
* Approve technicians
* Reject technician applications
* Suspend technicians
* Reactivate technicians
* Delete users
* Manage service categories
* Manage locations
* Manage technician profiles
* Manage service requests
* Manage reviews
* Remove inappropriate reviews
* Manage reported users
* Manage featured technicians
* View platform activity
* View system logs
* Manage website settings

Admin should have a dedicated dashboard.

---

# 4. Authentication System

Implement secure role-based authentication.

Registration should include:

### Customer

* Full name
* Email
* Phone number
* Password
* Confirm password

### Technician

* Full name
* Email
* Phone number
* Password
* Confirm password
* Service category
* Location
* Basic professional information

Passwords must be hashed using bcrypt before being stored.

Never store plaintext passwords.

Implement:

* Login
* Logout
* Registration
* Password validation
* Role-based authorization
* Protected dashboard routes
* Session expiration
* Secure cookies
* Server-side authorization

Example roles:

```text
CUSTOMER
TECHNICIAN
ADMIN
```

Never trust a role supplied directly from the client.

Always verify authorization on the server.

---

# 5. Technician Registration

Create a beautiful multi-step technician registration form.

### Step 1 — Account

* Name
* Email
* Phone
* Password

### Step 2 — Professional Information

* Profession/category
* Skills
* Years of experience
* Description
* Certifications
* Business name (optional)

### Step 3 — Service Area

* Province
* District
* City
* Municipality
* Area/locality
* Address
* Latitude
* Longitude

Allow technicians to define the area where they provide services.

### Step 4 — Pricing

Allow:

* Starting price
* Hourly rate
* Service-specific pricing where applicable

### Step 5 — Profile

* Profile image
* Cover image
* About technician
* Working hours
* Availability

### Step 6 — Review

Show a summary before submission.

After submission:

```text
Registration submitted successfully.
Your profile is awaiting admin approval.
```

---

# 6. Customer Search System

The most important feature is technician discovery.

Create a prominent search interface:

```text
What service do you need?
[ Plumber ▼ ]

Where do you need the service?
[ Search location ]

[ Search Technicians ]
```

Results should display technician cards.

Each card should contain:

* Profile image
* Technician name
* Profession
* Verification badge
* Rating
* Number of reviews
* Starting price
* Location
* Experience
* Availability
* Short description
* View Profile button
* Request Service button
* Favorite button

---

# 7. Filtering System

Customers should be able to filter technicians by:

### Service

Examples:

* Plumber
* Electrician
* Carpenter
* Painter
* AC Repair
* Appliance Repair
* Cleaning
* Handyman

### Location

Allow filtering by:

* Province
* District
* City
* Municipality
* Local area

### Price

Example:

```text
Minimum Price
Maximum Price
```

Also provide preset options:

* Under Rs. 500
* Rs. 500–1,000
* Rs. 1,000–2,500
* Rs. 2,500+

### Rating

* 4+ stars
* 3+ stars
* Any rating

### Experience

* 1+ years
* 3+ years
* 5+ years
* 10+ years

### Availability

* Available now
* Available today
* Available this week

### Verification

* Verified technicians only

---

# 8. Sorting

Allow customers to sort results by:

* Recommended
* Rating
* Price: Low to High
* Price: High to Low
* Experience
* Newest
* Distance where location data is available

Do not hardcode fake distances.

---

# 9. Technician Profile Page

Create a detailed technician profile page.

URL example:

```text
/technicians/john-plumber
```

The profile should contain:

### Header

* Profile image
* Technician name
* Profession
* Verification badge
* Rating
* Review count
* Location
* Availability

### About

Detailed technician description.

### Services

Display individual services.

Example:

```text
Pipe Repair
Starting from Rs. 800

Bathroom Plumbing
Starting from Rs. 1,500

Water Tank Repair
Starting from Rs. 2,000
```

### Experience

Show years of experience.

### Skills

Use attractive badges/tags.

### Service Area

Display service area.

Do not expose sensitive personal information.

### Reviews

Show:

* Rating
* Review text
* Customer first name or controlled display name
* Date
* Optional verified-service badge

### Contact / Request Service

Prominent CTA:

`Request Service`

---

# 10. Service Request System

Customers should be able to request a technician.

Request form:

* Service
* Description of problem
* Preferred date
* Preferred time
* Location
* Additional notes
* Optional image upload

Example:

```text
I need help fixing a leaking kitchen pipe.
Preferred date: September 25
Preferred time: 10:00 AM
```

Request status:

```text
PENDING
ACCEPTED
REJECTED
IN_PROGRESS
COMPLETED
CANCELLED
```

Technicians can accept or reject requests.

Customers can see request status from their dashboard.

---

# 11. Reviews & Ratings

After a service is marked completed, allow the customer to submit:

* 1–5 star rating
* Written review

Business rule:

A customer should only be able to review a technician if there is a valid completed service request between them.

Prevent duplicate reviews for the same completed request.

Calculate technician rating dynamically from reviews.

Display:

```text
4.8 ★
127 reviews
```

Do not allow users to directly manipulate their rating.

---

# 12. Favorites

Customers can save technicians.

Add:

❤️ Favorite

to technician cards and profile pages.

Customer dashboard should have:

```text
Saved Technicians
```

---

# 13. Homepage

Create a visually impressive homepage.

The design should be modern, clean, trustworthy, and suitable for the Nepali market.

Hero section:

### Headline

> Find Trusted Technicians Near You

Subheadline:

> From plumbing and electrical work to repairs and home services, find skilled professionals in your area with Sajilo Khoj.

Search box:

```text
[ What service do you need? ]
[ Your location ]
[ Search ]
```

Add popular categories.

Example:

* Plumbing
* Electrical
* Cleaning
* Carpentry
* Painting
* AC Repair
* Appliance Repair
* Handyman

---

# 14. Homepage Sections

Include:

1. Hero search section
2. Popular services
3. How Sajilo Khoj works
4. Featured technicians
5. Popular locations
6. Why choose Sajilo Khoj
7. Customer reviews
8. Become a technician CTA
9. FAQ
10. Footer

---

# 15. How It Works

Create a simple 3-step section.

### For Customers

```text
1. Search
Find the service you need.

2. Compare
Compare technicians by location, rating, experience and price.

3. Request
Send a service request directly to your chosen technician.
```

### For Technicians

```text
1. Register
Create your professional profile.

2. Get Approved
Complete verification and admin approval.

3. Get Customers
Receive service requests from customers.
```

---

# 16. Admin Dashboard

Create a professional admin dashboard.

Dashboard statistics:

```text
Total Users
Total Technicians
Pending Technicians
Approved Technicians
Total Service Requests
Completed Services
Total Reviews
Active Technicians
```

Include charts where useful.

Admin navigation:

```text
Dashboard
Users
Technicians
Customers
Categories
Locations
Service Requests
Reviews
Reports
Featured Technicians
Settings
Activity Logs
```

---

# 17. Technician Approval System

Admin should see pending applications.

Example table:

| Technician | Category | Location | Experience | Status | Actions |
| ---------- | -------- | -------- | ---------- | ------ | ------- |

Actions:

```text
View
Approve
Reject
Suspend
```

When approved:

```text
Technician status = APPROVED
```

Only approved technicians should appear in public search.

---

# 18. Category Management

Admin can:

* Create category
* Edit category
* Delete category
* Enable/disable category
* Upload category icon
* Set category description

Example:

```text
Plumbing
Electrical
Carpentry
Painting
Cleaning
AC Repair
Appliance Repair
```

---

# 19. Location Management

Create a location hierarchy suitable for Nepal.

Example:

```text
Province
  └── District
       └── Municipality/City
            └── Local Area
```

Make this extensible so additional countries/locations can be added later.

---

# 20. Database Design

Use Prisma with MySQL.

Create a normalized relational database.

Suggested models:

```text
User
TechnicianProfile
CustomerProfile
Category
Service
Location
TechnicianService
ServiceRequest
Review
Favorite
Notification
Report
AdminAction
```

Suggested User structure:

```text
User
- id
- name
- email
- phone
- passwordHash
- role
- status
- createdAt
- updatedAt
```

TechnicianProfile:

```text
TechnicianProfile
- id
- userId
- categoryId
- bio
- experienceYears
- startingPrice
- hourlyRate
- profileImage
- coverImage
- province
- district
- city
- locality
- address
- latitude
- longitude
- availability
- verificationStatus
- createdAt
- updatedAt
```

ServiceRequest:

```text
ServiceRequest
- id
- customerId
- technicianId
- serviceId
- description
- preferredDate
- preferredTime
- location
- status
- createdAt
- updatedAt
```

Review:

```text
Review
- id
- customerId
- technicianId
- serviceRequestId
- rating
- comment
- createdAt
```

Favorite:

```text
Favorite
- id
- customerId
- technicianId
- createdAt
```

Use proper:

* Foreign keys
* Unique constraints
* Indexes
* Cascading rules where appropriate

---

# 21. Search Performance

Technician search will be a core feature.

Create appropriate MySQL indexes for:

* categoryId
* province
* district
* city
* locality
* startingPrice
* rating-related fields where appropriate
* verificationStatus
* availability

Avoid loading every technician into memory and filtering them in JavaScript.

Filtering and pagination should happen at the database level.

---

# 22. Pagination

Technician listings must use pagination.

Example:

```text
1 2 3 4 5 Next
```

or cursor-based pagination where appropriate.

Never load thousands of technicians into a single page.

---

# 23. Responsive Design

The application must work beautifully on:

* Desktop
* Laptop
* Tablet
* Mobile

Mobile navigation should use a clean mobile menu.

Technician search filters should become a mobile filter drawer/bottom sheet.

---

# 24. UI/UX Design Direction

Create a premium but approachable visual identity.

The design should communicate:

* Trust
* Local community
* Professional services
* Simplicity
* Reliability

Use:

* Rounded cards
* Soft shadows
* Generous spacing
* Clean typography
* Strong CTA buttons
* Professional icons
* Subtle animations
* Good visual hierarchy

Avoid:

* Excessive gradients
* Overly flashy animations
* Generic template appearance
* Excessive glassmorphism
* Cluttered dashboards

The website should look like a real startup product.

---

# 25. Suggested Color Direction

Use a modern primary brand color such as:

* Deep blue
* Teal
* Indigo

with neutral backgrounds.

Create the colors through Tailwind theme configuration rather than scattering hardcoded colors throughout components.

Maintain strong accessibility contrast.

---

# 26. Navigation

Desktop navbar:

```text
Sajilo Khoj

Home
Find Technicians
Services
How It Works
Become a Technician

Login
Register
```

When authenticated:

### Customer

```text
Dashboard
My Requests
Favorites
Profile
Logout
```

### Technician

```text
Dashboard
Requests
My Profile
Reviews
Availability
Logout
```

### Admin

```text
Admin Dashboard
```

---

# 27. Notifications

Create a notification system.

Customers receive notifications when:

* Technician accepts request
* Technician rejects request
* Request status changes
* Service is completed

Technicians receive notifications when:

* New service request arrives
* Customer cancels request
* Customer submits review

Admins receive notifications for:

* New technician registration
* Reports
* Other configurable events

---

# 28. Security Requirements

Security is extremely important.

Implement:

* bcrypt password hashing
* Secure authentication
* HTTP-only cookies
* CSRF protection where applicable
* Server-side authorization
* Input validation
* Zod validation
* SQL injection protection through Prisma
* XSS protection
* Rate limiting for sensitive endpoints
* Login attempt protection
* File upload validation
* File size restrictions
* MIME type validation

Never trust:

* Client-side role
* Client-side user ID
* Client-side pricing
* Client-side technician approval status

All important permissions must be verified server-side.

---

# 29. Admin Security

Admin routes must be protected server-side.

Example:

```text
/admin
/admin/users
/admin/technicians
/admin/categories
/admin/requests
/admin/reviews
```

A customer or technician must never be able to access admin APIs simply by changing the URL.

---

# 30. SEO

Implement strong technical SEO.

Use:

* Dynamic metadata
* SEO-friendly URLs
* Semantic HTML
* Proper H1/H2 hierarchy
* Open Graph metadata
* Twitter/X metadata
* Canonical URLs
* Sitemap
* Robots.txt
* Breadcrumbs
* Structured data where appropriate

Technician profile pages should be indexable only when appropriate and approved.

Category pages should have SEO-friendly URLs.

Examples:

```text
/technicians
/technicians/plumbers
/technicians/electricians
/technicians/plumbers/kathmandu
```

---

# 31. Performance

Optimize for Core Web Vitals.

Use:

* Next.js Image
* Server Components where appropriate
* Dynamic imports where useful
* Pagination
* Database indexes
* Efficient Prisma queries
* Lazy loading
* Proper caching
* Minimal client-side JavaScript

Avoid unnecessary `"use client"`.

---

# 32. Error Handling

Create proper:

* Loading states
* Empty states
* Error states
* Form validation messages
* API errors
* 404 page
* Unauthorized page
* Forbidden page

Example:

```text
No technicians found.

Try changing your location, service category, or price range.
```

---

# 33. Loading UX

Use skeleton loaders for:

* Technician cards
* Dashboard statistics
* Tables
* Profile pages

Avoid blank screens while data is loading.

---

# 34. Empty States

Create polished empty states.

Examples:

```text
No saved technicians yet.

Find a technician you like and save them for later.
```

```text
No service requests yet.

Search for a technician to get started.
```

---

# 35. File Structure

Use a clean scalable architecture similar to:

```text
app/
  (public)/
    page.tsx
    technicians/
    services/
    how-it-works/

  auth/
    login/
    register/

  dashboard/
    customer/
    technician/

  admin/
    dashboard/
    users/
    technicians/
    categories/
    requests/
    reviews/

  api/

components/
  ui/
  layout/
  technician/
  search/
  dashboard/
  admin/

lib/
  auth/
  db/
  validations/
  utils/

prisma/
  schema.prisma
  seed.ts

types/

public/
```

Adapt the structure where necessary according to the latest Next.js App Router conventions.

---

# 36. Environment Variables

Use environment variables.

Example:

```env
DATABASE_URL="mysql://..."
AUTH_SECRET="..."
```

Never hardcode:

* Database credentials
* Secrets
* Passwords
* API keys

Provide a `.env.example`.

---

# 37. Seed Data

Create a development seed script.

Include realistic sample data:

### Categories

```text
Plumber
Electrician
Carpenter
Painter
AC Technician
Appliance Repair
Cleaner
Handyman
```

Create sample:

* Customers
* Technicians
* Service requests
* Reviews
* Locations

Clearly mark seeded accounts as development/demo accounts.

---

# 38. Dashboard UX

Customer dashboard should show:

```text
Welcome back, [Name]

Active Requests
Completed Services
Saved Technicians

Recent Requests
Saved Technicians
Notifications
```

Technician dashboard:

```text
Welcome, [Name]

Profile Views
Pending Requests
Accepted Jobs
Completed Jobs
Average Rating

Recent Requests
Recent Reviews
Availability
```

Admin dashboard:

```text
Users
Technicians
Pending Approvals
Service Requests
Reviews
Reports
```

---

# 39. Business Rules

Implement these rules carefully.

### Rule 1

Only registered users can submit service requests.

### Rule 2

Only technicians can create technician profiles.

### Rule 3

Technicians must be approved before appearing publicly.

### Rule 4

Suspended technicians must disappear from public search.

### Rule 5

Only customers can create service requests.

### Rule 6

A technician can only manage requests assigned to that technician.

### Rule 7

A customer can only view/manage their own requests.

### Rule 8

Only completed service requests can generate reviews.

### Rule 9

One service request can have at most one review.

### Rule 10

Only admins can approve, reject, suspend, or reactivate technicians.

### Rule 11

Only admins can manage categories.

### Rule 12

Users cannot change their own role.

### Rule 13

Admin actions should be logged.

### Rule 14

Deleted/suspended users should be handled safely without breaking historical service records.

### Rule 15

Never expose sensitive user information publicly.

---

# 40. Future-Ready Architecture

Design the system so future features can be added easily:

* Online payments
* Booking deposits
* Technician subscriptions
* Commission system
* In-app chat
* SMS notifications
* Email notifications
* Push notifications
* Google Maps integration
* Location-based distance search
* Technician verification documents
* Identity verification
* Promotional listings
* Coupon system
* Multi-language support
* Nepali language
* English language
* Mobile application/API

Do not implement these unless necessary for the initial MVP, but structure the database and code so they can be added later.

---

# 41. Important Development Requirements

Do NOT create a simple static demo.

Build an actual functional full-stack application.

The following must work end-to-end:

```text
Registration
↓
Login
↓
Role detection
↓
Technician profile creation
↓
Admin approval
↓
Technician becomes searchable
↓
Customer searches
↓
Customer filters
↓
Customer opens profile
↓
Customer submits request
↓
Technician receives request
↓
Technician accepts
↓
Service completed
↓
Customer submits review
↓
Technician rating updates
```

Every major workflow should be connected to the MySQL database.

---

# 42. Code Quality

Follow professional development standards.

Use:

* TypeScript strict mode
* Reusable components
* Strong typing
* Clean separation of concerns
* Server-side validation
* Meaningful variable names
* Proper error handling
* No unnecessary duplication
* No fake API responses
* No hardcoded production data
* No plaintext passwords

Add comments only where they improve understanding.

---

# 43. Final Deliverables

Generate the complete project including:

1. Next.js application
2. Tailwind CSS configuration
3. Prisma schema
4. MySQL database structure
5. Seed script
6. Authentication
7. bcrypt password hashing
8. Role-based access control
9. Customer dashboard
10. Technician dashboard
11. Admin dashboard
12. Technician registration
13. Technician approval workflow
14. Search system
15. Filters
16. Technician profile pages
17. Service requests
18. Reviews and ratings
19. Favorites
20. Notifications
21. Responsive UI
22. SEO configuration
23. Loading/error/empty states
24. `.env.example`
25. README
26. Database migration instructions
27. Local development instructions

---

# 44. README Requirements

The README must explain:

### Installation

```bash
npm install
```

### Environment setup

Explain `.env`.

### Database

Explain how to configure MySQL.

### Prisma

Include commands for:

```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

### Development

```bash
npm run dev
```

### Production

Explain how to build and start the application.

Also document:

* User roles
* Authentication architecture
* Database structure
* Admin access
* Seed accounts
* Important business rules

---

# 45. Final Instruction

Before writing code, first design the architecture and database relationships.

Then implement the application systematically.

Prioritize:

1. Security
2. Correct business logic
3. Database integrity
4. Authentication/authorization
5. Search/filter functionality
6. Responsive UX
7. Performance
8. SEO
9. Visual polish

The final result should feel like a real production-ready service marketplace called **Sajilo Khoj**, not a tutorial project or generic admin CRUD template.

Use realistic Nepal-oriented sample data for development while keeping the application architecture flexible enough to support other locations later.


push after each feature with proper commit message