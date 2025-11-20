# Portfolio Backend API

A robust and secure backend API for handling contact form submissions from the portfolio website. Built with Express.js, MongoDB, and Resend for email notifications.

## Features

- ✅ **Secure**: Helmet, CORS, XSS protection, MongoDB injection prevention
- ✅ **Rate Limited**: Prevents spam and abuse
- ✅ **Validated**: Input validation and sanitization
- ✅ **Logging**: Structured logging with different levels
- ✅ **Email Notifications**: Beautiful HTML emails via Resend
- ✅ **Database**: MongoDB with Mongoose ODM
- ✅ **Error Handling**: Centralized error handling
- ✅ **Health Checks**: API health monitoring endpoints
- ✅ **Keep-Alive**: Cron job to prevent free tier sleep

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Email**: Resend
- **Security**: Helmet, express-rate-limit, express-validator, xss-clean, express-mongo-sanitize
- **Logging**: Morgan, custom logger
- **Scheduling**: node-cron

## Prerequisites

- Node.js 14+ installed
- MongoDB database (local or cloud)
- Resend API key
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   cd nextjs-portfolio-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory (see `.env.example` for reference):
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database
   MONGO_URI=your_mongodb_connection_string

   # Email Configuration (Resend)
   RESEND_API_KEY=your_resend_api_key
   FROM_EMAIL=onboarding@resend.dev
   TO_EMAIL=your_email@example.com

   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:3000

   # Keep-Alive Cron (for production)
   API_URL=https://your-backend-url.com
   CRON_SCHEDULE=*/14 * * * *
   ```

4. **Start the server**
   
   Development mode (with auto-reload):
   ```bash
   npm run dev
   ```

   Production mode:
   ```bash
   npm start
   ```

## API Endpoints

### Base URL
```
http://localhost:5000
```

### Endpoints

#### 1. Root
```http
GET /
```
Returns API information and available endpoints.

**Response:**
```json
{
  "success": true,
  "message": "Portfolio Backend API is running ✅",
  "version": "2.0.0",
  "endpoints": {
    "contact": "/api/contact",
    "health": "/api/health"
  }
}
```

---

#### 2. Health Check
```http
GET /api/health
```
Check server and database health status.

**Response:**
```json
{
  "success": true,
  "message": "Server is healthy",
  "uptime": 123.456,
  "timestamp": "2025-01-20T10:30:00.000Z",
  "database": "connected"
}
```

---

#### 3. Submit Contact Form
```http
POST /api/contact
```

**Rate Limit:** 5 requests per 15 minutes per IP

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "+1234567890",
  "message": "Hello, I'd like to discuss a project..."
}
```

**Validation Rules:**
- `name`: Required, 2-100 characters
- `email`: Optional, valid email format, max 100 characters
- `mobile`: Optional, max 20 characters
- `message`: Required, 10-2000 characters

**Success Response (201):**
```json
{
  "success": true,
  "message": "Message received successfully! We'll get back to you soon.",
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Doe",
    "createdAt": "2025-01-20T10:30:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address",
      "value": "invalid-email"
    }
  ]
}
```

**Rate Limit Response (429):**
```json
{
  "success": false,
  "message": "Too many requests. Please try again later.",
  "retryAfter": 900
}
```

---

#### 4. Get All Messages (Admin)
```http
GET /api/contact?page=1&limit=10
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "John Doe",
      "email": "john@example.com",
      "mobile": "+1234567890",
      "message": "Hello...",
      "createdAt": "2025-01-20T10:30:00.000Z",
      "updatedAt": "2025-01-20T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

---

#### 5. Contact API Health
```http
GET /api/contact/health
```

**Response:**
```json
{
  "success": true,
  "message": "Contact API is healthy",
  "timestamp": "2025-01-20T10:30:00.000Z"
}
```

## Project Structure

```
nextjs-portfolio-backend/
├── controllers/
│   └── contact.controller.js    # Contact form logic
├── db/
│   └── db.js                     # Database connection
├── jobs/
│   └── cron.jobs.js              # Keep-alive cron job
├── middleware/
│   ├── errorHandler.middleware.js  # Error handling
│   ├── rateLimiter.middleware.js   # Rate limiting
│   └── validate.middleware.js      # Validation
├── models/
│   └── message.model.js          # Message schema
├── routes/
│   └── contact.route.js          # Contact routes
├── utils/
│   ├── logger.utils.js           # Custom logger
│   ├── mailer.utils.js           # Email utility
│   └── validateEnv.utils.js      # Env validation
├── .env                          # Environment variables
├── .env.example                  # Example env file
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies
├── README.md                     # This file
└── server.js                     # Main server file
```

## Security Features

### 1. Helmet
Sets various HTTP headers to protect against common vulnerabilities.

### 2. CORS
Configured to allow requests only from specified frontend URL.

### 3. Rate Limiting
- General API: 100 requests per 15 minutes
- Contact form: 5 requests per 15 minutes

### 4. Input Validation
- Express-validator for request validation
- XSS-clean for sanitizing user input
- Express-mongo-sanitize for preventing MongoDB injection

### 5. Request Size Limiting
Body size limited to 10kb to prevent large payload attacks.

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 5000 |
| `NODE_ENV` | Environment (development/production) | No | development |
| `MONGO_URI` | MongoDB connection string | Yes | - |
| `RESEND_API_KEY` | Resend API key for emails | Yes | - |
| `FROM_EMAIL` | Sender email address | Yes | - |
| `TO_EMAIL` | Recipient email address | Yes | - |
| `FRONTEND_URL` | Frontend URL for CORS | No | * |
| `API_URL` | Backend URL for keep-alive | No | - |
| `CRON_SCHEDULE` | Cron schedule expression | No | */14 * * * * |

## Development

### Running in Development Mode
```bash
npm run dev
```
Uses nodemon for auto-reload on file changes.

### Testing Endpoints

Using curl:
```bash
# Health check
curl http://localhost:5000/api/health

# Submit contact form
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message"
  }'
```

## Deployment

### Recommended Platforms
- **Render** (Free tier available)
- **Railway**
- **Heroku**
- **DigitalOcean App Platform**

### Deployment Steps

1. Set all environment variables in your hosting platform
2. Ensure `NODE_ENV=production`
3. Set `API_URL` to your deployed backend URL
4. Deploy the application
5. The keep-alive cron job will start automatically in production

### MongoDB Setup
- **MongoDB Atlas** (Free tier available)
- Get connection string and set as `MONGO_URI`

### Resend Setup
1. Sign up at [resend.com](https://resend.com)
2. Verify your domain or use the default domain
3. Get API key and set as `RESEND_API_KEY`
4. Set `FROM_EMAIL` to your verified sender email

## Troubleshooting

### Database Connection Issues
- Verify `MONGO_URI` is correct
- Check if IP is whitelisted in MongoDB Atlas
- Ensure network connectivity

### Email Not Sending
- Verify `RESEND_API_KEY` is valid
- Check if sender email is verified
- Review Resend dashboard for errors

### Rate Limiting Too Strict
- Adjust limits in `middleware/rateLimiter.middleware.js`
- Consider different limits for different environments

## License

MIT

## Author

Ved Chaudhari

## Support

For issues or questions, please contact: vedc2853@gmail.com
