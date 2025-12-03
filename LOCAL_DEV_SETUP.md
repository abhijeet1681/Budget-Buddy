# 🚀 Local Development Setup

## Port Configuration

- **Frontend (React)**: `http://localhost:3000`
- **Backend (Node.js/Express)**: `http://localhost:5000`

## Running the Application

### Option 1: Both Frontend & Backend Together (Recommended)

```bash
npm run dev
```

This command runs:
- React frontend on `http://localhost:3000`
- Node backend on `http://localhost:5000`
- Both run concurrently in the same terminal

### Option 2: Run Separately

**Terminal 1 - Start Backend:**
```bash
npm run server
```
Backend will run on `http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
npm start
```
Frontend will run on `http://localhost:3000`

## Configuration Files

### `.env` (Backend Configuration)
```
MONGO_URI=mongodb+srv://abhijeet1681:Abhi12345@cluster0.gsvx2.mongodb.net/
JWT_SECRET=8ec1cdb2767138dd33df0c14b089f18d
PORT=5000
```

### `.env.development` (Frontend Local Development)
```
REACT_APP_API_URL=http://localhost:5000
PORT=3000
```

### `.env.production` (Frontend Production)
```
REACT_APP_API_URL=
```
(Empty = uses relative URLs for Vercel deployment)

## How It Works

1. **Frontend** (React) runs on port 3000
2. **Backend** (Express) runs on port 5000
3. **Frontend** uses `REACT_APP_API_URL=http://localhost:5000` to call API endpoints
4. **Backend** has CORS enabled to accept requests from `http://localhost:3000`

## API Endpoints

All API calls go to: `http://localhost:5000`

Examples:
- Login: `POST http://localhost:5000/login`
- Signup: `POST http://localhost:5000/signup`
- Expenses: `GET http://localhost:5000/expenses`
- Profile: `GET http://localhost:5000/profile`
- Health Check: `GET http://localhost:5000/health`

## Testing

1. Open browser: `http://localhost:3000`
2. Frontend loads from port 3000
3. Try login/signup
4. Open DevTools → Network tab
5. Verify API calls go to `http://localhost:5000`

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 already in use | Close other apps on 3000 or run `lsof -i :3000` (Mac/Linux) or `netstat -ano \| findstr :3000` (Windows) |
| Port 5000 already in use | Kill process: `kill -9 $(lsof -t -i:5000)` or use Task Manager (Windows) |
| API calls failing | Check if backend is running on 5000, verify `.env.development` has correct API URL |
| Blank page on 3000 | Check browser console for errors, ensure `npm start` ran successfully |

## First Time Setup

```bash
# 1. Install dependencies
npm install

# 2. Start development environment
npm run dev

# 3. Open browser
# Frontend: http://localhost:3000
# Backend Health: http://localhost:5000/health
```

Done! 🎉
