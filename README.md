# SV TEXTILES — Premium Textile E-Commerce Platform

> **"Quality. Comfort. Tradition."**

A complete, high-performance, responsive e-commerce web platform for **SV TEXTILES**, an Indian textile enterprise catering to retail shoppers, fashion enthusiasts, boutique curators, and wholesale commercial buyers.

---

## 🎨 Brand Design System

* **Deep Forest Green** (`#153D32`): Core brand identity, heritage authority, natural depth
* **Warm Ivory** (`#FAF7F0`): Clean luxury background, soft contrast
* **Soft Beige** (`#E8DFD0`): Natural slub textures, accent dividers
* **Muted Gold** (`#C6A15B`): Buttons, badges, and high-value highlights
* **Charcoal** (`#242824`): Crisp, legible editorial typography
* **Pure White** (`#FFFFFF`): Product card surfaces and high-contrast containers
* **Typography**: *Cormorant Garamond* (editorial headings) & *Plus Jakarta Sans* (interface clarity)

---

## 🏗️ Architectural Overview & File Structure

```text
sv-textiles/
├── index.html               # Luxury editorial homepage & highlights
├── shop.html                # Catalogue page with multi-faceted filtering & sorting
├── product.html             # Deep product specifications & variant selector
├── cart.html                # Persistent shopping bag, coupons & shipping tracker
├── checkout.html            # Indian PIN validated checkout with stock locks
├── order-confirmation.html  # Verifiable order invoice & receipt generator
├── wishlist.html            # Persistent saved favorites
├── login.html               # Customer authentication & 1-click evaluation shortcuts
├── account.html             # Customer dashboard & past order tracking
├── wholesale.html           # Dedicated commercial B2B quotation desk
├── admin.html               # Protected operations & product/inventory CMS
├── about.html               # Brand history, three pillars & craft philosophy
├── contact.html             # Customer desk, WhatsApp links & physical office
├── privacy.html             # Transparent customer data & non-disclosure terms
├── terms.html               # Honest handloom variations & selling unit terms
├── shipping-returns.html    # Transit timelines & cut-fabric return policy
├── css/
│   ├── style.css            # Design tokens, variables & atomic components
│   └── responsive.css       # Mobile drawer, tablet grids & responsive media
├── js/
│   ├── products-data.js     # Master catalogue data & categories
│   ├── firebase-config.js   # Production Firebase configuration & demo engine auto-switch
│   ├── store.js             # Reactive central store (Cart, Orders, Auth, Stock)
│   ├── main.js              # Global nav, badges, search modal, toast alerts & Quick View
│   ├── shop.js              # Catalogue filter, URL query parser, sort engine
│   ├── product-details.js   # Gallery thumbnails, unit pricing & direct checkout
│   ├── cart.js              # Subtotal math, vouchers, free shipping progress
│   ├── checkout.js          # Form validation, Indian phone/PIN regex, anti-duplicate locks
│   └── admin.js             # Admin authorization, product CRUD & order status changer
├── firebase.json            # Firebase Hosting configuration
├── firestore.rules          # Production Cloud Firestore security rules
└── README.md                # Comprehensive documentation
```

---

## 🚀 1. Which Features Are Working (Out of the Box)

The website is engineered with an **interactive Local Storage Engine** that is active out-of-the-box. All features operate with zero build steps or server dependencies:

1. **Category Navigation & Filtering**: Filter among Cotton Fabrics, Silk Fabrics, Sarees, Dress Materials, Kurtis, Readymade Garments, Bedsheets, and Wholesale.
2. **Authentic Selling Units**: Products correctly indicate and calculate pricing per **metre**, **piece**, **set**, or **pack**.
3. **Live Product Search & Instant Suggestions**: Search across weaves, categories, and SKUs from any page using the top search icon.
4. **Product Quick View Modal**: Inspect swatches, select variants, and add to bag without leaving the catalogue.
5. **Multi-Image Product Gallery**: Switch high-resolution angles with thumbnail controls on `product.html`.
6. **Reactive Shopping Bag**: Full variant separation (colour + size combinations), quantity steppers, item removal, and auto-persistence.
7. **Promo Vouchers**:
   * `SVTFIRST10` — 10% off orders above ₹1,000
   * `TRADITION20` — 20% off orders above ₹5,000
