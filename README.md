# Secure Store - Digital Vault Marketplace

A secure digital file marketplace built with Next.js, AWS S3, and Stripe. Browse, preview, and purchase digital files with a seamless checkout experience.

## 🎯 Features

- **Digital File Browser**: Browse and preview digital files stored in AWS S3
- **Secure Payments**: Integrate with Stripe for safe, PCI-compliant payment processing
- **Instant Access**: Generate time-limited signed URLs for secure file access
- **Webhook Integration**: Real-time payment confirmation handling via Stripe webhooks
- **Responsive Design**: Beautiful, mobile-first UI built with Tailwind CSS and Shadcn components
- **Type-Safe**: Full TypeScript support throughout the application

## 🏗️ Project Structure

```
secure-store/
├── app/
│   ├── api/
│   │   ├── checkout/       # Stripe checkout session creation
│   │   └── webhook/        # Stripe webhook event handling
│   ├── success/            # Payment success page
│   ├── page.tsx            # Main digital vault page
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles
├── components/
│   ├── ProductCard.tsx     # Digital file card component
│   └── ui/                 # Shadcn UI components
├── hooks/
│   └── useCheckout.ts      # Checkout logic hook
├── lib/
│   ├── s3.ts              # AWS S3 client configuration
│   └── utils.ts           # Utility functions
└── public/                 # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- AWS S3 bucket with files to sell
- Stripe account for payment processing

### Environment Setup

Create a `.env.local` file with the following variables:

```env
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your_bucket_name

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📋 How It Works

### 1. **File Discovery**
- The home page lists all files from your AWS S3 bucket
- Each file shows a preview image and file size
- Files are displayed in a responsive grid layout

### 2. **Checkout Flow**
- Users click "Buy Access - $10.00" on a file card
- The `useCheckout` hook sends a request to `/api/checkout`
- The backend creates a Stripe checkout session
- Users are redirected to Stripe's secure payment page

### 3. **Payment Processing**
- Stripe handles the payment securely
- After successful payment, users are redirected to `/success`
- Stripe sends a webhook notification to `/api/webhook`
- The webhook logs payment confirmation and file metadata

### 4. **File Access**
- Signed URLs are generated with 1-hour expiration
- Users can view/download files with time-limited access
- URLs expire automatically for security

## 🔐 Security Features

- **Signed URLs**: AWS S3 signed URLs prevent unauthorized access to files
- **Webhook Verification**: Stripe webhook signatures verified to prevent spoofing
- **Environment Variables**: Sensitive credentials stored securely
- **Payment Verification**: Stripe handles PCI compliance and secure payments
- **Type Safety**: TypeScript catches errors at compile time

## 🛠️ Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `next` | React framework for production |
| `stripe` | Payment processing integration |
| `aws-sdk` | AWS S3 client |
| `react` | UI library |
| `tailwindcss` | Utility-first CSS framework |
| `shadcn` | High-quality UI components |
| `lucide-react` | Icon library |

## 🔧 Configuration

### Stripe Setup
1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe dashboard
3. Set up a webhook endpoint pointing to `{NEXT_PUBLIC_BASE_URL}/api/webhook`
4. Copy the webhook secret and add to `.env.local`

### AWS S3 Setup
1. Create an S3 bucket in your AWS account
2. Upload digital files to the bucket
3. Set appropriate bucket permissions
4. Add AWS credentials to `.env.local`

## 📖 API Endpoints

### POST `/api/checkout`
Creates a Stripe checkout session for file purchase.

**Request:**
```json
{
  "fileName": "document.pdf"
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/pay/..."
}
```

### POST `/api/webhook`
Receives and processes Stripe webhook events (payment confirmation).

**Webhook Events Handled:**
- `checkout.session.completed` - Payment successful

## 🎨 UI Components

Built with Shadcn and Radix UI:
- **Button** - Interactive buttons with loading states
- **Card** - Container for file information
- **Icons** - Lucide React icons for visual indicators

## 📝 License

Private project. All rights reserved.

## 🤝 Support

For issues or questions, please check the project documentation or contact the development team.
