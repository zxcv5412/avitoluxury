# 👨‍💻 Chinesh Soni | Full-Stack Software Engineer & UI/UX Optimizer

Welcome to my GitHub profile! I specialize in building, optimizing, and redesigning modern web applications. I focus on bridging the gap between high-performance system-level engineering and beautiful, responsive UI/UX designs.

---

## 🚀 Featured Project: Avito Luxury Redesign & Performance Optimization

> **Project Credits**: Originally designed by the core developer; fully redesigned, optimized, and prepared for live production by **Chinesh Soni**.
> **Live Site**: [www.avitoluxury.in](https://www.avitoluxury.in)

Avito Luxury is a premium full-stack e-commerce application built with Next.js, React 19, MongoDB, and Tailwind CSS. I audited the existing codebase and completed a major overhaul focusing on core user experience, page speed, database efficiency, and admin control features.

### ⚡ Performance & Database Architecture Upgrades

| Optimization Area | Before | After (Optimized by Chinesh) | Speed / Size Impact |
| :--- | :--- | :--- | :--- |
| **Initial Redirect Delay** | Client-side `useEffect` and `router.push('/store')` causing a blank loading spinner. | Zero client-side lag; implemented Next.js server-side `redirect()` under 20ms. | **2+ seconds faster** page loading! |
| **Database Payload Size** | `/api/products` API fetched full descriptions, review arrays, and videos for every item in catalog. | Projection-based MongoDB `.select()` fetching only layout-relevant properties. | **95%+ reduction** in data payload size (~20KB)! |
| **Console Warnings** | Build output cluttered with duplicate Mongoose index declaration warnings. | Consolidated schemas in `AdminOTP.ts` and `Subscriber.ts` for clean logs. | **100% warning-free** production Next.js builds! |
| **Image Compression** | Standard unoptimized HTML `<img>` tags loading heavy assets. | Upgraded to Next.js `<Image />` with `sizes` and `priority` WebP generation. | **Zero Cumulative Layout Shift (CLS)** & optimized loading. |

---

### 🎨 Custom Redesigns & UI/UX Innovations

#### 1. 📌 Homepage Banner Pinned Slide Control
*   **The Feature**: Created a customized admin marketing feature enabling the store owner to select a specific product to always display as **Slide 1 / Index 0** of the hero banner carousel.
*   **The Logic**: Programmed database POST/PUT transaction triggers so saving a pinned product automatically resets the pinned flag on all other products, preserving slide integrity. The frontend carousel controller (`SaleCarousel.tsx`) automatically detects, normalizes, and unshifts the pinned product to the front.

#### 2. 📱 Seamless Dynamic Image Aspect-Ratio Layout
*   **The Challenge**: Carousel banner images vary between horizontal combo packs (wide/short) and vertical single perfume bottles. Fixed viewport heights created massive empty gaps above/below horizontal images on mobile view.
*   **The Solution**: 
    *   Implemented a responsive viewport height scaling dynamically from `300px` (mobile) to `600px` (large desktop).
    *   Added React image `onLoad` listeners to automatically calculate natural image aspect ratios.
    *   Programmed **adaptive padding**: horizontal images automatically receive minimal padding (`p-0.5 sm:p-1 md:p-2`) to stretch wide, while vertical single bottles receive elegant breathing-room padding (`p-6 md:p-16`) to center elegantly.
    *   Unified container backgrounds to solid `#ffffff` (`bg-white`) so images blend seamlessly without border contrast.

#### 📈 Vercel Web Analytics Integration
*   Directly integrated `@vercel/analytics` inside the Next.js App Router Root Layout to enable real-time user activity tracking and conversion rate monitoring.

---

## 🛠️ Core Tech Stack & Tools Used

*   **Frameworks & Libraries**: Next.js 16 (App Router), React 19, Framer Motion, Chart.js, React Hook Form
*   **Database**: MongoDB, Mongoose ODM (Aggregation, Projection, Transaction triggers)
*   **Languages**: TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS
*   **APIs & Services**: Razorpay Integration, Twilio SMS API, Cloudinary Asset Management
*   **CI/CD & DevOps**: Vercel Cloud Serverless Deployment, Git & GitHub Version Control

---

*Feel free to browse my repositories or connect with me if you're looking to speed up your React/Next.js systems or craft dynamic, pixel-perfect user interfaces!*
