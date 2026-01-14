# Complete Hiring Workflow Demo Script (3-4 Minutes)

## Pre-Recording Setup
- Have two browser windows/tabs ready:
  1. **Client Account** (logged in as a client)
  2. **Freelancer Account** (logged in as a freelancer, or use incognito)
- Start with the **Client Account** tab active

---

## Script (Read line by line, ~3-4 minutes total)

### [0:00-0:15] Introduction
**Say:** "Hi, I'm demonstrating GigFlow's complete hiring workflow. I'll show you how to create a gig, submit a bid, and hire a freelancer using atomic transactions for race-condition safety."

**Action:** Show the homepage or navigate to the main page.

**Say:** "Let me start by creating a new gig as a client."

**Action:** Click on "Create Gig" in the navbar (as the client).

---

### [0:15-0:45] Create a Gig
**Say:** "Here's the gig creation form. I need to fill in three fields: title, description, and budget."

**Action:** Show the Create Gig form.

**Say:** "Let me create a simple gig to demonstrate the workflow."

**Action:** Fill in the form:
- **Title:** Type "Website Redesign Project" (or any title)
- **Description:** Type "I need a modern website redesign with responsive layout. Should include homepage, about page, and contact form." (or similar)
- **Budget:** Type "1500" (or any amount)

**Say:** "Once I fill in all the required fields, I'll submit the form."

**Action:** Click the "Create Gig" button.

**Say:** "The gig has been created successfully and I'm redirected to the gig details page."

**Action:** Wait for redirect to gig details page, point to the success toast.

---

### [0:45-1:15] Switch to Freelancer & Submit Bid
**Say:** "Now I'll switch to the freelancer account to submit a bid on this gig."

**Action:** Switch to the freelancer account/tab (or open incognito window).

**Say:** "I'm now logged in as a freelancer. Let me navigate to the gigs page to find the gig I just created."

**Action:** Navigate to "Gigs" page or search for the gig.

**Say:** "Here's the gig I created. I can see the title, description, and budget."

**Action:** Click on the gig to open gig details.

**Say:** "On the gig details page, I can see all the information. Now I'll submit a bid by clicking 'Submit a Proposal'."

**Action:** Click "Submit a Proposal" or "Place Bid" button.

**Say:** "I need to provide a message explaining why I'm a good fit, and my proposed price."

**Action:** Fill in the bid form:
- **Message:** Type "I have 5 years of experience in web design. I can deliver a modern, responsive website within 2 weeks. I'll use React and TailwindCSS for the frontend." (or similar)
- **Price:** Type "1200" (or any amount less than budget)

**Say:** "Now I'll submit the bid."

**Action:** Click "Submit Bid" button.

**Say:** "The bid has been submitted successfully. The freelancer can now see their bid in 'My Bids'."

**Action:** Point to the success toast notification.

---

### [1:15-1:35] Switch Back to Client & Review Bid
**Say:** "Now let me switch back to the client account to review the bid I just received."

**Action:** Switch back to the client account/tab.

**Say:** "I'll navigate to 'My Gigs' to see the gig I created."

**Action:** Click "My Gigs" in the navbar.

**Say:** "Here's my gig. I can see it has received one bid. Let me click 'Review Bids' to see the proposal."

**Action:** Click "Review Bids" button on the gig card.

**Say:** "On the review page, I can see the bid from the freelancer. It shows their message, proposed price, and submission date."

**Action:** Show the bid details on the ClientReview page.

**Say:** "I can also view the freelancer's profile if I want more information about them."

**Action:** Point to the bid card and profile button.

---

### [1:35-2:00] Hiring Process
**Say:** "If I'm satisfied with this proposal, I can hire the freelancer by clicking 'Accept & Hire This Freelancer'."

**Action:** Click the "Accept & Hire This Freelancer" button.

**Say:** "A confirmation modal appears. This is important because hiring is a critical action that cannot be undone."

**Action:** Show the confirmation modal.

**Say:** "The system warns me that this will reject all other bids if there were any. Since this is the only bid, I'll proceed."

**Action:** Click "Yes, Hire" in the confirmation modal.

---

