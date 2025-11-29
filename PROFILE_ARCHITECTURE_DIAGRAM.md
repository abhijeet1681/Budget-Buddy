# Profile Page - Visual Architecture & Flow

## Component Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Profile Component                    │
│                   (src/Profile.js)                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  State Management:                                      │
│  ├─ profile: { name, email, phone, ... }               │
│  ├─ editData: { name, email, phone, ... }              │
│  ├─ isEditing: boolean                                 │
│  ├─ loading: boolean                                   │
│  ├─ saving: boolean                                    │
│  ├─ message: string                                    │
│  └─ error: string                                      │
│                                                         │
│  Handlers:                                              │
│  ├─ fetchProfile()  → GET /profile                     │
│  ├─ handleChange()  → Update editData                  │
│  ├─ handleSave()    → PUT /profile                     │
│  └─ handleCancel()  → Reset editData                   │
│                                                         │
│  Rendered Views:                                        │
│  ├─ Loading State                                      │
│  ├─ Error Display                                      │
│  ├─ View Mode (Profile Display)                        │
│  │  └─ Edit Profile Button                             │
│  └─ Edit Mode (Form Inputs)                            │
│     ├─ Save Button                                     │
│     └─ Cancel Button                                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### Initial Load Flow
```
┌──────────────┐
│ Component    │
│ Mounts       │
└──────────────┘
      │
      ▼
┌──────────────────────────┐
│ useEffect Triggered      │
│ fetchProfile() Called    │
└──────────────────────────┘
      │
      ▼
┌──────────────────────────────┐
│ Get JWT Token from           │
│ localStorage                 │
└──────────────────────────────┘
      │
      ▼
┌──────────────────────────────┐
│ Send GET /profile            │
│ With Authorization Header    │
└──────────────────────────────┘
      │
      ├──────────────────────────────────────┐
      │                                      │
      ▼                                      ▼
 ┌────────────┐                    ┌──────────────┐
 │ Success    │                    │ Error        │
 │ Response   │                    │ Response     │
 └────────────┘                    └──────────────┘
      │                                      │
      ▼                                      ▼
┌──────────────────────────┐    ┌──────────────────────┐
│ Parse User Data          │    │ Set Error Message    │
│ Update profile State     │    │ Show Error UI        │
│ Update editData State    │    └──────────────────────┘
│ Set loading = false      │
└──────────────────────────┘
      │
      ▼
┌──────────────────────────┐
│ Display Profile Data     │
│ Ready to Edit            │
└──────────────────────────┘
```

### Edit & Save Flow
```
┌──────────────────────┐
│ User Clicks          │
│ "Edit Profile"       │
└──────────────────────┘
      │
      ▼
┌──────────────────────────┐
│ Set isEditing = true     │
│ Show Form Inputs         │
└──────────────────────────┘
      │
      ▼
┌──────────────────────────┐
│ User Types in Fields     │
│ handleChange() Updates   │
│ editData State           │
└──────────────────────────┘
      │
      ▼
┌──────────────────────────┐
│ User Clicks "Save"       │
│ handleSave() Called      │
└──────────────────────────┘
      │
      ▼
┌──────────────────────────────┐
│ Disable Buttons              │
│ Set saving = true            │
│ Show "Saving..." Text        │
└──────────────────────────────┘
      │
      ▼
┌──────────────────────────────┐
│ Get JWT Token                │
│ Prepare Request Data         │
└──────────────────────────────┘
      │
      ▼
┌──────────────────────────────┐
│ Send PUT /profile            │
│ With Updated Data + Token    │
└──────────────────────────────┘
      │
      ├──────────────────────────────────────┐
      │                                      │
      ▼                                      ▼
 ┌────────────┐                    ┌──────────────┐
 │ Success    │                    │ Error        │
 │ Response   │                    │ Response     │
 └────────────┘                    └──────────────┘
      │                                      │
      ▼                                      ▼
┌──────────────────────────┐    ┌──────────────────────┐
│ Update profile State     │    │ Set error Message    │
│ Update editData State    │    │ Enable Buttons       │
│ Set isEditing = false    │    │ Show Error UI        │
│ Set saving = false       │    │ Keep Form Open       │
│ Show Success Message     │    └──────────────────────┘
│ Close Edit Form          │
└──────────────────────────┘
      │
      ▼
┌──────────────────────────┐
│ Auto-Clear Message       │
│ After 3 Seconds          │
└──────────────────────────┘
      │
      ▼
┌──────────────────────────┐
│ Show Updated Profile     │
│ Ready for Next Edit      │
└──────────────────────────┘
```

