# Contact Form Troubleshooting Guide

## Quick Fixes

### 1. Check Backend Server is Running

**Start the backend server:**
```bash
cd f:\portfolio\nextjs-portfolio-backend
npm run dev
```

You should see:
```
✅ Environment variables validated successfully
✅ Server running on port 5000 in development mode
✅ MongoDB connected: ...
```

### 2. Verify Environment Variables

**Frontend (.env):**
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

**Backend (.env):**
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=onboarding@resend.dev
TO_EMAIL=your-email@example.com
```

### 3. Test Backend Directly

Open browser or use curl:
```bash
# Health check
curl http://localhost:5000/api/health

# Test contact endpoint
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"message\":\"This is a test message with enough characters\"}"
```

### 4. Common Issues

#### Issue: "Network error"
**Cause**: Backend server not running or wrong URL
**Fix**: 
- Start backend server: `npm run dev` in backend folder
- Check `NEXT_PUBLIC_BACKEND_URL` in frontend `.env`

#### Issue: "Validation error"
**Cause**: Form data doesn't meet requirements
**Requirements**:
- Name: 2-100 characters (required)
- Email: Valid email format (optional)
- Mobile: Max 20 characters (optional)
- Message: 10-2000 characters (required)

#### Issue: "Failed to send message"
**Cause**: Backend error (check backend console)
**Common causes**:
- MongoDB not connected
- Resend API key invalid
- Missing environment variables

#### Issue: "Too many requests"
**Cause**: Rate limit exceeded (5 requests per 15 minutes)
**Fix**: Wait 15 minutes or adjust rate limit in backend

### 5. Check Browser Console

Open browser DevTools (F12) and check Console tab for:
```
Submitting to: http://localhost:5000/api/contact
Response: { success: true, message: "..." }
```

### 6. Check Backend Logs

Backend console should show:
```
ℹ️  [INFO] New contact form submission { name: '...', email: '...', ipAddress: '...' }
✅ [SUCCESS] Contact message saved successfully { id: '...' }
✅ [SUCCESS] Email sent successfully { id: '...' }
```

### 7. MongoDB Connection

If you see MongoDB connection errors:
1. Check `MONGO_URI` is correct
2. Ensure IP is whitelisted in MongoDB Atlas
3. Verify network connectivity

### 8. Email Not Sending

If message saves but email doesn't send:
1. Check `RESEND_API_KEY` is valid
2. Verify `FROM_EMAIL` is verified in Resend
3. Check Resend dashboard for errors
4. Note: Message still saves even if email fails

## Testing Steps

1. **Start Backend**
   ```bash
   cd f:\portfolio\nextjs-portfolio-backend
   npm run dev
   ```

2. **Start Frontend**
   ```bash
   cd f:\portfolio\nextjs-portfolio
   npm run dev
   ```

3. **Open Frontend**
   - Navigate to http://localhost:3000
   - Scroll to contact section
   - Fill out form
   - Submit

4. **Check Logs**
   - Frontend: Browser console (F12)
   - Backend: Terminal where backend is running

## Enhanced Error Messages

The contact form now shows:
- ✅ Specific validation errors
- ✅ Network error details
- ✅ Success messages from backend
- ✅ Console logs for debugging

## Need More Help?

1. Check backend terminal for error logs
2. Check browser console for frontend errors
3. Verify all environment variables are set
4. Ensure both servers are running
5. Test backend endpoint directly with curl
