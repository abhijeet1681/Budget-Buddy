# Profile Page - Quick Reference Guide

## How to Use the Profile Page

### Step 1: Login
- Go to `/login`
- Enter email and password
- JWT token is stored in localStorage

### Step 2: View Profile
- Navigate to `/profile` from sidebar
- Profile data automatically loads from database
- All user information displays (or shows "Not set" if empty)

### Step 3: Edit Profile
- Click "✏️ Edit Profile" button
- Form fields become editable
- All 7 fields available:
  - Name
  - Email
  - Phone
  - Designation
  - Company
  - Location
  - Bio

### Step 4: Save Changes
- Click "Save" button
- Button shows "Saving..." while submitting
- Success message appears for 3 seconds
- Profile page refreshes with new data

### Step 5: Cancel Edit
- Click "Cancel" button
- Returns to view mode without saving
- Form reverts to original data

## Profile Fields Explained

| Field | Type | Example |
|-------|------|---------|
| Name | Text | John Doe |
| Email | Email | john@example.com |
| Phone | Text | +91 1234567890 |
| Designation | Text | Software Developer |
| Company | Text | TechCorp Inc. |
| Location | Text | Bangalore, India |
| Bio | Text | Passionate about coding |

## What Happens Behind the Scenes

### On Page Load
1. Component checks for JWT token in localStorage
2. Sends GET request to `/profile` endpoint
3. Backend queries MongoDB for user data
4. Frontend displays fetched data
5. Sets up editData with current values

### When Saving
1. User clicks Save button
2. Component sends PUT request to `/profile` endpoint
3. Request includes all form data + JWT token
4. Backend validates and updates MongoDB
5. Success message shows for 3 seconds
6. User can now see updated profile

## Data Flow Diagram

```
Frontend (React)
    ↓
Profile.js Component
    ├─ useEffect (on mount)
    │   └─ fetchProfile()
    │       ├─ GET /profile (+ token)
    │       └─ setProfile(data)
    │
    └─ handleSave() (on Save click)
        ├─ PUT /profile (data + token)
        ├─ Update state
        └─ Show success message
    ↓
Backend (Express.js)
    ├─ GET /profile → User.findById() → MongoDB
    └─ PUT /profile → User.findById().save() → MongoDB
    ↓
Database (MongoDB)
    └─ User Collection
```

## Common Issues & Solutions

### Issue: "Please login first" message
**Solution**: 
- Go to `/login`
- Enter valid credentials
- You'll be redirected to `/dashboard`
- Then navigate to profile

### Issue: Fields show as blank
**Solution**:
- The fields might genuinely be empty in database
- Edit and fill them in
- Click Save to update

### Issue: Changes not saving
**Solution**:
- Check browser console for errors
- Verify backend is running (`node server.js`)
- Check MongoDB connection
- Look for error message on page

### Issue: "Error fetching profile"
**Solution**:
- Verify backend is running on port 5000
- Check MongoDB is connected
- Try logging out and back in
- Refresh the page

## Technical Details

### API Calls Made
```javascript
// Fetch profile
GET http://localhost:5000/profile
Headers: { Authorization: "Bearer <token>" }

// Update profile
PUT http://localhost:5000/profile
Headers: { Authorization: "Bearer <token>" }
Body: { name, email, phone, designation, company, location, bio }
```

### State Management
```javascript
profile      // Current displayed data
editData     // Form being edited
isEditing    // View/Edit mode toggle
loading      // Fetching indicator
saving       // Submission indicator
message      // Success notification
error        // Error notification
```

### Component Lifecycle
1. Mount → Fetch profile
2. Display profile data
3. Click Edit → Show form
4. Make changes → Save
5. Update database → Show success
6. Reset to view mode

## Security Notes

✅ JWT token required for all API calls
✅ Only logged-in users can edit their profile
✅ Password never exposed on frontend
✅ All requests validated on backend
✅ Database ensures data integrity

## Responsive Design

Works perfectly on:
- 📱 Mobile (480px and below)
- 📱 Tablet (768px)
- 💻 Desktop (1024px+)

All controls are touch-friendly and properly sized for mobile devices.
