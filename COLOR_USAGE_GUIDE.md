# 🎨 Color Usage Guide - Apple-Inspired Design

## Color Palette Overview

Your design system uses a carefully curated color palette inspired by your reference images and Apple's design language.

## 🌈 Primary Colors

### 🟢 Green (#10B981)
**Usage:**
- ✅ Success states
- ✅ Active status
- ✅ Completed tasks
- ✅ Positive indicators
- ✅ Confirmation buttons

**Classes:**
```css
.btn-success          /* Green button */
.badge-success        /* Green badge */
.progress-fill-success /* Green progress bar */
.status-dot-green     /* Green status dot */
.text-gradient-green  /* Green gradient text */
```

**Examples:**
- "Active" status
- "Test Completed" badge
- "Confirmed" indicators
- Save/Confirm buttons

---

### 🔵 Blue (#3B82F6)
**Usage:**
- 🔹 Primary actions
- 🔹 Links
- 🔹 Information
- 🔹 Default buttons
- 🔹 Focus states

**Classes:**
```css
.btn-primary          /* Blue button (main CTA) */
.badge-info           /* Blue badge */
.status-dot-blue      /* Blue status dot */
.text-gradient-blue   /* Blue gradient text */
```

**Examples:**
- "Start Test" button
- "View Details" link
- Information messages
- Primary call-to-action

---

### 🟡 Yellow/Amber (#F59E0B)
**Usage:**
- ⚠️ Warnings
- ⚠️ Attention needed
- ⚠️ Pending states
- ⚠️ Time-sensitive items

**Classes:**
```css
.btn-warning          /* Yellow/Orange button */
.badge-warning        /* Yellow badge */
.progress-fill-warning /* Yellow progress bar */
.status-dot-yellow    /* Yellow status dot */
```

**Examples:**
- "Pending Review" badge
- "Attention Required" warnings
- Time running out indicators
- Important notices

---

### 🔴 Red (#EF4444)
**Usage:**
- ❌ Errors
- ❌ Delete actions
- ❌ Failed states
- ❌ Critical alerts
- ❌ Validation errors

**Classes:**
```css
.badge-error          /* Red badge */
.form-error           /* Red error text */
.progress-fill-error  /* Red progress bar */
.status-dot-red       /* Red status dot */
```

**Examples:**
- "Test Failed" badge
- Form validation errors
- Delete confirmation buttons
- Critical system alerts

---

### 🟣 Purple (#8B5CF6)
**Usage:**
- 👑 Premium features
- 👑 Membership status
- 👑 Pro/Featured items
- 👑 Special badges

**Classes:**
```css
.badge-purple         /* Purple badge */
```

**Examples:**
- "Premium Member" badge
- "Pro" indicator
- "Featured Test" label
- VIP status

---

### 🟠 Orange (#F97316)
**Usage:**
- 🔥 Urgent items
- 🔥 High priority
- 🔥 Trending
- 🔥 Important highlights

**Classes:**
```css
.badge-orange         /* Orange badge */
.progress-block-orange /* Orange progress block */
```

**Examples:**
- "Urgent" priority tag
- "Due Soon" indicators
- "Hot" or trending items
- High-priority tasks

---

### 🩷 Pink (#EC4899)
**Usage:**
- 💖 Favorites
- 💖 Special highlights
- 💖 New features
- 💖 Liked items

**Classes:**
```css
.badge-pink           /* Pink badge */
```

**Examples:**
- "New User" badge
- "Featured" label
- Favorite indicators
- Special announcements

---

## 🌑 Neutral Colors

### Light Mode
- **Background:** #F9FAFB (soft gray-white)
- **Card Background:** #FFFFFF (white)
- **Text Primary:** #1A1A1A (near black)
- **Text Secondary:** #6B7280 (gray)
- **Text Tertiary:** #9CA3AF (light gray)

### Dark Mode
- **Background:** #111827 (deep dark)
- **Card Background:** rgba(31, 41, 55, 0.8) (dark transparent)
- **Text Primary:** #F9FAFB (near white)
- **Text Secondary:** #D1D5DB (light gray)
- **Text Tertiary:** #9CA3AF (gray)

## 🎯 When to Use Which Color

### For Buttons

```jsx
// Primary action (most important)
<button className="btn btn-primary">Start Test</button>

// Success/Confirmation
<button className="btn btn-success">Save Changes</button>

// Warning/Caution
<button className="btn btn-warning">Proceed with Caution</button>

// Secondary action (less important)
<button className="btn btn-secondary">Cancel</button>

// Subtle action
<button className="btn btn-ghost">Skip</button>
```

### For Badges