### [2:00-2:25] Atomic Transaction & Success
**Say:** "Behind the scenes, GigFlow performs an atomic transaction. This means all operations happen together or not at all - preventing race conditions."

**Action:** Wait for the success toast notification to appear.

**Say:** "Notice the success message: 'Freelancer hired successfully! The gig has been removed from the marketplace.'"

**Action:** Point to the toast notification.

**Say:** "The system automatically deletes the gig, marks the bid as 'hired', and rejects any other bids - all in one atomic operation. This ensures data integrity."

**Action:** Show that you're being redirected to "My Gigs" page.

---

### [2:25-2:40] Show Gig Removal
**Say:** "The gig is no longer in my 'My Gigs' list because it's been automatically removed after hiring."

**Action:** Show the "My Gigs" page - the gig should be gone.

**Say:** "This prevents the gig from being hired multiple times and keeps the marketplace clean."

---

### [2:40-3:00] Real-time Notification (Freelancer Side)
**Say:** "Now let me show you the freelancer's perspective."

**Action:** Switch to the freelancer account/tab.

**Say:** "The hired freelancer receives a real-time notification instantly."

**Action:** Show the notifications page or notification badge in the navbar.

**Say:** "They see: 'You have been hired for [Gig Title]!' This happens in real-time using Socket.io, so they get notified immediately without refreshing the page."

**Action:** Point to the notification. If needed, click on notifications to show the full notification.

**Say:** "The freelancer can also check 'My Bids' to see that their bid status has changed to 'hired'."

**Action:** Navigate to "My Bids" and show the bid with "hired" status.

---

### [3:00] Closing
**Say:** "This complete workflow demonstrates how GigFlow handles the entire process from gig creation to hiring, using atomic transactions to ensure data integrity, prevent race conditions, and provide instant real-time feedback to both parties. Thank you for watching!"

---

## Key Points to Emphasize (if time allows)

1. **Atomic Transactions**: All operations (gig deletion, bid status updates) happen together
2. **Race Condition Protection**: MongoDB's guarded updates prevent double-hiring
3. **Automatic Cleanup**: Gigs are removed from the marketplace after hiring
4. **Real-time Notifications**: Instant feedback via Socket.io
5. **User Experience**: Clear confirmation modals and status updates

---

## Tips for Recording

- **Speak clearly** and at a moderate pace
- **Pause briefly** after each action to let viewers see what's happening
- **Highlight** the toast notifications and confirmation modals
- **Use your cursor** to point at important UI elements
- **Keep it under 2 minutes** - you can speed up scrolling/loading parts
- **Practice once** before recording to ensure smooth flow

---

## Alternative Shorter Version (2.5 minutes)

If you need to be faster, you can skip some details:

1. **[0:00-0:10]** Introduction
2. **[0:10-0:30]** Create gig quickly (pre-fill form if possible)
3. **[0:30-0:50]** Switch to freelancer → Submit bid quickly
4. **[0:50-1:05]** Switch to client → Review bid
5. **[1:05-1:20]** Click "Accept & Hire" → Confirm
6. **[1:20-1:35]** Show success message → Explain atomic transaction
7. **[1:35-1:45]** Show gig removed
8. **[1:45-2:00]** Switch to freelancer → Show notification

---

## Sample Data for Quick Demo

### Gig Creation Form:
- **Title:** "Website Redesign Project"
- **Description:** "I need a modern website redesign with responsive layout. Should include homepage, about page, and contact form."
- **Budget:** 1500

### Bid Submission Form:
- **Message:** "I have 5 years of experience in web design. I can deliver a modern, responsive website within 2 weeks. I'll use React and TailwindCSS for the frontend."
- **Price:** 1200

*You can copy-paste these values to speed up the demo.*

---

## Troubleshooting

- **If form validation fails**: Make sure all required fields are filled (title, description, budget for gig; message and price for bid)
- **If you can't see the gig**: Make sure you're logged in as the correct user and refresh the page
- **If notification doesn't show**: Check that Socket.io is connected (check browser console)
- **If gig doesn't disappear**: Refresh the page - the redirect should happen automatically
- **If you make a mistake**: Just pause, explain what happened, and continue
- **If bid button doesn't appear**: Make sure you're logged in as a different user (not the gig owner)