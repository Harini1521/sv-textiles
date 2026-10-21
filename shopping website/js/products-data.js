/* ==========================================================================
   SV TEXTILES — Master Product Catalogue Data
   Sample products with realistic Indian textile details, selling units,
   authentic categories, and high-resolution textile photography.
   ========================================================================== */

const SVT_CATEGORIES = [
  {
    id: 'cotton-fabrics',
    name: 'Cotton Fabrics',
    slug: 'cotton-fabrics',
    description: 'Pure breathable cottons, handblock prints, and organic slub weaves.',
    sellingUnit: 'metre',
    image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'silk-fabrics',
    name: 'Silk Fabrics',
    slug: 'silk-fabrics',
    description: 'Lustrous mulberry silks, raw silk tussar, and brocade yardage.',
    sellingUnit: 'metre',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sarees',
    name: 'Sarees',
    slug: 'sarees',
    description: 'Handwoven Kanjeevarams, Chanderis, Banarasi silk, and festive drapes.',
    sellingUnit: 'piece',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'dress-materials',
    name: 'Dress Materials',
    slug: 'dress-materials',
    description: 'Unstitched 3-piece suit sets with handcrafted dupattas.',
    sellingUnit: 'set',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'kurtis-ethnic-wear',
    name: 'Kurtis & Ethnic Wear',
    slug: 'kurtis-ethnic-wear',
    description: 'Tailored Anarkalis, everyday A-line kurtis, and festive tunics.',
    sellingUnit: 'piece',
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'readymade-garments',
    name: 'Readymade Garments',
    slug: 'readymade-garments',
    description: 'Stitched festive outfits, men ethnic kurta sets, and designer jackets.',
    sellingUnit: 'piece',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'bedsheets-home-textiles',
    name: 'Bedsheets & Home Textiles',
    slug: 'bedsheets-home-textiles',
    description: '300 Thread Count luxury pure cotton king sheets and artisanal runners.',
    sellingUnit: 'set',
    image: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'wholesale-collections',
    name: 'Wholesale Collections',
    slug: 'wholesale-collections',
    description: 'Master fabric rolls, merchant bales, and boutique wholesale lots.',
    sellingUnit: 'pack',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80'
  }
];