## API Request/Response Structure

### GET /profile Request
```
GET http://localhost:5000/profile HTTP/1.1
Host: localhost:5000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### GET /profile Response
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 1234567890",
    "designation": "Software Developer",
    "company": "TechCorp",
    "location": "Bangalore",
    "bio": "Passionate about coding",
    "createdAt": "2025-11-29T10:30:00Z",
    "updatedAt": "2025-11-29T10:30:00Z"
  }
}
```

### PUT /profile Request
```
PUT http://localhost:5000/profile HTTP/1.1
Host: localhost:5000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 1234567890",
  "designation": "Senior Developer",
  "company": "TechCorp",
  "location": "Bangalore",
  "bio": "Passionate about coding and tech leadership"
}
```

### PUT /profile Response
```json
{
  "message": "Profile updated successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 1234567890",
    "designation": "Senior Developer",
    "company": "TechCorp",
    "location": "Bangalore",
    "bio": "Passionate about coding and tech leadership",
    "updatedAt": "2025-11-29T14:45:22Z"
  }
}
```

## UI State Transitions

```
┌─────────────────────┐
│   Initial State     │
│  (loading = true)   │
│  [Loading...]       │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│  View Mode          │
│ (Profile Display)   │
│ [Edit Profile Btn]  │
└─────────────────────┘
    ▲       │
    │       └──────────────────┐
    │                          │
    │                          ▼
    │              ┌─────────────────────┐
    │              │   Edit Mode         │
    │              │  (Form Inputs)      │
    └──────────────│ [Save] [Cancel]  │
  Cancel             └─────────────────────┘
                              │
                              ▼
                     ┌─────────────────────┐
                     │  Saving Mode        │
                     │  (Disabled Buttons) │
                     │  [Saving...]        │
                     └─────────────────────┘
                       │              │
                  Success         Error
                    │              │
                    ▼              ▼
            ✅ View Mode     ❌ Edit Mode
               + Message      + Error Msg
```

## Database Schema Visualization

```
MongoDB - budgetbuddy Collection: users

Document Structure:
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  
  // Authentication
  "email": "john@example.com" (unique),
  "password": "$2a$10$...", (hashed)
  
  // Profile Information
  "name": "John Doe",
  "phone": "+91 1234567890",
  "designation": "Software Developer",
  "company": "TechCorp",
  "location": "Bangalore, India",
  "bio": "Passionate about coding",
  
  // Metadata
  "createdAt": ISODate("2025-11-20T10:30:00Z"),
  "updatedAt": ISODate("2025-11-29T14:45:22Z")
}
```

## Component Interaction Map

```
┌─────────────────────────────────────────┐
│        React Component Tree             │
├─────────────────────────────────────────┤
│                                         │
│  App.js                                 │
│    │                                    │
│    ├─ Header                            │
│    ├─ Sidebar                           │
│    ├─ Main Content (Route)              │
│    │   └─ Profile Component             │
│    │      ├─ Loading State              │
│    │      ├─ Error Messages             │
│    │      ├─ View Mode                  │
│    │      │  └─ Edit Profile Button     │
│    │      ├─ Edit Mode                  │
│    │      │  ├─ Form Fields (7)         │
│    │      │  ├─ Save Button             │
│    │      │  └─ Cancel Button           │
│    │      ├─ Success Message            │
│    │      └─ Error Message              │
│    │                                    │
│    └─ Footer                            │
│                                         │
│  API Calls:                             │
│  ├─ GET /profile (fetch data)           │
│  └─ PUT /profile (save changes)         │
│                                         │
│  Storage:                               │
│  ├─ localStorage (JWT token)            │
│  └─ MongoDB (User Profile Data)         │
│                                         │
└─────────────────────────────────────────┘
```

## Error Handling Flow

```
┌────────────────────────────┐
│ API Call Fails             │
└────────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│ Catch Error Block Triggered        │
└────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│ Extract Error Message From:        │
│ 1. Response error data             │
│ 2. Default error message           │
└────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│ Update Error State                 │
│ setError(errorMessage)             │
└────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│ Re-render Component                │
│ Show Error Message to User         │
└────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│ User Can:                          │
│ - Retry the action                 │
│ - Cancel and try later             │
│ - Check internet connection        │
└────────────────────────────────────┘
```

---

This architecture ensures:
✅ Clear separation of concerns
✅ Proper state management
✅ Comprehensive error handling
✅ Smooth user experience
✅ Automatic database persistence
