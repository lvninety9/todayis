# 2026 Modern UI Design Guide - Todayis

**Last Updated:** 2026-04-25

---

## 1. Design Trends 2026

### 1.1 Glassmorphism 2.0
- ** Frosted Glass:** `backdrop-filter: blur(10-20px)`
- **Semi-transparent background:** `rgba(255, 255, 255, 0.1-0.2)`
- **Subtle border:** `1px solid rgba(255, 255, 255, 0.12)`
- **Depth with shadows:** Soft glow shadows
- ** Saturate effect:** `saturate(150%)` to make colors pop

### 1.2 Liquid Glass (Apple-style)
- Dynamic refraction effects
- Contextual color adaptation
- Spring-based animations for fluid transitions

### 1.3 Dark Mode + Glass
- Dark backgrounds with neon/gradient accents
- Works especially well with glass effects

### 1.4 Neobrutalism + Glass
- High contrast layouts
- Soft glass meets bold elements

---

## 2. Animation Libraries (2026)

| Library | Bundle Size | Use Case |
|---------|-------------|----------|
| **Motion** (formerly Framer Motion) | 30KB (15KB lazy) | Complex animations, gestures, shared layouts |
| **Motion One** | 3.8KB | Lightweight, WAAPI-based, high performance |
| **AutoAnimate** | <3KB | Simple list transitions |
| **@formkit/auto-animate** | <3KB | Drop-in animation for any framework |

**Recommendation for Todayis:**
- Use `@formkit/auto-animate` for simple list/conditional rendering transitions (add on day one)
- Use Motion (already installed) for complex animations when needed
- Consider Motion One for scroll-triggered reveals

---

## 3. CSS Techniques

### 3.1 Glassmorphism CSS Template
```css
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px) saturate(150%);
  -webkit-backdrop-filter: blur(10px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* Dark mode */
.glass-dark {
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
```

### 3.2 Performance Tips
- **Never animate backdrop-filter directly** - animate opacity instead
- Use `transform: translateZ(0)` for GPU acceleration
- Apply `will-change: backdrop-filter` only when animating
- Keep blur between 10-20px (30px+ causes performance issues)

### 3.3 Micro-interactions
- Hover: increase opacity slightly for tactile "lift"
- Active: subtle scale down (0.98)
- Focus: ring with brand color glow

---

## 4. Color Palette (2026 Trend)

### 4.1 Modern Gradient Backgrounds
```css
/* Ocean Dream */
background: linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%);

/* Sunset Vibes */
background: linear-gradient(120deg, #f6d365 0%, #fda085 100%);

/* Northern Lights */
background: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);

/* Midnight */
background: linear-gradient(120deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
```

### 4.2 Accent Colors
- **Primary:** #6366f1 (Indigo)
- **Secondary:** #ec4899 (Pink)
- **Success:** #10b981 (Emerald)
- **Warning:** #f59e0b (Amber)
- **Error:** #ef4444 (Red)

### 4.3 Neon Accents (Dark Mode)
- Cyan: #06b6d4
- Purple: #8b5cf6
- Pink: #ec4899

---

## 5. Typography (2026)

### 5.1 Trendy Font Pairings
- **Headings:** Noto Serif KR + Display fonts
- **Body:** Pretendard, Inter, SF Pro
- **Accent:** Caveat, Dancing Script (for romantic themes)

### 5.2 Font Loading (Next.js)
```tsx
import { Noto_Serif_KR, Inter } from 'next/font/google';

const notoSerif = Noto_Serif_KR({ subsets: ['latin'], display: 'swap' });
const inter = Inter({ subsets: ['latin'], display: 'swap' });
```

---

## 6. Component Design Patterns

### 6.1 Buttons
```css
.btn-primary {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

.btn-primary:active {
  transform: scale(0.98);
}
```

### 6.2 Cards (Glass)
- Rounded corners: 16-24px
- Glass effect with subtle border
- Hover: slight lift + glow
- Shadow: soft, diffused

### 6.3 Form Inputs
- Glass background
- Clear focus states with glow
- Floating labels
- Smooth transitions

---

## 7. Page Layout Trends

### 7.1 Hero Section
- Full viewport height
- Animated gradient background
- Large typography with accent
- Glass card CTA

### 7.2 Dashboard
- Sidebar with glass effect
- Card-based content
- Smooth page transitions
- Responsive grid

### 7.3 Template Editor
- Split view: Editor | Preview
- Floating toolbar
- Drag-and-drop sections
- Real-time preview

---

## 8. Accessibility (2026)

- Minimum contrast ratio: 4.5:1
- Focus indicators on all interactive elements
- Reduced motion support: `prefers-reduced-motion`
- Screen reader friendly labels

---

## 9. Implementation Checklist

- [ ] Add `@formkit/auto-animate` for smooth transitions
- [ ] Update button styles with modern gradient + shadow
- [ ] Apply glassmorphism to cards, modals, navbars
- [ ] Add subtle hover/focus animations
- [ ] Implement gradient backgrounds
- [ ] Dark mode support with neon accents
- [ ] Test with prefers-reduced-motion
- [ ] Verify WCAG contrast ratios

---

## 10. Resources

- [Motion Library](https://motion.dev)
- [Motion One](https://motion.dev/motion-one)
- [AutoAnimate](https://github.com/formkit/auto-animate)
- [Glassmorphism CSS Generator](https://css.glass)
- [Neon Gradients](https://meshgradient.in)