8. **Shipping Calculator**: Free shipping progress bar (Free above ₹1,999; flat ₹99 below threshold).
9. **Authoritative Stock Management**: Stock is bounded in the UI and deducted from inventory upon order placement.
10. **Customer Checkout & PIN Validation**: Strict validation for Indian 10-digit mobile numbers and 6-digit postal PIN codes.
11. **Order Confirmation & Printable Receipt**: Generates a unique reference ID (e.g. `SVT-2026-XXXXX`), full price snapshot, and printable invoice.
12. **Customer Account Portal**: View order history, track statuses, and view saved addresses.
13. **Protected Admin Portal**:
    * Passcode gate (`svtadmin2026` or 1-click test button).
    * Overview metrics (Revenue, Orders, Products, Low Stock alerts).
    * Full Product CRUD (Add, Edit price/stock/unit, Delete).
    * Live Order Status Updates (`Confirmed` -> `Processing` -> `Shipped` -> `Delivered`).
    * Wholesale Leads Viewer with direct WhatsApp and email actions.
14. **Direct WhatsApp Integration**: Floating button and product-specific links automatically encode product names and SKUs.

---

## ☁️ 2. Which Features Require Firebase Configuration

To transition from the local demo engine to a multi-user cloud database:

| Feature | In Demo Engine (Current) | In Production (Firebase) |
| :--- | :--- | :--- |
| **Product Storage** | Browser `localStorage` | Cloud Firestore (`products` collection) |
| **Product Image Uploads** | Direct image URLs | Firebase Storage bucket (`/products/`) |
| **Customer Auth** | Demo session simulation | Firebase Authentication (Email/Password & Google Sign-In) |
| **Order Registry** | Local order persistence | Cloud Firestore (`orders` collection with security rules) |
| **Wholesale Inquiries** | Local lead persistence | Cloud Firestore (`wholesale_enquiries` collection) |
| **Admin Authorization** | Passcode check | Firebase Custom Auth Claims (`admin: true`) |
| **Online Payments** | Gateway test notice | Razorpay / Stripe backend webhook integration |

---

## 💻 3. How to Run the Website Locally

Since the project uses pure vanilla HTML5, CSS3, and modern JavaScript, **no npm install or build step is required**.

### Option A: Using Any Local HTTP Server
Run with Python or Node:
```powershell
# Python 3
python -m http.server 8000

# Node.js (npx)
npx serve -l 8000
```
Open your browser to `http://localhost:8000`.

### Option B: Direct File Open
You can open `index.html` directly in any modern web browser (Chrome, Edge, Firefox, Safari).

---

## 🛠️ 4. How to Add and Edit Products

1. Navigate to `admin.html`.
2. Authenticate using the passcode `svtadmin2026` (or click **⚡ Auto-Authenticate as Demo Admin**).
3. Click on the **Product Catalogue** tab in the admin sidebar.
4. **To Add a Product**: Click `+ Add New Textile Product`. Fill in the title, SKU, category, selling unit (metre, piece, set, pack), price, initial inventory, image URL, and description. Click **Save Product**.
5. **To Edit a Product**: Click the **Edit** button beside any product row. Update price, stock, or details, and click **Save Product**.
6. **Quick Stock Adjuster**: You can also click `+` or `-` or type directly into the stock box in the table for instant real-time inventory adjustments.

---

## 💳 5. How to Configure Real Customer Orders & Payments

1. **Firebase Authentication & Firestore Setup**:
   * Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com).
   * Open `js/firebase-config.js` and paste your web app credentials in `FIREBASE_CONFIG`.
   * Deploy the provided `firestore.rules` using the Firebase CLI (`firebase deploy --only firestore:rules`).
2. **Payment Gateway Integration (Razorpay / Stripe)**:
   * Sign up for a licensed Indian payment aggregator (Razorpay, Cashfree, or Stripe India).
   * Integrate the gateway via a serverless Cloud Function or trusted backend endpoint.
   * *Security Note*: Never collect raw debit/credit card numbers or UPI PINs directly on the frontend. Only mark payment as confirmed after receiving an authoritative signature or webhook from the gateway.

---

## 🌐 6. How to Deploy the Website

### Deploying to Firebase Hosting:
```powershell
# 1. Install Firebase CLI globally (if not installed)
npm install -g firebase-tools

# 2. Login to your Google account
firebase login

# 3. Associate your project
firebase use --add

# 4. Deploy hosting and security rules
firebase deploy
```

Your website will be live on `https://<your-project-id>.web.app` with complimentary global CDN, HTTPS, and automated cache headers.
