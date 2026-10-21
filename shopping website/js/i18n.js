/* ==========================================================================
   SV TEXTILES — Bilingual Language Engine (i18n.js)
   Supports seamless English and Tamil (தமிழ்) translation across all pages.
   Zero external dependencies. Preserves existing design, colors & layout.
   ========================================================================== */

(function (window) {
  'use strict';

  const STORAGE_KEY = 'svt_lang';

  const TRANSLATIONS = {
    en: {
      // Brand & Navigation
      'brand.tagline': 'Quality • Comfort • Tradition',
      'nav.home': 'Home',
      'nav.shopAll': 'Shop All',
      'nav.cotton': 'Cotton',
      'nav.silk': 'Silk',
      'nav.sarees': 'Sarees',
      'nav.newArrivals': 'New Arrivals',
      'nav.wholesale': 'Wholesale',
      'nav.aboutUs': 'About Us',
      'nav.contact': 'Contact',
      'nav.wishlist': 'My Wishlist',
      'nav.cart': 'Shopping Bag',
      'nav.account': 'Sign In / Register',
      'nav.admin': 'Admin Dashboard',

      // Announcement Bar
      'announcement.text': 'Festive Handloom Sarees & Pure Silk Yardage Now Available • Complimentary Standard Delivery on Orders Above ₹1,999 across India',
      'announcement.b2b': 'B2B Wholesale Enquiries',
      'announcement.care': 'Customer Care',

      // Hero Section
      'hero.subtitle': 'Indian Textile Heritage',
      'hero.title': 'Weaving Quality Into Every Thread',
      'hero.title_em': 'Every Thread',
      'hero.desc': 'Discover timeless textiles, beautiful fabrics, and everyday essentials crafted for every occasion. From artisanal handblock cambric to regal Kanjivaram silks, explore unmatched craftsmanship.',
      'hero.btn_explore': 'Explore Collections',
      'hero.btn_bestsellers': 'Shop Bestsellers',

      // Category Section
      'cat.section_label': 'Curated Collections',
      'cat.title': 'Shop by Category',
      'cat.subtitle': 'Explore pure natural fibres, heritage weaves, and ready garments tailored to celebrate Indian craftsmanship.',
      'cat.explore': 'Explore Collection →',

      // Categories
      'cat.cotton-fabrics': 'Cotton Fabrics',
      'cat.silk-fabrics': 'Silk Fabrics',
      'cat.sarees': 'Sarees',
      'cat.dress-materials': 'Dress Materials',
      'cat.kurtis-ethnic-wear': 'Kurtis & Ethnic Wear',
      'cat.readymade-garments': 'Readymade Garments',
      'cat.bedsheets-home-textiles': 'Bedsheets & Home Textiles',
      'cat.wholesale-collections': 'Wholesale Collections',

      // Featured Tabs
      'feat.section_label': 'Selected Works',
      'feat.title': 'Featured Textiles & Garments',
      'feat.subtitle': 'Authentic weaves and premium garments carefully inspected for texture, drape, and yarn purity.',
      'feat.tab_all': 'All Highlights',
      'feat.tab_new': 'New Arrivals',
      'feat.tab_bestseller': 'Bestsellers',
      'feat.tab_featured': "Editor's Choice",
      'feat.view_all': 'View Entire Catalogue →',

      // Product Card & Details UI
      'prod.per': 'per',
      'prod.add': 'Add',
      'prod.add_to_bag': 'Add to Bag',
      'prod.quick_view': 'Quick View',
      'prod.view_full': 'View Full',
      'prod.buy_now': 'Buy Now →',
      'prod.in_stock': 'In Stock',
      'prod.out_of_stock': 'Out of Stock',
      'prod.sold_out': 'Sold Out',
      'prod.low_stock': 'Only {n} left',
      'prod.new_badge': 'New Arrival',
      'prod.bestseller_badge': 'Bestseller',
      'prod.select_colour': 'Available Colours:',
      'prod.select_size': 'Select Size / Cut:',
      'prod.quantity': 'Quantity',
      'prod.sold_per': 'Sold per {unit}',
      'prod.inclusive_taxes': 'Inclusive of all taxes',
      'prod.desc_tab': 'Description',
      'prod.care_tab': 'Fabric Care',
      'prod.delivery_tab': 'Delivery & Returns',
      'prod.related_title': 'Related Collections',
      'prod.related_sub': 'Coordinating Weaves',
      'prod.whatsapp_enquiry': 'Enquire About Bulk Availability On WhatsApp',
      'prod.fabric_weave': 'Fabric / Weave:',
      'prod.width_dim': 'Width / Dimension:',
      'prod.selling_unit_lbl': 'Selling Unit:',
      'prod.min_order': 'Minimum Order:',
      'prod.material_lbl': 'Material Composition:',
      'prod.sku_lbl': 'SKU Code:',
      'prod.save_calc': 'Save ₹{amount} ({percent}% OFF)',
      'prod.stock_count': '{n} {unit}(s) available',
      'prod.low_stock_alert': 'Only {n} {unit}(s) left in stock',
      'prod.selected': 'Selected',
      'prod.reviews': 'reviews',

      // Units
      'unit.metre': 'metre',
      'unit.piece': 'piece',
      'unit.set': 'set',
      'unit.pack': 'pack',

      // Catalogue & Filters
      'shop.title': 'Textile Catalogue',
      'shop.subtitle': 'Filter by category, authentic selling units (metre, piece, set, pack), or search by fabric weave.',
      'shop.filters': 'Filters',
      'shop.clear_all': 'Clear All',
      'shop.category': 'Category',
      'shop.all_categories': 'All Categories',
      'shop.selling_unit': 'Selling Unit',
      'shop.price_range': 'Price Range (₹)',
      'shop.apply_price': 'Apply Price',
      'shop.availability': 'Availability',
      'shop.in_stock_only': 'In Stock Only',
      'shop.sort_by': 'Sort By:',
      'shop.sort_featured': 'Featured / Curated',
      'shop.sort_price_low': 'Price: Low to High',
      'shop.sort_price_high': 'Price: High to Low',
      'shop.sort_newest': 'Newest Arrivals',
      'shop.sort_name_az': 'Name: A to Z',
      'shop.showing': 'Showing',
      'shop.products': 'products',
      'shop.empty_title': 'No Matching Textiles Found',
      'shop.empty_desc': "We couldn't find any fabrics matching your active filter criteria. Try clearing some filters or searching for another weave.",
      'shop.reset_filters': 'Reset All Filters',
      'shop.unit_metre': 'By the Metre (Fabrics)',
      'shop.unit_piece': 'By the Piece (Sarees, Kurtis)',
      'shop.unit_set': 'By the Set (Suits, Bedsheets)',
      'shop.unit_pack': 'By the Pack (Wholesale Bales)',

      // Shopping Bag
      'cart.title': 'Your Shopping Bag',
      'cart.subtitle': 'Review your chosen fabrics, dimensions, and quantities before entering delivery details.',
      'cart.col_product': 'Textile Product',
      'cart.col_unit_price': 'Unit Price',
      'cart.col_quantity': 'Quantity',
      'cart.col_subtotal': 'Subtotal',
      'cart.order_summary': 'Order Summary',
      'cart.bag_subtotal': 'Bag Subtotal:',
      'cart.discount': 'Promotional Discount:',
      'cart.shipping': 'Standard Delivery:',
      'cart.total': 'Estimated Total:',
      'cart.free': 'FREE',
      'cart.voucher_label': 'Have a Promo Voucher?',
      'cart.voucher_placeholder': 'e.g. SVTFIRST10',
      'cart.apply_voucher': 'Apply',
      'cart.proceed_checkout': 'Proceed to Checkout →',
      'cart.continue_shopping': '← Add more fabrics',
      'cart.empty_title': 'Your Shopping Bag is Empty',
      'cart.empty_desc': 'Explore our collection of pure cottons, handloom sarees, and unstitched dress materials to begin your order.',

      // Search Modal
      'search.heading': 'Search SV Textiles Collections',
      'search.placeholder': 'Search cotton, sarees, tussar silk, dress materials...',
      'search.hint': 'Type a fabric name, weave, or SKU above to search our catalogue...',
      'search.no_results': 'No matching fabrics or garments found for',
      'search.view_all_catalogue': 'View All Catalogue',

      // Brand Story & Why Choose Us
      'story.section_label': 'Authentic Craftsmanship',
      'story.title': 'Tradition Woven Into Modern Living',
      'why.section_label': 'The SV Standard',
      'why.title': 'Why Choose SV TEXTILES?',
      'why.subtitle': 'Reliable specifications, dependable fabrics, and customer-first service.',

      // Wholesale Banner
      'wholesale.label': 'Commercial & Boutique Buyers',
      'wholesale.title': 'Looking for Textiles in Bulk?',
      'wholesale.desc': 'We cater to fashion designers, garment manufacturers, boutique owners, and retail textile shops across India with tiered wholesale pricing, mill-packaged rolls, and dedicated delivery logistics.',
      'wholesale.btn': 'Submit Wholesale Enquiry →',

      // Footer
      'footer.desc': 'A premier Indian textile destination offering pure cotton yardage, mulberry silk drapes, handcrafted sarees, and bulk textile solutions.',
      'footer.quick_links': 'Quick Links',
      'footer.categories': 'Categories',
      'footer.contact_desk': 'Contact Desk',
      'footer.rights': 'All rights reserved. Quality • Comfort • Tradition.'
    },

    ta: {
      // Brand & Navigation
      'brand.tagline': 'தரம் • சௌகரியம் • பாரம்பரியம்',
      'nav.home': 'முகப்பு',
      'nav.shopAll': 'அனைத்து ஆடைகள்',
      'nav.cotton': 'பருத்தி',
      'nav.silk': 'பட்டு',
      'nav.sarees': 'புடவைகள்',
      'nav.newArrivals': 'புதிய வரவுகள்',
      'nav.wholesale': 'மொத்த விற்பனை',
      'nav.aboutUs': 'எங்களைப் பற்றி',
      'nav.contact': 'தொடர்புக்கு',
      'nav.wishlist': 'விருப்பப்பட்டியல்',
      'nav.cart': 'ஷாப்பிங் பை',
      'nav.account': 'உள்நுழைவு / பதிவு',
      'nav.admin': 'நிர்வாக தளம்',

      // Announcement Bar
      'announcement.text': 'பண்டிகைக் கால கைத்தறி புடவைகள் & தூய பட்டு துணிகள் இப்போது கிடைக்கும் • ₹1,999-க்கு மேல் வாங்கும் ஆர்டர்களுக்கு இந்தியா முழுவதும் இலவச டெலிவரி',
      'announcement.b2b': 'மொத்த விற்பனை விசாரணை',
      'announcement.care': 'வாடிக்கையாளர் சேவை',

      // Hero Section
      'hero.subtitle': 'பாரம்பரிய இந்திய நெசவுத் தரம்',
      'hero.title': 'ஒவ்வொரு நூலிலும் தரத்தை நெய்கிறோம்',
      'hero.title_em': 'தரத்தை நெய்கிறோம்',
      'hero.desc': 'எல்லா தருணங்களுக்கும் ஏற்ற பாரம்பரிய துணிகள், கைத்தறிப் புடவைகள் மற்றும் அன்றாட ஆடைத் தேவைகளை கண்டறியுங்கள். அசல் பாக்ரு பருத்தி முதல் காஞ்சிபுரம் பட்டு வரை நிகரற்ற கைவினை நேர்த்தி.',
      'hero.btn_explore': 'ஆடைகளை காண்க',
      'hero.btn_bestsellers': 'அதிகம் விற்பனையானவை',

      // Category Section
      'cat.section_label': 'தேர்ந்தெடுக்கப்பட்ட தொகுப்புகள்',
      'cat.title': 'பிரிவுகள் வாரியாக வாங்குக',
      'cat.subtitle': 'இந்திய பாரம்பரிய கைத்தறி மற்றும் தூய இயற்கை நூல்களாலான ஆடைத் தொகுப்புகளைக் கண்டறியுங்கள்.',
      'cat.explore': 'தொகுப்பைக் காண்க →',

      // Categories
      'cat.cotton-fabrics': 'பருத்தி துணிகள்',
      'cat.silk-fabrics': 'பட்டு துணிகள்',
      'cat.sarees': 'பாரம்பரிய புடவைகள்',
      'cat.dress-materials': 'சுடிதார் மெட்டீரியல்',
      'cat.kurtis-ethnic-wear': 'குர்த்திகள் & ஆடைகள்',
      'cat.readymade-garments': 'ஆயத்த ஆடைகள்',
      'cat.bedsheets-home-textiles': 'படுக்கை விரிப்புகள் & வீட்டு துணிகள்',
      'cat.wholesale-collections': 'மொத்த விற்பனை ஆடைகள்',

      // Featured Tabs
      'feat.section_label': 'சிறப்புத் தேர்வுகள்',
      'feat.title': 'சிறப்பு துணிகள் & ஆடைகள்',
      'feat.subtitle': 'நூல் தரம், நெசவு நேர்த்தி மற்றும் சாயத் தரம் பரிசோதிக்கப்பட்ட அசல் ஆடைகள்.',
      'feat.tab_all': 'அனைத்து சிறப்புகள்',
      'feat.tab_new': 'புதிய வரவுகள்',
      'feat.tab_bestseller': 'அதிகம் விற்பனையானவை',
      'feat.tab_featured': 'ஆசிரியர் தேர்வு',
      'feat.view_all': 'முழு தொகுப்பையும் காண்க →',

      // Product Card & Details UI
      'prod.per': '',
      'prod.add': 'சேர்',
      'prod.add_to_bag': 'பையில் சேர்',
      'prod.quick_view': 'முன்னோட்டம்',
      'prod.view_full': 'முழு விவரம்',
      'prod.buy_now': 'உடனே வாங்க →',
      'prod.in_stock': 'இருப்பில் உள்ளது',
      'prod.out_of_stock': 'இருப்பு தீர்ந்தது',
      'prod.sold_out': 'விற்பனையானது',
      'prod.low_stock': '{n} மட்டுமே உள்ளது',
      'prod.new_badge': 'புதிய வரவு',
      'prod.bestseller_badge': 'அதிக விற்பனை',
      'prod.select_colour': 'விருப்ப வண்ணங்கள்:',
      'prod.select_size': 'அளவைத் தேர்ந்தெடுக்கவும்:',
      'prod.quantity': 'அளவு',
      'prod.sold_per': 'ஒரு {unit} வீதம் விற்பனை',
      'prod.inclusive_taxes': 'அனைத்து வரிகளும் உள்ளடங்கியது',
      'prod.desc_tab': 'விவரம்',
      'prod.care_tab': 'பராமரிப்பு முறை',
      'prod.delivery_tab': 'டெலிவரி & திரும்பப் பெறுதல்',
      'prod.related_title': 'தொடர்புடைய ஆடைகள்',
      'prod.related_sub': 'பொருந்தும் நெசவுகள்',
      'prod.whatsapp_enquiry': 'மொத்த விநியோகம் குறித்து வாட்ஸ்அப்பில் விசாரிக்கவும்',
      'prod.fabric_weave': 'துணி / நெசவு:',
      'prod.width_dim': 'அகலம் / பரிமாணம்:',
      'prod.selling_unit_lbl': 'விற்பனை அலகு:',
      'prod.min_order': 'குறைந்தபட்ச ஆர்டர்:',
      'prod.material_lbl': 'துணி மூலப்பொருள்:',
      'prod.sku_lbl': 'SKU குறியீடு:',
      'prod.save_calc': '₹{amount} சேமிப்பு ({percent}% தள்ளுபடி)',
      'prod.stock_count': '{n} {unit} இருப்பில் உள்ளது',
      'prod.low_stock_alert': '{n} {unit} மட்டுமே இருப்பில் உள்ளது',
      'prod.selected': 'தேர்வு',
      'prod.reviews': 'மதிப்புரைகள்',

      // Units
      'unit.metre': 'மீட்டர்',
      'unit.piece': 'துண்டு',
      'unit.set': 'செட்',
      'unit.pack': 'பேக்',

      // Catalogue & Filters
      'shop.title': 'துணி வகைகள் பட்டியல்',
      'shop.subtitle': 'பிரிவு வாரியாகவோ, விற்பனை அலகுகள் (மீட்டர், துண்டு, செட், பேக்) மூலமாகவோ வடிகட்டிப் பாருங்கள்.',
      'shop.filters': 'வடிகட்டிகள்',
      'shop.clear_all': 'அனைத்தும் நீக்கு',
      'shop.category': 'பிரிவு',
      'shop.all_categories': 'அனைத்துப் பிரிவுகளும்',
      'shop.selling_unit': 'விற்பனை அலகு',
      'shop.price_range': 'விலை வரம்பு (₹)',
      'shop.apply_price': 'விலையை வடிகட்டு',
      'shop.availability': 'இருப்பு நிலை',
      'shop.in_stock_only': 'இருப்பில் உள்ளவை மட்டும்',
      'shop.sort_by': 'வரிசைப்படுத்து:',
      'shop.sort_featured': 'சிறப்புத் தேர்வுகள்',
      'shop.sort_price_low': 'விலை: குறைவு முதல் அதிகம்',
      'shop.sort_price_high': 'விலை: அதிகம் முதல் குறைவு',
      'shop.sort_newest': 'புதிய வரவுகள்',
      'shop.sort_name_az': 'பெயர்: A முதல் Z',
      'shop.showing': 'காட்டப்படும் பொருட்கள்:',
      'shop.products': 'துணிகள்',
      'shop.empty_title': 'பொருத்தமான ஆடைகள் எதுவும் கிடைக்கவில்லை',
      'shop.empty_desc': 'நீங்கள் தேர்ந்தெடுத்த வடிகட்டிகளுக்கு ஆடைகள் இல்லை. வடிகட்டிகளை மாற்றி மீண்டும் முயற்சிக்கவும்.',
      'shop.reset_filters': 'அனைத்து வடிகட்டிகளையும் மீட்டமை',
      'shop.unit_metre': 'மீட்டர் அடிப்படையில் (துணிகள்)',
      'shop.unit_piece': 'துண்டு அடிப்படையில் (புடவைகள், குர்த்திகள்)',
      'shop.unit_set': 'செட் அடிப்படையில் (சுடிதார், படுக்கை விரிப்பு)',
      'shop.unit_pack': 'பேக் அடிப்படையில் (மொத்த ரோல்கள்)',

      // Shopping Bag
      'cart.title': 'உங்கள் ஷாப்பிங் பை',
      'cart.subtitle': 'டெலிவரி முகவரியை உள்ளிடும் முன் நீங்கள் தேர்ந்தெடுத்த ஆடைகளையும் அளவுகளையும் சரிபார்க்கவும்.',
      'cart.col_product': 'ஆடை / துணி வகை',
      'cart.col_unit_price': 'அலகு விலை',
      'cart.col_quantity': 'அளவு',
      'cart.col_subtotal': 'கூட்டுத்தொகை',
      'cart.order_summary': 'ஆர்டர் சுருக்கம்',
      'cart.bag_subtotal': 'பையின் கூட்டுத்தொகை:',
      'cart.discount': 'தள்ளுபடி:',
      'cart.shipping': 'டெலிவரி கட்டணம்:',
      'cart.total': 'மொத்தத் தொகை:',
      'cart.free': 'இலவசம்',
      'cart.voucher_label': 'தள்ளுபடி கூப்பன் உள்ளதா?',
      'cart.voucher_placeholder': 'எ.கா. SVTFIRST10',
      'cart.apply_voucher': 'பயன்படுத்து',
      'cart.proceed_checkout': 'செக் அவுட் செல்க →',
      'cart.continue_shopping': '← மேலும் துணிகளைப் பார்க்க',
      'cart.empty_title': 'உங்கள் ஷாப்பிங் பை காலியாக உள்ளது',
      'cart.empty_desc': 'எங்கள் தூய பருத்தி துணிகள், கைத்தறிப் புடவைகள் மற்றும் சுடிதார் ஆடைகளை ஆர்டர் செய்யத் தொடங்குங்கள்.',

      // Search Modal
      'search.heading': 'SV Textiles ஆடைத் தேடல்',
      'search.placeholder': 'பருத்தி, புடவைகள், பட்டு, சுடிதார் எனத் தேடுங்கள்...',
      'search.hint': 'மேலே உள்ள கட்டத்தில் துணி பெயர், நெசவு அல்லது SKU குறியீட்டைத் தட்டச்சு செய்யவும்...',
      'search.no_results': 'பொருத்தமான துணிகள் எதுவும் கிடைக்கவில்லை:',
      'search.view_all_catalogue': 'அனைத்து ஆடைகளையும் காண்க',

      // Brand Story & Why Choose Us
      'story.section_label': 'அசல் கைவினை நேர்த்தி',
      'story.title': 'பாரம்பரிய நெசவு நவீன வாழ்வியலில்',
      'why.section_label': 'SV தரம்',
      'why.title': 'ஏன் SV TEXTILES-ஐ தேர்ந்தெடுக்க வேண்டும்?',
      'why.subtitle': 'நம்பகமான நூல் விவரங்கள், தரமான துணிகள் மற்றும் வாடிக்கையாளர் முதன்மை சேவை.',

      // Wholesale Banner
      'wholesale.label': 'வர்த்தக & பொட்டிக் வாங்குபவர்கள்',
      'wholesale.title': 'மொத்தமாக துணிகள் வாங்க வேண்டுமா?',
      'wholesale.desc': 'ஆடை வடிவமைப்பாளர்கள், பொட்டிக் உரிமையாளர்கள் மற்றும் சில்லறை ஜவுளி கடைகளுக்கு மொத்த விலை மற்றும் நேரடி மில் விநியோகத்தை வழங்குகிறோம்.',
      'wholesale.btn': 'மொத்த விற்பனை விசாரணை சமர்ப்பிக்கவும் →',

      // Footer
      'footer.desc': 'தூய பருத்தி துணிகள், மல்பெரி பட்டு ஆடைகள், கைத்தறி புடவைகள் மற்றும் மொத்த ஜவுளி தீர்வுகளை வழங்கும் முன்னணி இந்திய ஆடை நிறுவனம்.',
      'footer.quick_links': 'விரைவு இணைப்புகள்',
      'footer.categories': 'பிரிவுகள்',
      'footer.contact_desk': 'தொடர்பு மையம்',
      'footer.rights': 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை. தரம் • சௌகரியம் • பாரம்பரியம்.'
    }
  };

  const SVTI18n = {
    currentLang: localStorage.getItem(STORAGE_KEY) || 'en',

    getLang() {
      return this.currentLang;
    },

    setLang(lang) {
      if (lang !== 'en' && lang !== 'ta') lang = 'en';
      this.currentLang = lang;
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.setAttribute('lang', lang);

      // Translate all DOM elements containing data-i18n
      this.translateDOM();

      // Dispatch event for dynamic re-renders (like product cards & cart tables)
      window.dispatchEvent(new CustomEvent('svt_lang_change', { detail: { lang } }));

      // Update switcher pills active state
      this.updateSwitcherPills();
    },

    t(key, params = {}) {
      const dict = TRANSLATIONS[this.currentLang] || TRANSLATIONS.en;
      let text = dict[key] || TRANSLATIONS.en[key] || key;
      Object.keys(params).forEach(k => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), params[k]);
      });
      return text;
    },

    translateDOM() {
      // 1. Text content
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key) {
          const translation = this.t(key);
          el.textContent = translation;
        }
      });

      // 2. Placeholders
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (key) {
          el.setAttribute('placeholder', this.t(key));
        }
      });

      // 3. Titles / Aria labels
      document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (key) {
          el.setAttribute('title', this.t(key));
        }
      });
    },

    updateSwitcherPills() {
      document.querySelectorAll('.lang-btn').forEach(btn => {
        const btnLang = btn.getAttribute('data-lang');
        if (btnLang === this.currentLang) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    },

    renderLanguageSwitcherHTML() {
      return `
        <div class="lang-switcher" aria-label="Select Language">
          <button type="button" class="lang-btn ${this.currentLang === 'en' ? 'active' : ''}" data-lang="en" title="English">EN</button>
          <span class="lang-divider">|</span>
          <button type="button" class="lang-btn ${this.currentLang === 'ta' ? 'active' : ''}" data-lang="ta" title="தமிழ்">தமிழ்</button>
        </div>
      `;
    },

    init() {
      document.documentElement.setAttribute('lang', this.currentLang);

      // Event delegation for language buttons anywhere on the page
      document.addEventListener('click', (e) => {
        const btn = e.target.closest('.lang-btn');
        if (btn) {
          e.preventDefault();
          const targetLang = btn.getAttribute('data-lang');
          if (targetLang && targetLang !== this.currentLang) {
            this.setLang(targetLang);
          }
        }
      });

      // Initial translation of static elements
      this.translateDOM();
      this.updateSwitcherPills();
    }
  };

  // Expose globally
  window.SVTI18n = SVTI18n;

  // Initialize as soon as DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SVTI18n.init());
  } else {
    SVTI18n.init();
  }
})(window);