const SVT_INITIAL_PRODUCTS = [
  // 1. Cotton Fabrics (sold by metre)
  {
    id: 'svt-cf-01',
    sku: 'SVT-COT-60S-IND',
    name: 'Bagru Handblock Printed 60s Cambric Cotton Fabric',
    category: 'Cotton Fabrics',
    categorySlug: 'cotton-fabrics',
    price: 340,
    originalPrice: 380,
    unit: 'metre',
    minOrderQty: 1,
    stock: 85,
    rating: 4.8,
    reviewsCount: 34,
    isNew: true,
    isBestseller: true,
    isFeatured: true,
    colours: [
      { name: 'Indigo Blue', hex: '#1C3144' },
      { name: 'Forest Green', hex: '#153D32' },
      { name: 'Madder Red', hex: '#8B2635' }
    ],
    sizes: [],
    description: 'Premium 60s combed cambric cotton hand-printed by master artisans using traditional wooden blocks and natural vegetable dyes. Feather-light, breathable, and ideal for summer kurtas, shirts, and dresses.',
    material: '100% Pure Combed Cotton (60s x 60s Count)',
    width: '44 inches (112 cm)',
    careInstructions: 'First wash dry clean or separate cold hand wash with mild liquid detergent. Dry in gentle shade to preserve natural dye luster.',
    deliveryInfo: 'Ships within 24-48 business hours across India via express surface/air courier.',
    images: [
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    id: 'svt-cf-02',
    sku: 'SVT-COT-IKT-02',
    name: 'Pochampally Double Ikat Handloom Cotton Yardage',
    category: 'Cotton Fabrics',
    categorySlug: 'cotton-fabrics',
    price: 490,
    originalPrice: 550,
    unit: 'metre',
    minOrderQty: 1,
    stock: 45,
    rating: 4.9,
    reviewsCount: 28,
    isNew: false,
    isBestseller: true,
    isFeatured: false,
    colours: [
      { name: 'Mustard Gold & Black', hex: '#C6A15B' },
      { name: 'Teal & Maroon', hex: '#1E5244' }
    ],
    sizes: [],
    description: 'Authentic Telangana handloom Ikat fabric woven with resist-dyed yarns. Features razor-sharp geometric precision and a soft textured handfeel suitable for bespoke jackets, tunics, and home accents.',
    material: '100% Mercerized Cotton Handloom',
    width: '45 inches (114 cm)',
    careInstructions: 'Gentle hand wash with cold water. Avoid harsh bleaching agents. Iron on medium reverse.',
    deliveryInfo: 'Dispatch within 1-2 working days. Estimated delivery 3-5 days.',
    images: [
      'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80'
    ]
  },

  // 2. Silk Fabrics (sold by metre)
  {
    id: 'svt-sf-01',
    sku: 'SVT-SLK-RAW-01',
    name: 'Pure Mulberry Raw Tussar Silk Fabric with Slub Texture',
    category: 'Silk Fabrics',
    categorySlug: 'silk-fabrics',
    price: 1250,
    originalPrice: 1450,
    unit: 'metre',
    minOrderQty: 1,
    stock: 30,
    rating: 4.9,
    reviewsCount: 19,
    isNew: true,
    isBestseller: false,
    isFeatured: true,
    colours: [
      { name: 'Warm Ivory', hex: '#FAF7F0' },
      { name: 'Muted Gold', hex: '#C6A15B' },
      { name: 'Royal Emerald', hex: '#153D32' }
    ],
    sizes: [],
    description: 'Exquisite untreated mulberry tussar silk exhibiting the distinct natural slubs and organic sheen prized by couturiers. Stately fall with sufficient structure for sherwanis, lehenga skirts, and bridal blouses.',
    material: '100% Pure Natural Mulberry Silk',
    width: '44 inches (112 cm)',
    careInstructions: 'Strictly dry clean only. Store in muslin cloth wrap.',
    deliveryInfo: 'Insured parcel packing with tamper-evident seal. 2-4 business days delivery.',
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    id: 'svt-sf-02',
    sku: 'SVT-SLK-BRC-02',
    name: 'Varanasi Zari Brocade Katan Silk Fabric',
    category: 'Silk Fabrics',
    categorySlug: 'silk-fabrics',
    price: 1850,
    originalPrice: null,
    unit: 'metre',
    minOrderQty: 1,
    stock: 22,
    rating: 5.0,
    reviewsCount: 14,
    isNew: false,
    isBestseller: true,
    isFeatured: true,
    colours: [
      { name: 'Crimson Vermilion', hex: '#8B2635' },
      { name: 'Antique Gold', hex: '#C6A15B' }
    ],
    sizes: [],
    description: 'Woven in the historic looms of Varanasi with authentic gold and silver metallic zari threads forming intricate floral jaal motifs on a dense katan pure silk base.',
    material: 'Pure Katan Silk with Metallic Weft Zari',
    width: '42 inches (107 cm)',
    careInstructions: 'Professional dry clean only. Do not spray perfume directly on metallic zari.',
    deliveryInfo: 'Priority express dispatch with tamper-proof security box.',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1000&q=80'
    ]
  },

  // 3. Sarees (sold by piece)
  {
    id: 'svt-sr-01',
    sku: 'SVT-SAREE-KANJ-01',
    name: 'Heritage Kanjivaram Pure Silk Saree with Temple Border',
    category: 'Sarees',
    categorySlug: 'sarees',
    price: 14800,
    originalPrice: 16500,
    unit: 'piece',
    minOrderQty: 1,
    stock: 12,
    rating: 4.95,
    reviewsCount: 42,
    isNew: true,
    isBestseller: true,
    isFeatured: true,
    colours: [
      { name: 'Deep Bottle Green & Crimson', hex: '#153D32' },
      { name: 'Plum & Antique Mustard', hex: '#4A154B' }
    ],
    sizes: ['Free Size (6.3m with blouse)'],
    description: 'A masterpiece from Kanchipuram woven with certified pure mulberry silk and heavy zari pallu featuring the sacred korvai interlock temple border. Accompanied by matching unstitched blouse piece.',
    material: 'Pure Silk Mark Certified Silk with Zari',
    width: '6.3 metres inclusive of 80cm blouse length',
    careInstructions: 'Dry clean only. Roll fold every 3 months along fresh crease lines.',
    deliveryInfo: 'Includes complementary SV Textiles luxury wooden keepsake box.',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    id: 'svt-sr-02',
    sku: 'SVT-SAREE-CHN-02',
    name: 'Chanderi Silk Cotton Saree with Handwoven Butis',
    category: 'Sarees',
    categorySlug: 'sarees',
    price: 4200,
    originalPrice: 4700,
    unit: 'piece',
    minOrderQty: 1,
    stock: 25,
    rating: 4.75,
    reviewsCount: 22,
    isNew: false,
    isBestseller: false,
    isFeatured: true,
    colours: [
      { name: 'Powder Beige & Gold', hex: '#E8DFD0' },
      { name: 'Sage Green', hex: '#778F7E' }
    ],
    sizes: ['Free Size (6.2m with blouse)'],
    description: 'Gossamer-light Chanderi drape featuring delicate golden zari peacock motifs sprinkled across the body. Perfect for daytime festivities, temple visits, and office celebrations.',
    material: '70% Chanderi Silk, 30% Fine Cotton',
    width: '6.2 metres (5.5m Saree + 0.7m Blouse)',
    careInstructions: 'Dry clean recommended. Mild steam iron on reverse.',
    deliveryInfo: 'Ready to ship in 24 hours.',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1000&q=80'
    ]
  },

  // 4. Dress Materials (sold by set)
  {
    id: 'svt-dm-01',
    sku: 'SVT-DM-AJRAKH-01',
    name: 'Kutch Ajrakh Modal Silk 3-Piece Unstitched Suit Set',
    category: 'Dress Materials',
    categorySlug: 'dress-materials',
    price: 3650,
    originalPrice: 4100,
    unit: 'set',
    minOrderQty: 1,
    stock: 18,
    rating: 4.85,
    reviewsCount: 31,
    isNew: true,
    isBestseller: true,
    isFeatured: true,
    colours: [
      { name: 'Indigo & Madder', hex: '#1C3144' },
      { name: 'Olive Forest', hex: '#153D32' }
    ],
    sizes: ['Standard Unstitched (Top 2.5m, Bottom 2.5m, Dupatta 2.5m)'],
    description: 'Luxurious modal silk unstitched ensemble featuring 16-stage natural resist Ajrakh hand block printing. Set includes 2.5m kurta fabric, 2.5m coordinating bottom fabric, and an ornate 2.5m modal silk zari border dupatta.',
    material: 'Top: Modal Silk | Bottom: Pure Cotton | Dupatta: Modal Silk',
    width: 'Fabric width 44 inches',
    careInstructions: 'First wash dry clean. Subsequent gentle hand wash in cold water.',
    deliveryInfo: 'Ships in 1-2 days across all Indian pincodes.',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1000&q=80'
    ]
  },

  // 5. Kurtis & Ethnic Wear (sold by piece, size variants)
  {
    id: 'svt-kt-01',
    sku: 'SVT-KRT-ANR-01',
    name: 'Kalidar Pure Cotton Anarkali Kurti with Gota Patti',
    category: 'Kurtis & Ethnic Wear',
    categorySlug: 'kurtis-ethnic-wear',
    price: 2150,
    originalPrice: 2450,
    unit: 'piece',
    minOrderQty: 1,
    stock: 40,
    rating: 4.7,
    reviewsCount: 56,
    isNew: false,
    isBestseller: true,
    isFeatured: true,
    colours: [
      { name: 'Forest Green', hex: '#153D32' },
      { name: 'Warm Ivory', hex: '#FAF7F0' }
    ],
    sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)', 'XXL (44)'],
    description: 'Flattering 24-kali flared Anarkali silhouette tailored from soft mulmul cotton with hand-embroidered gota patti neckline detailing and functional deep side pockets.',
    material: '100% Breathable Mulmul Cotton with Cotton Voile Lining',
    width: 'Calf Length (48 inches)',
    careInstructions: 'Machine wash gentle cycle with like colours. Warm iron.',
    deliveryInfo: 'Express 48-hour dispatch.',
    images: [
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    id: 'svt-kt-02',
    sku: 'SVT-KRT-CHIK-02',
    name: 'Lucknowi Hand-Embroidered Chikankari Modal Kurta',
    category: 'Kurtis & Ethnic Wear',
    categorySlug: 'kurtis-ethnic-wear',
    price: 2800,
    originalPrice: 3200,
    unit: 'piece',
    minOrderQty: 1,
    stock: 15,
    rating: 4.9,
    reviewsCount: 38,
    isNew: true,
    isBestseller: false,
    isFeatured: false,
    colours: [
      { name: 'Ivory White', hex: '#FFFFFF' },
      { name: 'Pastel Peach', hex: '#E8DFD0' }
    ],
    sizes: ['S (36)', 'M (38)', 'L (40)', 'XL (42)'],
    description: 'Handcrafted by Awadhi women artisans using intricate bakhiya, phanda, and keel kangan stitches on fluid modal fabric. Includes separate inner slip.',
    material: 'Pure Modal Viscose with Cotton Thread Embroidery',
    width: 'Straight Cut Knee Length (44 inches)',
    careInstructions: 'Hand wash inside out with soft liquid detergent.',
    deliveryInfo: 'Standard 3-5 days delivery.',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80'
    ]
  },

  // 6. Readymade Garments (sold by piece)
  {
    id: 'svt-rg-01',
    sku: 'SVT-MEN-KRT-01',
    name: 'Men Handloom Linen-Cotton Bandhgala Kurta Set',
    category: 'Readymade Garments',
    categorySlug: 'readymade-garments',
    price: 3450,
    originalPrice: null,
    unit: 'piece',
    minOrderQty: 1,
    stock: 24,
    rating: 4.8,
    reviewsCount: 16,
    isNew: false,
    isBestseller: false,
    isFeatured: true,
    colours: [
      { name: 'Natural Khadi Beige', hex: '#E8DFD0' },
      { name: 'Charcoal Slate', hex: '#242824' }
    ],
    sizes: ['38 (Small)', '40 (Medium)', '42 (Large)', '44 (X-Large)'],
    description: 'Crisp mandarin-collar festive kurta set tailored with high thread count linen-cotton blend. Includes tapered ivory cotton churidar pyjama with drawstring closure.',
    material: '60% French Linen, 40% Fine Cotton',
    width: 'Set includes Kurta and Churidar',
    careInstructions: 'Machine wash warm, hang dry. Medium steam iron for crisp drape.',
    deliveryInfo: 'Fast dispatch within 2 business days.',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80'
    ]
  },

  // 7. Bedsheets & Home Textiles (sold by set)
  {
    id: 'svt-ht-01',
    sku: 'SVT-BED-300TC-KG',
    name: '300 TC Satin Sateen Pure Cotton King Bedsheet Set',
    category: 'Bedsheets & Home Textiles',
    categorySlug: 'bedsheets-home-textiles',
    price: 2490,
    originalPrice: 2890,
    unit: 'set',
    minOrderQty: 1,
    stock: 50,
    rating: 4.85,
    reviewsCount: 64,
    isNew: false,
    isBestseller: true,
    isFeatured: true,
    colours: [
      { name: 'Warm Ivory & Forest Motif', hex: '#FAF7F0' },
      { name: 'Soft Muted Sage', hex: '#E8DFD0' }
    ],
    sizes: ['King Size: 108 x 108 inches with 2 Pillow Covers (18 x 28 inches)'],
    description: 'Ultra-plush 300 Thread Count long-staple cotton bedsheet with a silky sateen weave. Generous 9x9 feet dimensions to fit deep mattress corners with zero slipping.',
    material: '100% Long-Staple Combed Cotton (300 Thread Count)',
    width: 'Bedsheet: 274 x 274 cm | Pillow covers: 46 x 71 cm',
    careInstructions: 'Machine wash cold on gentle cycle. Tumble dry low or air dry.',
    deliveryInfo: 'Packed in eco-friendly reusable cotton drawstring pouch.',
    images: [
      'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80'
    ]
  },

  // 8. Wholesale Collections (sold by pack / bale)
  {
    id: 'svt-ws-01',
    sku: 'SVT-BULK-CAMBRIC-50M',
    name: 'Wholesale Bale: 60s Cambric Cotton Fabric (50-Metre Roll)',
    category: 'Wholesale Collections',
    categorySlug: 'wholesale-collections',
    price: 11500,
    originalPrice: 13000,
    unit: 'pack',
    minOrderQty: 1,
    stock: 14,
    rating: 5.0,
    reviewsCount: 9,
    isNew: true,
    isBestseller: true,
    isFeatured: true,
    colours: [
      { name: 'Bleached Bleach White', hex: '#FFFFFF' },
      { name: 'Kora Natural Greige', hex: '#FAF7F0' }
    ],
    sizes: ['50 Metre Continuous Roll (Width 44 inches)'],
    description: 'Direct mill packaging for fashion boutiques, garment manufacturers, and textile retail stores. High-tensile combed yarn tested for colour uptake and zero shrinkage after bio-wash.',
    material: '100% Super-Combed Indian Cotton (60s x 60s)',
    width: '44 inches (112 cm) continuous roll',
    careInstructions: 'Suitable for industrial direct pigment printing, screen printing, or solid dyeing.',
    deliveryInfo: 'Heavy-duty poly-wrapped freight delivery with GST tax invoice.',
    images: [
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80'
    ]
  }
];
