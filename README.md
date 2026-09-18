# School Management System

A comprehensive, responsive School Management & Academic Administration Portal built with **React 19**, **Vite**, **Tailwind CSS v4**, **TypeScript**, and **Lucide Icons**.

---

## 🚀 Quick Deployment on Vercel

This repository is pre-configured with **`vercel.json`**, **`.npmrc`**, and a clean **`package-lock.json`** for zero-configuration deployments on Vercel.

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub / GitLab / Bitbucket**.
2. Go to [vercel.com](https://vercel.com) and click **"Add New..." → "Project"**.
3. Select your repository from the list and click **Import**.
4. Configure the **Build & Development Settings**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install --legacy-peer-deps` *(pre-configured in `vercel.json`)*
5. Ensure the **Node.js Version** in Vercel is set to **`20.x`** or **`22.x`** *(Project Settings → General → Node.js Version)*.
6. Click **Deploy**.

---

## 🛠 Troubleshooting: Fixing `Command "npm install" exited with 1`

If you encounter this error on Vercel, it is caused by strict peer-dependency checks or Node version mismatch in Vercel's build container. Follow these quick steps:

### Solution 1: Override Install Command in Vercel UI
1. In the Vercel dashboard, open your project and go to **Settings** → **General**.
2. Scroll down to **Build & Development Settings**.
3. Toggle the **Override** switch next to **Install Command**.
4. Set the value to:
   ```bash
   npm install --legacy-peer-deps
   ```
5. Click **Save** and trigger a **Redeploy** from the Deployments tab.

### Solution 2: Verify Node.js Version
1. In your Vercel Project **Settings** → **General**.
2. Scroll down to **Node.js Version**.
3. Select **`20.x`** (or `22.x`).
4. Click **Save** and redeploy.

### Solution 3: Verify Pre-Packaged Config Files
Make sure these two files are committed in the root of your repository:
- **`vercel.json`**:
  ```json
  {
    "framework": "vite",
    "installCommand": "npm install --legacy-peer-deps",
    "buildCommand": "npm run build",
    "outputDirectory": "dist",
    "rewrites": [
      { "source": "/(.*)", "destination": "/index.html" }
    ]
  }
  ```
- **`.npmrc`**:
  ```ini
  legacy-peer-deps=true
  engine-strict=false
  ```

---

## 💻 Local Development

### Prerequisites
- **Node.js**: `v18.0.0` or higher (Recommended: `v20.x` or `v22.x`)
- **npm**: `v9.0.0` or higher

### Installation & Run

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd school-management-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   *(or `npm install --legacy-peer-deps` if needed)*

3. Start development server:
   ```bash
   npm run dev
   ```
   The application will run at: `http://localhost:3000`

4. Build for production:
   ```bash
   npm run build
   ```
   The compiled static assets will be located in the `dist/` directory.

5. Preview production build:
   ```bash
   npm run preview
   ```

6. Typecheck & lint:
   ```bash
   npm run lint
   ```

---

## 📋 Features & Functional Modules

- **Role-Based Views**: Instant switcher for **Admin**, **Teacher**, and **Parent** personas with custom dashboards and role-specific permissions.
- **Dual Display Modes**: Toggle between high-density **Desktop Workspace** (sidebar + analytics) and a **Mobile App Mode** (smartphone viewport with bottom navigation).
- **Student Registration**: Profile management, student ID generation, class & section filters, and biographical data tracking.
- **Attendance Tracking**:
  - Roll-call interface with "Mark All Present" batch actions for teachers/admins.
  - Parent attendance tracker with percentages and monthly status breakdowns.
- **Teacher Attendance & Leave Management**: Daily duty clock-in/out and faculty leave request workflow (submission, approval, rejection).
- **Homework Portal**: Assignment creation, deadline alerts, student homework submission, and teacher grading with feedback remarks.
- **Exam Scorecards & Official Transcripts**: Automated grading, percentage calculation, 4.0 GPA computation, and printable transcripts.
- **Tuition Fee & Billing**: Fee voucher generation, payment status tracking (Paid/Pending/Overdue), simulated online payment gateway, and printable tax receipts.
- **Messaging & Announcements**: Direct two-way educator-parent messaging and categorized school-wide bulletins (Academic, Sports, Holidays, Urgent).
