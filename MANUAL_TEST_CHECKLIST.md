# Manual Test Checklist - Fluid Roles System

## Setup
1. Start backend: `cd server && npm start`
2. Start frontend: `cd client && npm run dev`
3. Ensure MongoDB is connected

---

## Test Flow: Client Posts → Freelancer Bids → Client Reviews → Client Hires

### 1. Client Mode - Post a Gig
- [ ] Login as User A (or register new account)
- [ ] Toggle to **Client Mode** (should see "👔 Client" button in navbar)
- [ ] Navbar should show: "Post Gig", "My Gigs", "Notifications"
- [ ] Click "Post Gig"
- [ ] Fill form: Title, Description, Budget
- [ ] Submit
- [ ] Should navigate to gig details page
- [ ] Should see "👔 You posted this gig" notice with "View Bids" button
- [ ] Gig status badge should show "Open"

### 2. Freelancer Mode - Browse and Bid
- [ ] Switch to **Freelancer Mode** (click mode toggle, should see "💼 Freelancer")
- [ ] Navbar should show: "Browse Gigs", "My Bids", "Notifications"
- [ ] Click "Browse Gigs"
- [ ] Should see the gig posted by User A
- [ ] Click on the gig card
- [ ] Should see gig details
- [ ] Should see bid count info (if others have bid)
- [ ] Should see "Submit a Bid" button (NOT "View Bids")
- [ ] Click "Submit a Bid"
- [ ] Fill form: Message, Price
- [ ] Submit
- [ ] Should see success toast
- [ ] Bid count should update

### 3. Client Mode - Review Bids
- [ ] Switch back to **Client Mode** (as User A)
- [ ] Click "My Gigs"
- [ ] Should see the posted gig with "View Bids" button
- [ ] Click "View Bids" (or navigate to `/gigs/{gigId}/review`)
- [ ] Should see ClientReview page with:
  - [ ] Gig details at top
  - [ ] List of all bids received
  - [ ] Each bid shows: freelancer name, email, price, message, status badge
  - [ ] "Accept & Hire" button for pending bids
  - [ ] Filter and sort options

### 4. Client Mode - Hire Freelancer
- [ ] On ClientReview page, click "Accept & Hire" on a bid
- [ ] Should see confirmation modal
- [ ] Click "Yes, Hire"
- [ ] Should see success toast
- [ ] Gig status should change to "Assigned"
- [ ] Hired bid should show "hired" status badge
- [ ] All other bids should show "rejected" status badge
- [ ] "Accept & Hire" buttons should disappear
- [ ] Should see "✓ Freelancer Hired" banner at top

### 5. Freelancer Mode - See Hired Status
- [ ] Switch to **Freelancer Mode** (as User B who bid)
- [ ] Click "My Bids"
- [ ] Should see the bid with:
  - [ ] Status badge: "Hired" (green)
  - [ ] "🎉 Congratulations! You've been hired!" message
  - [ ] "View Gig" button
- [ ] Click on gig title or "View Gig"
- [ ] Should see gig details with "Assigned" status
- [ ] Should see "✓ Freelancer Hired" banner showing User B was hired

### 6. Notifications
- [ ] As hired freelancer (User B), check notifications
- [ ] Should see notification: "You have been hired for [gig title]!"
- [ ] As gig owner (User A), check notifications
- [ ] Should see notifications for each bid received

---

## Permission Tests

### Test 1: Non-owner Cannot View Bids
- [ ] Login as User C (different from gig owner)
- [ ] Try to navigate to `/gigs/{gigId}/review` (where gigId is owned by User A)
- [ ] Should see "Access Forbidden" message
- [ ] Should redirect or show error: "Only the client who posted this gig can review bids"

### Test 2: Owner Cannot Bid on Own Gig
- [ ] Login as User A (gig owner)
- [ ] Switch to Freelancer Mode
- [ ] Navigate to own gig
- [ ] Should NOT see "Submit a Bid" button
- [ ] Should see "👔 You posted this gig" notice instead

### Test 3: Cannot Bid on Assigned Gig
- [ ] As User C, try to bid on a gig that's already assigned
- [ ] Should see error: "Gig is not open for bidding"
- [ ] Bid form should not appear

### Test 4: Cannot Hire if Gig Already Assigned
- [ ] As User A, try to hire on a gig that's already assigned
- [ ] Should see error or button should be disabled

---

## Mode Persistence Test
- [ ] Set mode to Client
- [ ] Refresh page
- [ ] Mode should persist (still Client)
- [ ] Set mode to Freelancer
- [ ] Refresh page
- [ ] Mode should persist (still Freelancer)

---

## UI Status Badges Test
- [ ] **Gig Status Badges:**
  - [ ] Open gigs show "Open" badge (orange)
  - [ ] Assigned gigs show "Assigned" badge (gray)
- [ ] **Bid Status Badges:**
  - [ ] Pending bids show "Pending" badge
  - [ ] Hired bids show "Hired" badge (green)
  - [ ] Rejected bids show "Rejected" badge (red)

---

## Edge Cases
- [ ] Create gig with very long title/description
- [ ] Submit bid with very high price
- [ ] Submit bid with very low price
- [ ] Try to hire when no bids exist
- [ ] Try to access review page when not logged in
- [ ] Try to access review page for non-existent gig

---

## Expected Results Summary
✅ **Client Mode:**
- Can post gigs
- Can view "My Gigs"
- Can review bids on own gigs
- Can hire freelancers
- Cannot bid on own gigs

✅ **Freelancer Mode:**
- Can browse open gigs
- Can submit bids
- Can view "My Bids"
- Can see hired/rejected status
- Receives notifications when hired

✅ **Permissions:**
- Only gig owner can view bids
- Only gig owner can hire
- Users cannot bid on own gigs
- Users cannot bid on assigned gigs

✅ **Status Updates:**
- Gig: open → assigned
- Bid: pending → hired/rejected
- All other bids auto-reject when one is hired

---

## Notes
- Mode toggle persists in localStorage
- Default mode is "Freelancer"
- All API calls use JWT HttpOnly cookies
- Real-time notifications via Socket.io
- Hiring uses MongoDB transactions (race-condition safe)
