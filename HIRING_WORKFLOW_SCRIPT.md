# Hiring Workflow Demo Script (2 Minutes)

## Pre-Recording Setup
- Have two browser windows/tabs ready:
  1. **Client Account** (logged in as a client)
  2. **Freelancer Account** (logged in as a freelancer, or use incognito)
- Ensure you have at least one gig with multiple bids ready
- Or be ready to create a gig and submit bids during the demo

---

## Script (Read line by line, ~2 minutes total)

### [0:00-0:15] Introduction & Setup
**Say:** "Hi, I'm demonstrating GigFlow's hiring workflow. This system uses atomic transactions to ensure race-condition safety when hiring freelancers."

**Action:** Navigate to the homepage or gigs page.

**Say:** "Let me show you how a client reviews bids and hires a freelancer."

**Action:** Click on "My Gigs" in the navbar (as the client).

---

### [0:15-0:30] Show Existing Gig with Bids
**Say:** "Here's a gig I posted earlier. You can see it has received multiple bids from freelancers."

**Action:** Click on a gig that has bids, or click "Review Bids" button.

**Say:** "When I click 'Review Bids', I'm taken to a dedicated page where I can see all proposals."

**Action:** The ClientReview page loads, showing all bids.

---

### [0:30-0:50] Review Bids
**Say:** "I can see all the bids here. Each bid shows the freelancer's message, proposed price, and submission date."

**Action:** Scroll through the bids, pointing out different proposals.

**Say:** "I can sort by price or filter by status. Let me select a freelancer I want to hire."

**Action:** Hover over or point to the "Accept & Hire This Freelancer" button on one of the bids.

---

### [0:50-1:10] Hiring Process
**Say:** "When I click 'Accept & Hire', a confirmation modal appears. This is important because hiring is a critical action that cannot be undone."

**Action:** Click the "Accept & Hire This Freelancer" button.

**Say:** "The system warns me that this will reject all other bids. This is by design - only one freelancer can be hired per gig."

**Action:** Show the confirmation modal.

**Say:** "I'll confirm the hiring."

**Action:** Click "Yes, Hire" in the confirmation modal.

---

### [1:10-1:35] Atomic Transaction & Real-time Notification
**Say:** "Behind the scenes, GigFlow performs an atomic transaction. This means all operations happen together or not at all - preventing race conditions."

**Action:** Wait for the success toast notification to appear.

**Say:** "Notice the success message: 'Freelancer hired successfully! The gig has been removed from the marketplace.'"

**Action:** Point to the toast notification.

**Say:** "The system automatically deletes the gig, marks the selected bid as 'hired', and rejects all other bids - all in one atomic operation."

**Action:** Show that you're being redirected to "My Gigs" page.

---

### [1:35-1:50] Show Gig Removal
**Say:** "The gig is no longer in my 'My Gigs' list because it's been automatically removed after hiring."

**Action:** Show the "My Gigs" page - the gig should be gone or show as completed.

**Say:** "This prevents the gig from being hired multiple times and keeps the marketplace clean."

---

### [1:50-2:00] Real-time Notification (Freelancer Side)
**Say:** "Now let me show you the freelancer's perspective."

**Action:** Switch to the freelancer account/tab.

**Say:** "The hired freelancer receives a real-time notification instantly."

**Action:** Show the notifications page or notification badge.

**Say:** "They see: 'You have been hired for [Gig Title]!' This happens in real-time using Socket.io."

**Action:** Point to the notification.

---

### [2:00] Closing
**Say:** "This hiring workflow ensures data integrity through atomic transactions, prevents race conditions, and provides instant feedback to both parties. Thank you for watching!"

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

## Alternative Shorter Version (90 seconds)

If you need to be faster:

1. **[0:00-0:10]** "I'm demonstrating GigFlow's atomic hiring workflow."
2. **[0:10-0:25]** Navigate to "My Gigs" → Click gig → "Review Bids"
3. **[0:25-0:40]** Show bids → Click "Accept & Hire" → Confirm
4. **[0:40-0:60]** Show success message → Explain atomic transaction
5. **[0:60-0:75]** Show gig removed from "My Gigs"
6. **[0:75-0:90]** Switch to freelancer → Show real-time notification

---

## Troubleshooting

- **If no bids exist**: Create a gig first, then switch to freelancer account and submit bids
- **If notification doesn't show**: Check that Socket.io is connected (check browser console)
- **If gig doesn't disappear**: Refresh the page - the redirect should happen automatically
- **If you make a mistake**: Just pause, explain what happened, and continue