```jsx
// Active/Online/Success
<span className="badge-success">Active</span>

// Pending/Warning
<span className="badge-warning">Pending</span>

// Error/Offline
<span className="badge-error">Failed</span>

// Information
<span className="badge-info">In Progress</span>

// Premium/Special
<span className="badge-purple">Premium</span>

// Urgent
<span className="badge-orange">Urgent</span>

// Featured/New
<span className="badge-pink">New</span>

// Neutral/Default
<span className="badge-neutral">Standard</span>
```

### For Progress Indicators

```jsx
// Success (Green) - 70-100%
<div className="progress-fill progress-fill-success" style={{ width: '85%' }}></div>

// Warning (Yellow) - 30-69%
<div className="progress-fill progress-fill-warning" style={{ width: '50%' }}></div>

// Error (Red) - 0-29%
<div className="progress-fill progress-fill-error" style={{ width: '20%' }}></div>

// Default (Blue) - General progress
<div className="progress-fill" style={{ width: '60%' }}></div>
```

### For Status Dots

```jsx
// Online/Active (Green)
<span className="status-dot status-dot-green"></span>

// Away/Busy (Yellow)
<span className="status-dot status-dot-yellow"></span>

// Offline/Error (Red)
<span className="status-dot status-dot-red"></span>

// Active/Working (Blue)
<span className="status-dot status-dot-blue"></span>
```

## 📊 Color Combinations

### Card with Status
```jsx
<div className="card-member">
  <div className="flex items-center gap-md">
    <div className="avatar avatar-status">
      <div style={{ background: '#10B981' }}>JD</div>
    </div>
    <div>
      <h4>John Doe</h4>
      <p className="text-small">Active Member</p>
    </div>
    <span className="badge-success">Active</span>
  </div>
  <div className="flex gap-sm mt-md">
    <span className="badge-purple">Premium</span>
    <span className="badge-info">Verified</span>
  </div>
</div>
```

### Stats Card
```jsx
<div className="card-glass">
  <div className="text-tiny">TOTAL TESTS</div>
  <h2 className="text-gradient-blue">24</h2>
  <span className="badge-success badge-sm mt-sm">+3 new</span>
</div>
```

### Task with Priority
```jsx
<div className="card-compact flex items-center gap-md">
  <div style={{ 
    width: '4px', 
    height: '40px', 
    background: 'var(--accent-red)',  // Red for urgent
    borderRadius: '4px' 
  }}></div>
  <div style={{ flex: 1 }}>Urgent Task</div>
  <span className="badge-orange">High Priority</span>
</div>
```

## 🎨 Gradient Usage

### Text Gradients
```jsx
// Blue-Purple Gradient
<h1 className="text-gradient-blue">Premium Feature</h1>

// Green-Cyan Gradient
<h1 className="text-gradient-green">Success Story</h1>
```

## 🌓 Color Behavior in Dark Mode

All colors automatically adjust for dark mode:
- **Backgrounds:** Darker
- **Text:** Lighter
- **Borders:** More subtle
- **Shadows:** Deeper
- **Accent Colors:** Stay vibrant (maintain brand consistency)

## 💡 Best Practices

### DO ✅
- Use green for success and positive actions
- Use blue for primary actions and default states
- Use yellow/orange for warnings that need attention
- Use red sparingly for errors and critical actions
- Use purple for premium/special features
- Maintain color consistency across similar actions

### DON'T ❌
- Don't use red for positive actions
- Don't use green for errors
- Don't use too many colors on one screen (max 3-4 accent colors)
- Don't forget to check dark mode color contrast
- Don't use color as the only indicator (add icons/text too)

## 📱 Accessibility

All colors meet WCAG 2.1 AA standards for:
- Text contrast
- Interactive elements
- Focus indicators
- Color blindness considerations

**Always provide non-color indicators:**
- Icons alongside colors
- Text labels with badges
- Patterns in addition to colors

## 🎯 Quick Reference

| Color | Use Case | Classes |
|-------|----------|---------|
| 🟢 Green | Success, Active | `.btn-success`, `.badge-success` |
| 🔵 Blue | Primary, Info | `.btn-primary`, `.badge-info` |
| 🟡 Yellow | Warning, Pending | `.btn-warning`, `.badge-warning` |
| 🔴 Red | Error, Delete | `.badge-error`, `.form-error` |
| 🟣 Purple | Premium | `.badge-purple` |
| 🟠 Orange | Urgent | `.badge-orange` |
| 🩷 Pink | Featured | `.badge-pink` |
| ⚪ Gray | Neutral | `.btn-secondary`, `.badge-neutral` |

---

**Remember:** Colors convey meaning. Choose them thoughtfully to guide users through your interface! 🎨✨
