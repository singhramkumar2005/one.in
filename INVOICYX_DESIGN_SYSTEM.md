# Invoicyx Design System - Applied to BlinkExam

## 🎨 Design Philosophy

Based on the invoice dashboard image provided, this design system emphasizes:

1. **Clean & Professional** - White backgrounds with subtle borders
2. **Colorful Status Cards** - Green, Yellow, Blue, Red indicators
3. **Modern Sidebar** - Left sidebar with category-based navigation
4. **Table Layouts** - Clean table structures for data display
5. **Rounded Corners** - Moderate border radius (8-16px)
6. **Soft Shadows** - Subtle elevation using soft shadows
7. **Color-Coded Elements** - Visual status indicators

## 🎯 Color Palette

### Primary Colors
- **Orange**: `#FF6B35` - Primary actions, branding
- **Blue**: `#4682F4` - Information, links
- **Green**: `#34D399` - Success, completed
- **Yellow**: `#FBBF24` - Warning, pending
- **Red**: `#F87171` - Error, overdue

### Background Colors
- **Primary Background**: `#F7F9FC` - Main app background
- **Secondary Background**: `#FFFFFF` - Cards and panels
- **Tertiary Background**: `#FAFBFC` - Subtle accents

### Text Colors
- **Primary Text**: `#1A1A1A` - Main headings
- **Secondary Text**: `#6B7280` - Body text
- **Tertiary Text**: `#9CA3AF` - Labels and meta

## 📐 Layout Structure

### Sidebar (Left Navigation)
- Width: `256px` (64 * 4)
- Background: White with subtle border
- Logo section at top
- User profile card below logo
- Category-based navigation (e.g., "General" dropdown)
- Active state: Light orange background
- Icons: 18px size
- Bottom logout button

### Top Header Bar
- Height: `73px` approx
- Search bar (left): Rounded input with icon
- Notifications + User menu (right)
- White background with bottom border

### Content Area
- Padding: `24-32px` (6-8 Tailwind units)
- Background: Light gray (`#F7F9FC`)
- Cards have white backgrounds with borders

## 🧱 Component Patterns

### Status Cards (Dashboard Stats)
```
┌─────────────────────────┐
│  Icon  Label            │
│  [✓]   Paid             │
│        Files: 120       │
│        Value: $1200     │
│  Progress bar (green)   │
└─────────────────────────┘
```
- Rounded corners: `16px`
- Colored background (light tint)
- Icon in colored circle
- Large numbers/stats
- Optional progress bar

### Data Tables
```
┌────────────────────────────────────┐
│ Client  │ Create  │ Due  │ Status  │
├────────────────────────────────────┤
│ Avatar  │ Date    │ Date │ Badge   │
│ Name    │         │      │         │
│ Role    │         │      │         │
└────────────────────────────────────┘
```
- White background
- Subtle row hover effect
- Avatar + Name + Role pattern
- Status badges (colored)
- Clean typography

### Buttons
- Primary: Orange background, white text, rounded
- Secondary: Gray background, dark text
- Ghost: Transparent with hover effect
- Padding: `12px 24px`
- Border radius: `8-12px`

### Forms & Inputs
- Border: `#E5E7EB` (gray-200)
- Border radius: `12px`
- Padding: `12px 16px`
- Focus ring: Orange color

### Badges/Tags
- Rounded: `9999px` (full)
- Padding: `6px 12px`
- Font size: `12-14px`
- Border + Background (color-coded)

## 🔤 Typography

### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", 
             "Helvetica Neue", Arial, sans-serif;
```

### Font Sizes
- Page Title (H1): `24px` (1.5rem)
- Section Title (H2): `18px` (1.125rem)
- Card Title (H3): `16px` (1rem)
- Body: `14px` (0.875rem)
- Small/Meta: `12px` (0.75rem)

### Font Weights
- Bold: `700` (headings, important numbers)
- Semibold: `600` (labels, subheadings)
- Medium: `500` (body text, buttons)
- Regular: `400` (general text)

## 📏 Spacing Scale

- **xs**: `8px`
- **sm**: `12px`
- **md**: `16px`
- **lg**: `24px`
- **xl**: `32px`
- **2xl**: `48px`

## 🎭 Component Examples

### Navigation Item (Active)
```jsx
<Link className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-50 text-orange-600">
  <Icon size={18} />
  <span className="font-medium text-sm">Dashboard</span>
  <span className="ml-auto w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
</Link>
```

### Status Card
```jsx
<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
  <div className="flex items-center justify-between mb-3">
    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
      <CheckIcon className="text-green-500 w-6 h-6" />
    </div>
    <span className="text-2xl font-bold text-gray-900">120</span>
  </div>
  <p className="text-sm text-gray-600 mb-2">Paid</p>
  <p className="text-xs text-gray-500">Files: 120 • Value: $1200</p>
  <div className="mt-3 w-full bg-gray-100 rounded-full h-2">
    <div className="bg-green-500 h-2 rounded-full" style="width: 75%"></div>
  </div>
</div>
```

### Table Row
```jsx
<tr className="hover:bg-gray-50 transition-colors">
  <td className="px-6 py-4">
    <div className="flex items-center gap-3">
      <img src="..." className="w-10 h-10 rounded-full" />
      <div>
        <p className="font-semibold text-gray-900 text-sm">Robert Fox</p>
        <p className="text-xs text-gray-500">Marketing Manager</p>
      </div>
    </div>
  </td>
  <td className="px-6 py-4 text-sm text-gray-600">2/11/19</td>
  <td className="px-6 py-4 text-sm text-gray-600">3/4/16</td>
  <td className="px-6 py-4">
    <span className="px-3 py-1 bg-green-50 text-green-600 border border-green-200 rounded-full text-xs font-medium">
      Paid
    </span>
  </td>
</tr>
```

## 🌗 Dark Mode

Dark mode maintains the same structure with adjusted colors:
- Background: `#111827` → `#1F2937`
- Text: White with opacity variations
- Borders: Light opacity white
- Cards: `#1F2937` with subtle borders

## ✅ Implementation Checklist

- [x] Update CSS variables in `index.css`
- [x] Redesign Sidebar component
- [x] Redesign Layout component with new header
- [ ] Update all page components with new card styles
- [ ] Apply consistent table layouts
- [ ] Update status badges and indicators
- [ ] Ensure consistent spacing and typography
- [ ] Test dark mode compatibility

## 📝 Notes

This design system creates a professional, clean interface inspired by modern invoice/dashboard applications. The emphasis is on:
- Clear data visualization
- Intuitive navigation
- Status-driven design
- Professional aesthetics
