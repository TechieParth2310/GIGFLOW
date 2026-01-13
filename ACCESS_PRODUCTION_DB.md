# How to Access Production MongoDB Database

## Understanding Your Databases

You have **TWO separate databases**:

1. **Local Database** (on your machine):
   - URI: `mongodb://localhost:27017/gigflow`
   - Contains: Your local development data
   - Access: Direct connection from your local server

2. **Production Database** (MongoDB Atlas):
   - URI: Set in Render environment variable `MONGODB_URI`
   - Contains: Production/deployed app data
   - Access: Through MongoDB Atlas web interface or connection string

**⚠️ Important**: These are completely separate! Data in one doesn't affect the other.

## Method 1: Access via MongoDB Atlas Web Interface (Easiest)

### Step 1: Login to MongoDB Atlas
1. Go to https://cloud.mongodb.com/
2. Login with your MongoDB Atlas account
3. Select your organization/project

### Step 2: View Your Database
1. Click **"Database"** in the left sidebar
2. Click **"Browse Collections"** on your cluster
3. You'll see your database (e.g., `gigflow`) with collections:
   - `users` - All user accounts
   - `gigs` - All posted gigs
   - `bids` - All bids submitted
   - `notifications` - All notifications

### Step 3: View/Edit Data
- Click on any collection to see documents
- You can view, edit, or delete documents directly in the UI
- Use filters and search to find specific data

## Method 2: Get Connection String from Render

### Step 1: Get Production MongoDB URI
1. Go to Render Dashboard: https://dashboard.render.com
2. Click on your **GIGFLOW** service
3. Click **"Environment"** in left sidebar
4. Find `MONGODB_URI` variable
5. Copy the connection string (it looks like):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gigflow?retryWrites=true&w=majority
   ```

### Step 2: Use MongoDB Compass (GUI Tool)
1. Download MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Paste your connection string
3. Click "Connect"
4. Browse collections and data visually

### Step 3: Or Use MongoDB Shell (CLI)
1. Install MongoDB Shell: https://www.mongodb.com/try/download/shell
2. Connect using:
   ```bash
   mongosh "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gigflow"
   ```
3. Use commands:
   ```javascript
   // Switch to your database
   use gigflow
   
   // View all collections
   show collections
   
   // View all users
   db.users.find().pretty()
   
   // View all gigs
   db.gigs.find().pretty()
   
   // Count documents
   db.gigs.countDocuments()
   db.users.countDocuments()
   ```

## Method 3: Connect from Local Code

### Option A: Query Production DB from Local Script

1. **Create a temporary script** (`query-prod-db.js`):
   ```javascript
   import mongoose from 'mongoose';
   import dotenv from 'dotenv';
   
   dotenv.config();
   
   // Get production URI from environment
   const PROD_URI = 'mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gigflow';
   
   const connectAndQuery = async () => {
     try {
       await mongoose.connect(PROD_URI);
       console.log('Connected to production database');
       
       // Query data
       const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
       const Gig = mongoose.model('Gig', new mongoose.Schema({}, { strict: false }));
       
       const users = await User.find();
       const gigs = await Gig.find();
       
       console.log(`Users: ${users.length}`);
       console.log(`Gigs: ${gigs.length}`);
       
       // Print some data
       console.log('\nSample Users:');
       users.slice(0, 3).forEach(u => console.log(`  - ${u.username} (${u.email})`));
       
       console.log('\nSample Gigs:');
       gigs.slice(0, 3).forEach(g => console.log(`  - ${g.title} ($${g.budget})`));
       
       await mongoose.disconnect();
     } catch (error) {
       console.error('Error:', error);
     }
   };
   
   connectAndQuery();
   ```

2. **Run it**:
   ```bash
   node query-prod-db.js
   ```

### Option B: Use MongoDB Atlas Data Explorer

MongoDB Atlas provides a built-in data explorer:
1. Go to MongoDB Atlas
2. Click **"Database"** → Your cluster
3. Click **"Browse Collections"**
4. You can view, edit, delete, and insert documents directly

## Method 4: Export/Import Data

### Export from Production:
```bash
mongodump --uri="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gigflow" --out=./prod-backup
```

### Import to Local:
```bash
mongorestore --uri="mongodb://localhost:27017/gigflow" ./prod-backup/gigflow
```

### Export from Local:
```bash
mongodump --uri="mongodb://localhost:27017/gigflow" --out=./local-backup
```

### Import to Production:
```bash
mongorestore --uri="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gigflow" ./local-backup/gigflow
```

## Finding Your Production Database Connection String

### From Render Dashboard:
1. Render Dashboard → Your Service → **Environment**
2. Look for `MONGODB_URI`
3. Copy the value

### From MongoDB Atlas:
1. MongoDB Atlas → **Database** → **Connect**
2. Choose **"Connect your application"**
3. Copy the connection string
4. Replace `<password>` with your actual password

## Security Notes

⚠️ **Important Security Practices**:
- Never commit connection strings to Git
- Use environment variables for all database URIs
- Don't share production connection strings publicly
- Use strong passwords for database users
- Regularly rotate database passwords

## Quick Reference Commands

### Using MongoDB Shell:
```javascript
// Connect
mongosh "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gigflow"

// Inside shell:
use gigflow
db.users.find()
db.gigs.find()
db.gigs.countDocuments()
db.users.findOne({ username: "techstartup_co" })
```

### Using MongoDB Compass:
1. Install Compass
2. Paste connection string
3. Click Connect
4. Browse collections visually

## Troubleshooting

**Can't connect?**
- Check MongoDB Atlas IP whitelist (must include your IP or `0.0.0.0/0`)
- Verify connection string is correct
- Make sure password is URL-encoded if it has special characters
- Check MongoDB Atlas cluster is running (not paused)

**Can't see data?**
- Make sure you're looking at the correct database name
- Check that collections exist (they're created when first document is inserted)
- Verify you're connected to the right cluster

## Summary

**Easiest way**: Use MongoDB Atlas web interface → Database → Browse Collections

**For advanced users**: Use MongoDB Compass or mongosh with the connection string from Render environment variables.

**Remember**: Production and local databases are completely separate!
