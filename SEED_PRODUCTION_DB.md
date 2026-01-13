# How to Seed Production Database on Render

## Option 1: Using Render Shell (Easiest)

1. **Go to Render Dashboard**:
   - Open your GIGFLOW service on Render
   - Click **"Shell"** in the left sidebar (under MANAGE section)

2. **Run the seed script**:
   ```bash
   cd server && npm run seed
   ```
   
   This will:
   - Connect to your production MongoDB Atlas database
   - Create sample users, gigs, and bids
   - Fill your database with demo data

3. **Refresh your website**:
   - Go to `https://gigflow-nq1v.onrender.com/gigs`
   - You should now see all the sample gigs!

## Option 2: Run Seed Script Locally Against Production DB

1. **Get your production MongoDB URI from Render**:
   - Render Dashboard → Your Service → Environment
   - Copy the `MONGODB_URI` value

2. **Create a temporary `.env` file** (locally):
   ```env
   MONGODB_URI=your-production-mongodb-uri-from-render
   ```

3. **Run the seed script**:
   ```bash
   cd server
   npm run seed
   ```

4. **Delete the temporary `.env` file** (or revert changes)

⚠️ **Warning**: Make sure you're using the production URI, not your local one!

## Option 3: Create Gigs Manually

1. **Sign up/Login** to your deployed site
2. **Switch to Client Mode** (using the toggle in navbar)
3. **Click "Post Gig"**
4. **Create gigs manually** through the UI

## What Gets Seeded?

The seed script creates:
- **3 sample users** (with passwords you can use to login)
- **10 sample gigs** (various categories)
- **Some sample bids** (from users on gigs)

### Sample Users Created:
- `techstartup_co` / `password123`
- `designstudio` / `password123`
- `ecommerce_pro` / `password123`

You can use these to login and test the app!

## Verify It Worked

After seeding:
1. Go to `https://gigflow-nq1v.onrender.com/gigs`
2. You should see 10 sample gigs
3. Try logging in with one of the sample users
4. Test posting a new gig, bidding, etc.

## Troubleshooting

**If seed script fails:**
- Make sure MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Verify `MONGODB_URI` is correct in Render environment variables
- Check Render logs for connection errors

**If gigs still don't show:**
- Clear browser cache and refresh
- Check that you're on the `/gigs` page
- Verify the API is returning data (check browser Network tab)
