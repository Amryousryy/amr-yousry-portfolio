# Amr Yousry Portfolio

A premium creative portfolio built with Next.js 16, featuring high-converting UGC ads, video editing showcases, and brand storytelling.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** MongoDB Atlas
- **Authentication:** NextAuth.js (Credentials)
- **Image/Video Storage:** Cloudinary
- **Styling:** Tailwind CSS v4 + Framer Motion
- **Deployment:** Vercel

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Description | Example | Required |
|----------|------------|---------|----------|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://...` | ✅ |
| `NEXTAUTH_URL` | Production URL | `https://amr-yousry-portfolio.vercel.app` | ✅ |
| `NEXTAUTH_SECRET` | Generated secret (run: `openssl rand -base64 32`) | `2V1GABUwmyltglLO...` | ✅ |
| `ADMIN_EMAIL` | Admin login email | `admin@example.com` | ✅ |
| `ADMIN_PASSWORD` | Admin login password | `your-password` | ✅ |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your-cloud-name` | ✅ |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Unsigned upload preset name | `portfolio_unsigned` | ✅ (required for uploads) |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789012345` | ✅ |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `xxxxxxxxxxxxxxxx` | ✅ |

## Admin Access

1. Go to `/admin/login`
2. Use credentials from `ADMIN_EMAIL` and `ADMIN_PASSWORD`

## Features

- 🎬 Video portfolio with showreel
- 📊 Admin dashboard for content management
- 📈 Lead capture and analytics
- 🖼️ Cloudinary image uploads
- ✨ Smooth animations with Framer Motion
- 🌙 Dark theme UI
- 📱 Fully responsive

## Deploy on Vercel

The easiest way to deploy is:

```bash
npx vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── admin/       # Admin dashboard pages
│   ├── api/         # API routes
│   └── projects/    # Public project pages
├── components/      # React components
│   ├── admin/       # Admin-specific components
│   ├── sections/    # Page section components
│   └── ui/          # UI components
├── lib/             # Utilities and services
│   ├── api-client.ts
│   ├── auth.ts     # NextAuth config
│   └── db.ts       # MongoDB connection
└── models/          # Mongoose models
```

## License

MIT