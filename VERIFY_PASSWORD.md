# Verify User Password

Since passwords are **hashed** (one-way encryption), you cannot "un-hash" them. However, you can **verify** if a password matches the stored hash.

## 🎯 Two Methods to Verify Passwords

### Method 1: Using the Script (Local Development)

Run this from the project root:

```bash
cd server
npm run verify-password <email> <password>
```

**Example:**
```bash
npm run verify-password user@example.com mypassword123
```

**Output:**
- ✅ If password is correct: Shows user details and confirms password match
- ❌ If password is incorrect: Shows error message

---

### Method 2: Using the API Endpoint (Local or Production)

**POST** request to `/api/users/verify-password`

**Request:**
```bash
curl -X POST "https://your-site.onrender.com/api/users/verify-password?key=seed-me-production-2026" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "mypassword123"
  }'
```

**Or using a REST client (Postman/Insomnia):**
- **URL:** `POST /api/users/verify-password?key=seed-me-production-2026`
- **Body (JSON):**
  ```json
  {
    "email": "user@example.com",
    "password": "mypassword123"
  }
  ```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "email": "user@example.com",
    "username": "johndoe",
    "userId": "507f1f77bcf86cd799439011",
    "passwordMatch": true,
    "message": "Password is CORRECT ✅"
  }
}
```

**Response (Incorrect Password):**
```json
{
  "success": true,
  "data": {
    "email": "user@example.com",
    "username": "johndoe",
    "userId": "507f1f77bcf86cd799439011",
    "passwordMatch": false,
    "message": "Password is INCORRECT ❌"
  }
}
```

---

## 🔐 Security Note

The API endpoint is protected by a secret key (`seed-me-production-2026`). This prevents unauthorized password verification attempts.

**⚠️ Warning:** Only use this for legitimate testing/development purposes. Never expose the secret key in client-side code or public repositories.

---

## 💡 Alternative: Test via Login Endpoint

The simplest way to test a password is to use the login endpoint:

```bash
curl -X POST "https://your-site.onrender.com/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "mypassword123"
  }'
```

If it returns a success response, the password is correct. If it returns `401 Unauthorized`, the password is incorrect.