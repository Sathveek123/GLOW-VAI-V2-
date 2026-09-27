const fs = require('fs');
const path = require('path');

const screensDir = path.resolve(__dirname, '..', 'docs', 'screens');
if (!fs.existsSync(screensDir)) {
  fs.mkdirSync(screensDir, { recursive: true });
}

const screens = [
  // Category A: Launch, Onboarding & Permissions
  {
    file: '01_SPLASH_SCREEN.md',
    number: '01',
    title: 'Splash Screen',
    route: 'app/index.tsx | src/features/onboarding/SplashScreen.tsx',
    category: 'Launch & Onboarding',
    tokens: 'Atmospheric Vertical Blue Gradient (#1A73E8 -> #FFFFFF / #060D1E), Syne_700Bold Typography, Center Brand Mark',
    components: 'Animated Brand Logo, Version Label, Centered Spring Animation, Offline Toast',
    content: 'Full screen atmospheric visual background with "glowvai" lowercase typography logo, subtle pulse animation, and bottom "MADE IN INDIA" uppercase branding tag.',
    state: 'Initial boot checks -> checks authentication token in Firebase Auth -> routes to WelcomeScreen or HomeScreen.',
    backend: 'Firebase Auth onAuthStateChanged listener, Local AsyncStorage token check.'
  },
  {
    file: '02_WELCOME_SCREEN.md',
    number: '02',
    title: 'Welcome Screen',
    route: 'app/(auth)/welcome.tsx | src/features/onboarding/WelcomeScreen.tsx',
    category: 'Launch & Onboarding',
    tokens: 'Deep Blue Background (#060D1E), White Cards (#FFFFFF), Syne Header, Inter Body',
    components: 'Feature Carousel, Primary Action Button ("Get Started"), Secondary Button ("Explore Products")',
    content: 'Hero headline "AI Skincare & 15-Min Express Delivery", feature points showcasing AI Face Scan, Dermatologist Routines, and Hyper-Local Quick Commerce.',
    state: 'Interactive slider pagination, tap handling on "Get Started" navigating to Phone Login.',
    backend: 'Static onboarding state asset loader.'
  },
  {
    file: '03_GLOWVAI_INTRO.md',
    number: '03',
    title: 'GlowVAI Platform Introduction Screen',
    route: 'app/(auth)/onboarding.tsx | src/features/onboarding/IntroScreen.tsx',
    category: 'Launch & Onboarding',
    tokens: 'Linear Atmospheric Gradient (#070D1C -> #1E56B3), Syne 800 Typography, Micro-Card Badges',
    components: 'Value Proposition Cards, Animated Scan Graphic, "Continue to Login" Button',
    content: 'Detailed breakdown of GlowVAI core pillars: PyTorch Multi-Task Skin Scan, 100% Authentic Products, Student Referral Coins, and Beauty Protection Warranty.',
    state: 'Step-by-step slide progression, swipe gestures enabled.',
    backend: 'None (Local client onboarding state).'
  },
  {
    file: '04_CAMERA_PERMISSION.md',
    number: '04',
    title: 'Camera Permission Prompt Screen',
    route: 'app/(customer)/permissions.tsx | src/components/modals/CameraPermissionModal.tsx',
    category: 'Permissions & Privacy',
    tokens: 'Dark Glassmorphic Modal Backdrop (rgba(6,13,30,0.85)), Cyan Glow Accents (#00F2FE)',
    components: 'Camera Lens Illustration, Privacy Guarantee Badge, "Grant Camera Access" CTA, "Skip for Now" Text',
    content: 'Clear privacy notice assuring user that facial biometric images are processed securely and never stored as raw identity embeddings without consent.',
    state: 'Checking expo-camera permissions state -> Granted (navigate to camera view) / Denied (show permissions guide).',
    backend: 'Native Android permissions API integration.'
  },
  {
    file: '05_LOCATION_PERMISSION.md',
    number: '05',
    title: 'GPS Location Permission Modal Screen',
    route: 'app/(customer)/location/setup.tsx | src/components/modals/LocationPermissionModal.tsx',
    category: 'Permissions & Location',
    tokens: 'Google Android Styled Card, Blue Accent (#1A73E8), Surface Gray (#F8F9FA)',
    components: 'Precise vs Approximate Location Graphic, Serviceability Notice, "Allow While Using App" CTA',
    content: 'Explains why location is required: Point-in-Polygon check for Vijayawada 30–60 min quick commerce vs Pan-India standard delivery.',
    state: 'Triggering expo-location requestForegroundPermissionsAsync -> Save lat/lng -> PIP query.',
    backend: 'Google Maps Geolocation API, Firestore deliveryZones query.'
  },
  {
    file: '06_NOTIFICATION_PERMISSION.md',
    number: '06',
    title: 'Push Notification Consent Screen',
    route: 'src/features/onboarding/NotificationConsentScreen.tsx',
    category: 'Permissions & Notifications',
    tokens: 'Glassmorphic Overlay, Vibrant Blue (#1E56B3), Soft White Typography',
    components: 'Bell Ringing Animation, Toggle Switch, "Enable Order Updates" CTA',
    content: 'Highlights benefit of push notifications: Live rider dispatch updates, scan report ready alerts, and student coin credit notifications.',
    state: 'Expo Push Notifications token registration.',
    backend: 'Firebase Cloud Messaging (FCM) token registration saved to users/{uid}.'
  },
  {
    file: '07_TERMS_PRIVACY.md',
    number: '07',
    title: 'Terms, Privacy & Medical Disclaimer Screen',
    route: 'app/(auth)/terms-privacy.tsx | src/features/onboarding/TermsPrivacyScreen.tsx',
    category: 'Permissions & Compliance',
    tokens: 'Clean Paper Background (#FFFFFF), Dark Slate Text (#1E293B), Border Rules (#E2E8F0)',
    components: 'Scrollable HTML Document View, Consent Checkboxes, "I Accept & Proceed" Button',
    content: 'Full Terms of Service, Privacy Policy, DPDP Act 2023 compliance, and explicit Medical Disclaimer ("Cosmetic analysis, not clinical diagnosis").',
    state: 'Must scroll to bottom or check mandatory consent toggle to enable action button.',
    backend: 'Saves consents object with Timestamp to Firestore users/{uid}.'
  },
  {
    file: '08_ONBOARDING_SUCCESS.md',
    number: '08',
    title: 'Onboarding Completion Screen',
    route: 'src/features/onboarding/OnboardingSuccessScreen.tsx',
    category: 'Launch & Onboarding',
    tokens: 'Emerald Success Accent (#10B981), Atmospheric Dark Gradient',
    components: 'Checkmark Lottie Animation, "Welcome to GlowVAI" Headline, "Explore Products" CTA',
    content: 'Congratulatory screen welcoming new user with custom profile token and initial reward teaser.',
    state: 'Automated 2-second auto-redirect to Customer Tab Home.',
    backend: 'Updates onboardingCompleted: true in Firestore.'
  },

  // Category B: Authentication & Student Verification
  {
    file: '09_LOGIN_PHONE.md',
    number: '09',
    title: 'Phone Login Screen',
    route: 'app/(auth)/login.tsx | src/features/auth/LoginScreen.tsx',
    category: 'Authentication',
    tokens: 'Blue Atmospheric Gradient (#060D1E -> #1E56B3 -> #070D1C), Syne Typography, Glowing Borders',
    components: 'Country Code Selector Button (+91 India Flag), Phone Input Field, Send OTP Button',
    content: 'Phone entry field validating 10-digit Indian numbers with automatic formatting and country code modal picker.',
    state: 'Input validation (E.164 format) -> Disable button if length < 10 -> Show loading spinner on click.',
    backend: 'Firebase Auth signInWithPhoneNumber triggering real SMS OTP.'
  },
  {
    file: '10_OTP_VERIFICATION.md',
    number: '10',
    title: 'OTP Verification Screen',
    route: 'app/(auth)/verify-otp.tsx | src/features/auth/OtpVerificationScreen.tsx',
    category: 'Authentication',
    tokens: 'Dark Blue (#060D1E), 4-Box Pin Input, Neon Focus Glow (#00F2FE)',
    components: '4-Digit Pin Inputs with Auto-Focus, 30s Resend Timer, "Verify & Proceed" Button',
    content: 'SMS pin verification screen displaying recipient number "+91 XXXXX XXXXX" with auto-advance and backspace focus handling.',
    state: 'Auto-submit on 4th digit entry -> Validate confirmation result -> Navigate to Home or Profile Setup on success.',
    backend: 'ConfirmationResult.confirm(otpCode) -> Firebase Auth token session.'
  },
  {
    file: '11_RESEND_OTP.md',
    number: '11',
    title: 'Resend OTP & Phone Correction Modal',
    route: 'src/features/auth/ResendOtpModal.tsx',
    category: 'Authentication',
    tokens: 'Dark Sheet Overlay, Warning Yellow (#F59E0B), Action Blue (#1A73E8)',
    components: 'Timer Countdown Display, "Resend SMS" Link, "Edit Mobile Number" Action',
    content: 'Handles expired OTP states, providing fallback SMS resend or option to edit mistyped phone number.',
    state: 'Resend countdown reset to 30s -> Re-initiates Firebase Auth phone sign in.',
    backend: 'Firebase Auth re-send token call.'
  },
  {
    file: '12_STUDENT_VERIFICATION.md',
    number: '12',
    title: 'Student ID Verification Submission Screen',
    route: 'src/features/referrals/StudentVerificationScreen.tsx',
    category: 'Referrals & Verification',
    tokens: 'University Purple & Blue Accent (#6366F1 -> #1E56B3), Card Surface (#0F172A)',
    components: 'College Name Autocomplete Input, Student ID Card Camera/Upload Card, Submit Button',
    content: 'Student identification upload portal requiring college name, enrollment number, and clear ID card photo for referral coin eligibility.',
    state: 'Upload progress bar -> Image quality check -> Submission confirmation state.',
    backend: 'Firebase Storage upload to studentIds/{uid}.jpg -> Creates document in studentReferrals collection.'
  },
  {
    file: '13_STUDENT_STATUS.md',
    number: '13',
    title: 'Student Verification Status Banner & Screen',
    route: 'src/features/referrals/StudentStatusScreen.tsx',
    category: 'Referrals & Verification',
    tokens: 'Status Colors: Amber (#F59E0B Pending), Emerald (#10B981 Verified), Red (#EF4444 Rejected)',
    components: 'Status Badge, Verification Timeline Card, Unique Referral Code Card (if verified)',
    content: 'Displays live status of student audit (`PENDING_VERIFICATION`, `VERIFIED`, `REJECTED`) with admin review notes.',
    state: 'Real-time Firestore snapshot listener on users/{uid}.isStudentVerified.',
    backend: 'Cloud Firestore users/{uid} studentDetails snapshot.'
  },
  {
    file: '14_PROFILE_SETUP.md',
    number: '14',
    title: 'Initial User Profile Setup Screen',
    route: 'src/features/auth/ProfileSetupScreen.tsx',
    category: 'Authentication & Onboarding',
    tokens: 'Dark Theme Surface (#0F172A), Accent Blue (#1A73E8), Rounded Card Chips',
    components: 'Full Name Input, Age Range Radio Chips (18-24, 25-34, etc.), Gender Selection, Save Button',
    content: 'Quick 3-step demographic setup screen personalizing AI skincare diagnostic baselines.',
    state: 'Form validation -> Update Firestore profile -> Proceed to Skin Survey or Home.',
    backend: 'Firestore users/{uid} set with merge option.'
  },
  {
    file: '15_SKIN_CONCERNS_SURVEY.md',
    number: '15',
    title: 'Skin Concerns Survey Screen',
    route: 'src/features/shop/SkinConcernsSurveyScreen.tsx',
    category: 'Diagnostics & Personalization',
    tokens: 'Vibrant Glassmorphism, Multi-Select Check Chips, Cyan Glow',
    components: 'Concern Selectors (Acne, Hyperpigmentation, Dryness, Oiliness, Sensitivity), "Save Profile" CTA',
    content: 'Interactive multi-select grid allowing users to flag primary skin goals prior to taking their first face scan.',
    state: 'Selected items array state -> Updates skinProfile.primaryConcerns in user record.',
    backend: 'Firestore users/{uid}/skinProfile update.'
  },
  {
    file: '16_AUTH_ERROR.md',
    number: '16',
    title: 'Authentication Error & Recovery Screen',
    route: 'src/components/ui/ErrorState.tsx',
    category: 'Authentication & System',
    tokens: 'Alert Red (#EF4444), Surface Dark (#060D1E), White Text',
    components: 'Error Alert Icon, Diagnostic Error Message, "Try Again" Button, "Contact Support" Link',
    content: 'Graceful error handler catch-all for invalid OTP pins, network dropouts, or expired Firebase auth tokens.',
    state: 'Renders explicit error details without exposing sensitive stack traces.',
    backend: 'Firebase Auth error code mapper.'
  },

  // Category C: Location Setup & Quick-Commerce Serviceability
  {
    file: '17_LOCATION_SETUP.md',
    number: '17',
    title: 'Location Setup & Search Screen',
    route: 'app/(customer)/location/setup.tsx | src/features/location/LocationSetupScreen.tsx',
    category: 'Location & Serviceability',
    tokens: 'Clean Light/Dark Hybrid, Google Maps Pin Icon, Search Bar Shadow',
    components: 'Search Location Bar, "Use Current GPS Location" Button, Recent Addresses List',
    content: 'Allows user to search Indian cities/localities or trigger instant GPS location detection.',
    state: 'Google Places Autocomplete suggestions list -> Triggers Reverse Geocoding API.',
    backend: 'Google Places API / FastAPI /api/v1/maps/geocode proxy.'
  },
  {
    file: '18_MAP_PIN_PICKER.md',
    number: '18',
    title: 'Interactive Map Pin Location Picker Screen',
    route: 'src/features/location/MapPinPickerScreen.tsx',
    category: 'Location & Serviceability',
    tokens: 'Map View Surface, Center Pin Marker with Ripple Animation, Bottom Address Card',
    components: 'React Native Maps View, Draggable Pin Marker, "Confirm Location & Proceed" CTA Button',
    content: 'Full-screen map allowing user to drag the pin onto their exact building/doorstep in Vijayawada or Pan-India.',
    state: 'OnRegionChangeComplete updates lat/lng coordinates -> Real-time reverse geocoding of map center point.',
    backend: 'Google Maps Android SDK, FastAPI /api/v1/maps/reverse-geocode.'
  },
  {
    file: '19_ADD_ADDRESS.md',
    number: '19',
    title: 'Add New Address Form Screen',
    route: 'src/features/location/AddAddressScreen.tsx',
    category: 'Location & Addresses',
    tokens: 'White Form Cards, Slate Borders (#E2E8F0), Label Chips (Home/Work/College)',
    components: 'House/Flat No Input, Street Address, Landmark Input, Address Type Selector Chips, Save CTA',
    content: 'Detailed address form persisting full delivery location details and recipient contact numbers.',
    state: 'Form validation (Pincode 6-digits check) -> Compute serviceability -> Save address to Firestore.',
    backend: 'Firestore users/{uid}/addresses collection add document.'
  },
  {
    file: '20_SAVED_ADDRESSES.md',
    number: '20',
    title: 'Saved Delivery Addresses Management Screen',
    route: 'app/(customer)/address/index.tsx | src/features/location/AddressListScreen.tsx',
    category: 'Location & Addresses',
    tokens: 'Surface Slate (#F8FAFC), Card Elevation 2, Active Blue Selection Border',
    components: 'Address Cards with Radio Select, Quick-Commerce Badge (if in Vijayawada zone), "Add New Address" CTA',
    content: 'List of all user saved delivery locations with quick-commerce serviceability status badges.',
    state: 'Set default address -> Delete address -> Select address for current cart checkout.',
    backend: 'Firestore real-time snapshot on users/{uid}/addresses.'
  },
  {
    file: '21_SERVICEABILITY_QUICK_COMMERCE.md',
    number: '21',
    title: 'Quick-Commerce Available Serviceability Result Screen',
    route: 'app/(customer)/location/serviceability.tsx | src/features/location/ServiceabilityResultScreen.tsx',
    category: 'Serviceability',
    tokens: 'Lightning Bolt Yellow (#F59E0B), Emerald Accent (#10B981), Dark Card',
    components: '30-60 Min Delivery Badge, Matched Dark Store Name, Available Instant Products Grid',
    content: 'Result screen displayed when user coordinate falls inside an active Vijayawada geofence polygon with active dark store stock.',
    state: 'PIP algorithm returns insidePolygon: true -> Enables quick-commerce delivery mode in app state.',
    backend: 'Point-in-Polygon check against Firestore deliveryZones collection.'
  },
  {
    file: '22_SERVICEABILITY_PAN_INDIA.md',
    number: '22',
    title: 'Pan-India Standard Delivery Serviceability Screen',
    route: 'src/features/location/PanIndiaServiceabilityScreen.tsx',
    category: 'Serviceability',
    tokens: 'Standard Blue Accent (#1E56B3), Courier Icon Badge, Neutral Surface',
    components: '3-7 Business Days Courier Badge, Delivery Fee Info (Free > ₹699), National Catalog CTA',
    content: 'Result screen shown when address is outside Vijayawada quick-commerce zones, routing seamlessly to standard e-commerce.',
    state: 'PIP algorithm returns outsidePolygon: true -> Routes checkout to standard warehouse dispatch.',
    backend: 'Firestore deliveryZones PIP fallback.'
  },

  // Category D: AI Face Scan & Skin Health Diagnostics
  {
    file: '23_SCAN_INTRO.md',
    number: '23',
    title: 'AI Face Scan Instructions & Consent Screen',
    route: 'app/(customer)/scan/intro.tsx | src/features/scan/ScanIntroScreen.tsx',
    category: 'AI Face Scan',
    tokens: 'Atmospheric Dark Gradient (#060D1E -> #1E56B3), Glassmorphic Guidance Cards',
    components: '3-Step Prep Graphic (Clean Face, Good Lighting, Center Face), "Start Face Scan" Primary CTA',
    content: 'Onboarding guide for AI diagnostic scan explaining optimal lighting conditions and privacy assurances.',
    state: 'Check camera permission -> Navigate to camera capture view.',
    backend: 'None (Local client guidance).'
  },
  {
    file: '24_CAMERA_CAPTURE.md',
    number: '24',
    title: 'Real-Time Camera Capture & Viewfinder Screen',
    route: 'app/(customer)/scan/camera.tsx | src/features/scan/CameraCaptureScreen.tsx',
    category: 'AI Face Scan',
    tokens: 'Camera Viewfinder Overlay, Neon Cyan Oval Framing Guide (#00F2FE), Shutter Button Glow',
    components: 'Expo Camera Viewfinder, Face Positioning Oval, Flash Toggle Button, Gallery Upload Alternative CTA, Capture Shutter Button',
    content: 'Live camera viewfinder displaying real-time framing oval guidance to ensure clear lighting and centered facial positioning.',
    state: 'Camera flash mode toggle -> Take picture -> Capture JPEG bytes -> Navigate to Preview.',
    backend: 'expo-camera SDK API.'
  },
  {
    file: '25_GALLERY_UPLOAD.md',
    number: '25',
    title: 'Gallery Image Selection Screen',
    route: 'src/features/scan/GalleryUploadScreen.tsx',
    category: 'AI Face Scan',
    tokens: 'Dark Theme Surface (#0F172A), Image Thumbnail Grid, Selected Checkmark',
    components: 'Photo Picker Grid, Image Quality Warning Note, "Use Selected Photo" CTA',
    content: 'Alternative input method allowing users to upload a clear face portrait from their device media gallery.',
    state: 'expo-image-picker invocation -> Read URI -> Validate dimensions -> Navigate to Preview.',
    backend: 'Native OS Image Picker API.'
  },
  {
    file: '26_IMAGE_PREVIEW.md',
    number: '26',
    title: 'Captured Image Preview & Audit Screen',
    route: 'src/features/scan/ImagePreviewScreen.tsx',
    category: 'AI Face Scan',
    tokens: 'Dark Frame Overlay, Retake Red (#EF4444), Confirm Green (#10B981)',
    components: 'Full Preview Crop View, "Retake Photo" Secondary Button, "Analyze Face Scan" Primary CTA Button',
    content: 'Review screen allowing user to inspect image clarity before initiating server-side PyTorch CNN inference.',
    state: 'Tap Retake -> Reopen camera; Tap Confirm -> Navigate to Scan Progress Analyzing Screen.',
    backend: 'None (Local image URI hold).'
  },
  {
    file: '27_SCAN_ANALYZING.md',
    number: '27',
    title: 'Scan Analysis Progress & Processing Screen',
    route: 'app/(customer)/scan/analyzing.tsx | src/features/scan/ScanProgressScreen.tsx',
    category: 'AI Face Scan',
    tokens: 'Atmospheric Dark Blue, Pulsing Radar Graphic, Glowing Cyan Metrics Text',
    components: 'Scanning Radar Animation, Diagnostic Step Checklist ("Evaluating Acne Severity...", "Calculating Hydration %..."), Progress Bar',
    content: 'Engaging progress screen displaying real-time status steps while PyTorch CNN inference model processes facial image.',
    state: 'Multipart file upload to FastAPI /api/v1/scan/analyze -> Poll or await JSON payload -> Save to Firestore -> Navigate to Report.',
    backend: 'FastAPI /api/v1/scan/analyze (PyTorch CNN Model on Port 10000).'
  },
  {
    file: '28_SCAN_FAILED.md',
    number: '28',
    title: 'Scan Failure & Quality Warning Screen',
    route: 'app/(customer)/scan/failed.tsx | src/features/scan/ScanFailedScreen.tsx',
    category: 'AI Face Scan',
    tokens: 'Warning Amber (#F59E0B), Dark Card Surface (#0F172A), Action White',
    components: 'Warning Illustration, Failure Reason Card (e.g. "Low Lighting Detected", "Face Covered"), "Retry Face Scan" CTA Button',
    content: 'Authentic error response screen presented if image is obstructed, excessively blurry, or poorly lit.',
    state: 'Displays specific diagnostic feedback without crashing -> Reset capture state on retry.',
    backend: 'FastAPI error metadata.'
  },
  {
    file: '29_SKIN_REPORT_OVERVIEW.md',
    number: '29',
    title: 'Overall Skin Diagnostic Report Screen',
    route: 'app/(customer)/scan/report.tsx | src/features/scan/SkinReportScreen.tsx',
    category: 'Diagnostics & Reports',
    tokens: 'Dark Theme (#060D1E), Score Circle Pulse (#00F2FE), Metric Progress Bars',
    components: 'Overall Skin Score Dial (0-100), Skin Type Badge (COMBINATION/OILY/DRY), Primary Concerns List, Metric Breakdowns, "View Recommended Routine" CTA',
    content: 'Comprehensive skin health summary displaying scores for acne, hydration, texture, pigmentation, sebum, and sensitivity.',
    state: 'Loads scan report document from Firestore -> Share report -> Save report to profile.',
    backend: 'Firestore users/{uid}/scanHistory/{scanId} document subscription.'
  },
  {
    file: '30_ACNE_DIAGNOSTIC_DETAIL.md',
    number: '30',
    title: 'Acne Severity Diagnostic Detail Screen',
    route: 'src/features/scan/AcneDiagnosticDetailScreen.tsx',
    category: 'Diagnostics & Reports',
    tokens: 'Clinical Card White, Severity Color Scale (Green/Yellow/Red), Informational Callouts',
    components: 'Acne Severity Meter (Mild/Moderate/Severe), Follicular Congestion Notes, Recommended Active Actives (Salicylic Acid / Niacinamide)',
    content: 'In-depth breakdown of acne lesions, comedones, and recommended OTC active formulations.',
    state: 'Displays specific CNN acne class classification output (Class 0–3).',
    backend: 'FastAPI raw CNN output inspection.'
  },
  {
    file: '31_HYDRATION_SEBUM_DETAIL.md',
    number: '31',
    title: 'Hydration & Sebum Balance Metric Screen',
    route: 'src/features/scan/HydrationSebumDetailScreen.tsx',
    category: 'Diagnostics & Reports',
    tokens: 'Water Cyan (#00F2FE), Oil Balance Gold (#F59E0B), Metric Gauges',
    components: 'Cellular Hydration % Radial Gauge, Stratum Corneum TEWL Status, T-Zone Lipid Meter, Recommended Moisture Formulations',
    content: 'Detailed explanation of trans-epidermal water loss and T-zone lipid balance with ceramide moisture recommendations.',
    state: 'Interactive metric sliders.',
    backend: 'Biometric score mapping.'
  },
  {
    file: '32_PIGMENTATION_TEXTURE_DETAIL.md',
    number: '32',
    title: 'Hyperpigmentation & Texture Topography Screen',
    route: 'src/features/scan/PigmentationTextureDetailScreen.tsx',
    category: 'Diagnostics & Reports',
    tokens: 'Melanin Bronze (#D97706), Smooth Texture Purple (#8B5CF6), Surface Cards',
    components: 'Pigmentation Index Score, UV Spots & PIH Marks Breakdown, Pore Topography Score, Alpha Arbutin & Kojic Acid Actives Advice',
    content: 'Explains melanin clustering, sun spots, and surface pore micro-roughness with clinical active suggestions.',
    state: 'Detailed metric expanders.',
    backend: 'Biometric vector payload.'
  },

  // Category E: AI Skincare Consultant & Recommendations
  {
    file: '33_RECOMMENDATION_OVERVIEW.md',
    number: '33',
    title: 'Personalized Skincare Recommendations Screen',
    route: 'app/(customer)/recommendations/index.tsx | src/features/recommendations/RecommendationsScreen.tsx',
    category: 'Recommendations',
    tokens: 'Dark Atmospheric Surface (#060D1E), Product Cards with Beauty Badges, Cyan Accents',
    components: 'Diagnostic Summary Banner, Recommended Routine Products Carousel, Active Ingredients Chips, "Add Entire Routine to Cart" CTA',
    content: 'Dynamic product matching matching diagnostic scores to certified Indian formulations (Minimalist, Derma Co, etc.).',
    state: 'Single product add to cart vs batch routine add to cart -> Calculates bundle discount.',
    backend: 'Firestore products query matched to targetedConcerns.'
  },
  {
    file: '34_AM_PM_ROUTINE_PRESCRIBER.md',
    number: '34',
    title: 'AM / PM Clinical Routine Prescriber Screen',
    route: 'src/features/recommendations/RoutinePrescriberScreen.tsx',
    category: 'Recommendations',
    tokens: 'Sun Yellow (AM #F59E0B) vs Moon Indigo (PM #6366F1), Step Timeline Cards',
    components: 'AM Step Timeline (Cleanser -> Active Serum -> Moisturizer -> SPF 50), PM Step Timeline (Cleanser -> Treatment -> Barrier Repair), Layering Order Guide',
    content: 'Step-by-step skincare routine builder showing correct order of application from thinnest to thickest consistency.',
    state: 'Toggle between Morning and Evening tabs.',
    backend: 'AI Consultant routine matcher tool.'
  },
  {
    file: '35_INGREDIENT_CONTRAINDICATION_AUDIT.md',
    number: '35',
    title: 'Active Ingredient Layering Safety Screen',
    route: 'src/features/recommendations/IngredientAuditScreen.tsx',
    category: 'Recommendations & Safety',
    tokens: 'Safety Check Green (#10B981) & Warning Yellow (#F59E0B), Clinical Cards',
    components: 'Layering Compatibility Matrix, Active pH Level Comparison, Chemical Clash Warnings (e.g. Retinol + BHA Warning), Staggering Advice',
    content: 'Safety audit verifying that selected active serums do not cause barrier irritation or chemical incompatibility.',
    state: 'Executes verify_ingredient_contraindications tool on backend.',
    backend: 'FastAPI /api/v1/agent/tool/execute tool payload.'
  },
  {
    file: '36_AI_DERMATOLOGIST_CHAT.md',
    number: '36',
    title: 'Autonomous AI Clinical Dermatologist Workspace Screen',
    route: 'src/features/recommendations/AiDermatologistChatScreen.tsx',
    category: 'AI Chat & Consultation',
    tokens: 'Dark Chat Interface, Doctor Badge, Markdown Formatting Support, Message Bubbles',
    components: 'Chat History Stream, User Input Text Field, Voice Note Button, Clinical Tool Call Badges, 1-Click Routine Checkout Button',
    content: 'Multi-turn ReAct agent workspace synthesizing clinical advice, biometric scores, and express delivery availability.',
    state: 'Submits user query to FastAPI /api/v1/agent/consult -> Streams markdown reply & tool observations.',
    backend: 'FastAPI /api/v1/agent/consult endpoint.'
  },
  {
    file: '37_PATCH_TEST_GUIDE.md',
    number: '37',
    title: 'Clinical Patch Test Guide & Instructions Screen',
    route: 'src/features/recommendations/PatchTestGuideScreen.tsx',
    category: 'Safety & Education',
    tokens: 'Clean Paper Theme, Medical Blue Accent (#1A73E8), Step Cards',
    components: 'Body Diagram (Behind Ear / Inner Arm), 24-Hour Timeline Graphic, Reaction Warning Signs Checklist',
    content: 'Educational guide instructing users how to perform a 24-hour patch test before applying potent clinical actives.',
    state: 'Mark patch test done.',
    backend: 'None (Client educational documentation).'
  },
  {
    file: '38_ROUTINE_ONE_CLICK_CHECKOUT.md',
    number: '38',
    title: '1-Click Express Routine Checkout Screen',
    route: 'src/features/recommendations/ExpressRoutineCheckoutScreen.tsx',
    category: 'Checkout & Quick-Commerce',
    tokens: 'Lightning Yellow Accent (#F59E0B), Emerald Discount Badge (#10B981), Order Summary Card',
    components: 'Routine Items Summary, Instant Drop Bundle Discount Badge (FLAT ₹100 OFF), Express ETA Notice (15-30 Mins), "Swipe to Order" Slider',
    content: 'DoorDash/Instamart style 1-click checkout for AI prescribed skincare routines.',
    state: 'Swipe to confirm -> Creates instant Cashfree PG payment session.',
    backend: 'Express Backend /api/orders/create.'
  },

  // Category F: E-Commerce & Quick-Commerce Catalogue
  {
    file: '39_HOME_CUSTOMER.md',
    number: '39',
    title: 'Customer Main Home Hub Screen',
    route: 'app/(customer)/(tabs)/index.tsx | src/features/shop/HomeScreen.tsx',
    category: 'Home & Navigation',
    tokens: 'Dark Atmospheric Surface (#060D1E), Linear Gradients, Carousel Elevation',
    components: 'Header with Address Selector & Cart Badge, Quick-Commerce Availability Banner, "Start AI Face Scan" Hero Card, Recommended Products Grid, Shop by Concern Chips',
    content: 'Central customer dashboard displaying current delivery serviceability status, face scan shortcut, and personalized skincare catalog.',
    state: 'Pull-to-refresh -> Syncs cart badge count -> Updates local dark store status.',
    backend: 'Firestore products & deliveryZones snapshot.'
  },
  {
    file: '40_PRODUCT_CATALOG.md',
    number: '40',
    title: 'All Products Catalog & Grid Screen',
    route: 'app/(customer)/(tabs)/shop.tsx | src/features/shop/ProductListScreen.tsx',
    category: 'Shop & Catalogue',
    tokens: 'Surface Dark Gray (#0F172A), Product Card Tiles, Beauty Protection Badges',
    components: 'Category Selector Bar (Serums, Cleansers, Sunscreen, Moisturizers), Product Tiles with MRP & Discounted Price, Beauty Protection Eligibility Badge, Add to Cart Button',
    content: 'Full e-commerce catalogue grid supporting concern filtering, quick-commerce badges, and direct cart additions.',
    state: 'Filter by category -> Sort by price/rating -> Infinite scroll pagination.',
    backend: 'Firestore products collection query.'
  },
  {
    file: '41_SEARCH_AND_FILTERS.md',
    number: '41',
    title: 'Instant Search & Advanced Filter Screen',
    route: 'src/features/shop/SearchAndFiltersScreen.tsx',
    category: 'Shop & Catalogue',
    tokens: 'Dark Sheet Overlay, Search Input Glow, Filter Pill Chips',
    components: 'Search Input Field with Clear Button, Filter Options (Skin Type, Active Ingredients, Brand, Delivery Tier, Price Range Slider), Clear All & Apply Buttons',
    content: 'Instant SKU search with multi-variable filters matching products to user skin needs.',
    state: 'Debounced search query (300ms) -> Filter array state -> Dynamic result count display.',
    backend: 'Firestore composite index query.'
  },
  {
    file: '42_PRODUCT_DETAILS.md',
    number: '42',
    title: 'Product Details & Specs Screen',
    route: 'app/(customer)/product/[id].tsx | src/features/shop/ProductDetailsScreen.tsx',
    category: 'Shop & Catalogue',
    tokens: 'Clean Image Carousel Surface, Dark Details Card, Beauty Protection Teal Badge',
    components: 'Image Gallery Carousel with Dots, Product Title & Brand, MRP vs Discount Price Badge, Beauty Protection Opt-In Checkbox, Suitable Skin Types Chips, How To Use Accordion, Add to Cart Sticky Footer',
    content: 'Comprehensive product detail page featuring high-res imagery, active percentages, and optional Beauty Protection warranty toggle.',
    state: 'Fetch product by ID -> Toggle Beauty Protection -> Update cart store.',
    backend: 'Firestore products/{productId} document subscription.'
  },
  {
    file: '43_INGREDIENTS_TRANSPARENCY.md',
    number: '43',
    title: 'Ingredient Transparency & pH Levels Screen',
    route: 'src/features/shop/IngredientTransparencyScreen.tsx',
    category: 'Shop & Education',
    tokens: 'Clinical Paper White, Chemical Formula Badges, Dark Text',
    components: 'Full INCI Ingredient List, Key Actives Highlight Cards, Formulation pH Level Gauge (e.g. pH 5.5), Fragrance-Free / Silicone-Free Badges',
    content: 'Deep scientific breakdown of product formulations ensuring total ingredient transparency.',
    state: 'Expand ingredient definitions.',
    backend: 'Firestore product document ingredients array.'
  },
  {
    file: '44_QUICK_COMMERCE_EXPRESS_STORE.md',
    number: '44',
    title: 'Vijayawada Express Quick-Store Catalogue Screen',
    route: 'src/features/shop/ExpressStoreScreen.tsx',
    category: 'Quick Commerce',
    tokens: 'Lightning Gold Accent (#F59E0B), Express Delivery Badge, Inventory Stock Counters',
    components: 'Dark Store Location Header ("Darkstore Payikapuram DS-VIJ-01"), Live ETA Countdown ("Delivery in 22 Mins"), In-Stock Local Inventory Grid, Fast Add Buttons',
    content: 'Dedicated quick-commerce store view displaying items stocked directly inside the user matched local dark store hub.',
    state: 'Sub-5ms stock availability check from Redis inventory cache.',
    backend: 'Express Backend /api/stores/nearby and /api/inventory/check.'
  },
  {
    file: '45_WISHLIST.md',
    number: '45',
    title: 'User Wishlist & Saved Products Screen',
    route: 'src/features/shop/WishlistScreen.tsx',
    category: 'Shop & Catalogue',
    tokens: 'Dark Theme Surface (#0F172A), Heart Icon Accent (#EF4444), Grid Layout',
    components: 'Saved Product Cards, Move to Cart CTA Button, Remove Item Icon, Empty Wishlist Illustration',
    content: 'Saved favorites screen allowing users to bookmark skincare products for future purchase.',
    state: 'Add/Remove wishlist item -> Sync with user document.',
    backend: 'Firestore users/{uid}/wishlist array.'
  },
  {
    file: '46_BRAND_STORE_PAGE.md',
    number: '46',
    title: 'Brand Showcase & Official Store Screen',
    route: 'src/features/shop/BrandStoreScreen.tsx',
    category: 'Shop & Catalogue',
    tokens: 'Brand Customized Color Banners, Product Grid, Verified Partner Shield',
    components: 'Brand Cover Hero Banner (Minimalist / Derma Co / Dot & Key), Brand Vision Paragraph, Verified Partner Authenticity Shield, Product Grid',
    content: 'Dedicated brand store page guaranteeing 100% authentic direct-from-manufacturer skincare products.',
    state: 'Filter by brand ID.',
    backend: 'Firestore products query where brand == brandId.'
  },
  {
    file: '47_PRODUCT_REVIEWS.md',
    number: '47',
    title: 'Customer Product Reviews & Ratings Screen',
    route: 'src/features/shop/ProductReviewsScreen.tsx',
    category: 'Shop & Community',
    tokens: 'Star Rating Gold (#F59E0B), Verified Buyer Badge Green, Review Cards',
    components: 'Average Rating Dial (e.g. 4.8 / 5), Rating Distribution Bars, Customer Photo Reviews Gallery, User Review Cards with Skin Type Tags',
    content: 'Community review hub featuring verified buyer ratings, skin type tags (e.g., "Reviewed by Oily Skin User"), and photo evidence.',
    state: 'Sort by newest / highest rating -> Write review modal.',
    backend: 'Firestore products/{id}/reviews subcollection.'
  },
  {
    file: '48_OUT_OF_STOCK_NOTIFY.md',
    number: '48',
    title: 'Out of Stock Notification Request Modal Screen',
    route: 'src/components/modals/OutOfStockNotifyModal.tsx',
    category: 'Shop & Inventory',
    tokens: 'Dark Sheet Overlay, Bell Icon Accent, Email/SMS Input',
    components: 'Out of Stock Illustration, Product Title, Phone/Email Input Field, "Notify Me When Back in Stock" CTA Button',
    content: 'Modal prompt allowing users to subscribe to back-in-stock SMS/push alerts for out-of-stock SKUs.',
    state: 'Saves alert subscription.',
    backend: 'Firestore stockAlerts collection.'
  },

  // Category G: Cart, Checkout & Cashfree PG
  {
    file: '49_CART_VIEW.md',
    number: '49',
    title: 'Shopping Cart Screen',
    route: 'app/(customer)/(tabs)/cart.tsx | src/features/cart/CartScreen.tsx',
    category: 'Cart & Checkout',
    tokens: 'Dark Surface (#060D1E), Card Borders (#1E293B), Accent Blue Buttons',
    components: 'Cart Items List, Quantity Stepper (+/-), Item Price & Savings Badge, Delivery Mode Badge (Quick Commerce vs Standard), Bill Details Summary, "Proceed to Checkout" Sticky Footer',
    content: 'Main shopping cart managing item quantities, price totals, and delivery tier resolution.',
    state: 'Atomic quantity update -> Item removal confirmation -> Dynamic subtotal calculation.',
    backend: 'Firestore users/{uid}/cart collection.'
  },
  {
    file: '50_BEAUTY_PROTECTION_OPTIN.md',
    number: '50',
    title: 'Beauty Protection Warranty Opt-In Component & Screen',
    route: 'src/features/cart/BeautyProtectionOptInScreen.tsx',
    category: 'Cart & Warranty',
    tokens: 'Teal Shield Gradient (#0D9488 -> #14B8A6), Shield Icon, Glassmorphic Card',
    components: 'Beauty Protection Card, Opt-In Checkbox ("Add Protection for ₹39"), Coverage Explanation Bullet Points (Allergy, Damage, Authenticity), Guarantee T&C Link',
    content: 'Opt-in warranty checkbox allowing users to protect eligible skincare formulations against adverse reactions or transit leaks.',
    state: 'Checkbox state toggle -> Updates cart beautyProtectionTotal.',
    backend: 'Firestore beautyProtectionRules query.'
  },
  {
    file: '51_COUPON_COIN_REDEMPTION.md',
    number: '51',
    title: 'Coupon Code & GlowVAI Coins Redemption Screen',
    route: 'src/features/cart/CouponCoinRedemptionScreen.tsx',
    category: 'Cart & Discounts',
    tokens: 'Gold Coin Accent (#F59E0B), Coupon Ticket Surface, Apply Button Accent',
    components: 'Coupon Code Text Input with Apply Button, Available Coupons List, GlowVAI Referral Coin Balance Card, Coin Redemption Slider (Max 20% Subtotal), Applied Savings Summary',
    content: 'Discount management screen enabling promo code entry and GlowVAI referral coin redemption.',
    state: 'Validate promo code string -> Calculate max allowable coin discount -> Apply discount to cart.',
    backend: 'Cloud Function coupon validation.'
  },
  {
    file: '52_CHECKOUT_REVIEW.md',
    number: '52',
    title: 'Checkout Order Summary & Review Screen',
    route: 'app/(customer)/checkout/index.tsx | src/features/cart/CheckoutScreen.tsx',
    category: 'Checkout',
    tokens: 'Clean Paper / Dark Mode, Section Dividers, Sticky Payment Footer',
    components: 'Delivery Address Card with Edit Link, Delivery Time Estimate ("Express 25 Mins"), Items Summary, Complete Price Breakdown (Subtotal + Delivery + Protection - Coins = Grand Total), "Select Payment Method" CTA',
    content: 'Final review screen presenting itemized pricing, delivery address, and estimated delivery timeline before launching payment.',
    state: 'Validates delivery address & item stock -> Invokes backend order session creator.',
    backend: 'Express Backend /api/orders/create.'
  },
  {
    file: '53_PAYMENT_METHOD_SELECT.md',
    number: '53',
    title: 'Payment Method Selection Screen',
    route: 'src/features/cart/PaymentMethodSelectScreen.tsx',
    category: 'Payments',
    tokens: 'White / Dark Card Tiles, UPI Logo Badges (GPay, PhonePe, Paytm), Security Shield',
    components: 'UPI Intent Radio Options (GPay, PhonePe, Paytm, BHIM), Credit/Debit Card Input Option, Net Banking Selector, Cash on Delivery (COD) Option, "Pay ₹799" Primary CTA',
    content: 'Payment gateway selector supporting direct UPI Intent, credit/debit card, net banking, and COD.',
    state: 'Select payment mode -> Launch Cashfree PG Native SDK session.',
    backend: 'Express Backend /api/orders/create Cashfree payment_session_id.'
  },
  {
    file: '54_CASHFREE_PAYMENT_PROCESSING.md',
    number: '54',
    title: 'Cashfree PG Payment Processing Modal Screen',
    route: 'src/features/cart/CashfreeProcessingScreen.tsx',
    category: 'Payments',
    tokens: 'Dark Overlay, Centered Loading Spinner, Cashfree Security Watermark',
    components: 'Bank Processing Spinner, "Do Not Close App or Press Back" Security Notice, Cashfree Logo, Lock Icon',
    content: 'Native Cashfree payment gateway modal displaying transaction state during bank authentication.',
    state: 'Awaits Cashfree SDK callback -> Triggers backend payment verification.',
    backend: 'Express Backend /api/orders/verify.'
  },
  {
    file: '55_PAYMENT_SUCCESS.md',
    number: '55',
    title: 'Payment Success & Order Confirmed Screen',
    route: 'app/(customer)/checkout/success.tsx | src/features/cart/PaymentSuccessScreen.tsx',
    category: 'Checkout Success',
    tokens: 'Emerald Green Accent (#10B981), Confetti Lottie Animation, Dark Card',
    components: 'Success Checkmark Animation, Order ID Badge ("#ORD-991823"), Estimated Delivery Time Clock ("Delivering by 6:45 PM"), View Order Details CTA, Back to Home Link',
    content: 'Order confirmation screen celebrating successful payment with live delivery countdown and invoice link.',
    state: 'Clears shopping cart -> Subscribes to order tracking listener.',
    backend: 'Firestore orders/{orderId} initial state CONFIRMED.'
  },
  {
    file: '56_PAYMENT_FAILED.md',
    number: '56',
    title: 'Payment Failure & Retry Screen',
    route: 'app/(customer)/checkout/failed.tsx | src/features/cart/PaymentFailedScreen.tsx',
    category: 'Checkout Failure',
    tokens: 'Alert Red (#EF4444), Dark Card Surface, Action White Buttons',
    components: 'Payment Error Icon, Failure Reason Details (e.g. "Bank Server Timed Out"), "Retry Payment" Primary Button, "Change Payment Method" Secondary Button',
    content: 'Error resolution screen allowing user to retry failed transaction or select an alternative payment method without losing cart items.',
    state: 'Preserves cart state -> Re-initiates checkout session on retry.',
    backend: 'Cashfree transaction error code mapper.'
  },

  // Category H: Order Lifecycle, Dispatch & Real-Time Tracking
  {
    file: '57_ORDERS_LIST.md',
    number: '57',
    title: 'Orders History & Active Orders Screen',
    route: 'app/(customer)/(tabs)/orders.tsx | src/features/orders/OrdersListScreen.tsx',
    category: 'Order Tracking',
    tokens: 'Dark Theme Surface (#060D1E), Active Status Pulsing Badge, Card Borders',
    components: 'Tab Toggle (Active Orders vs Past Orders), Order Summary Cards with Status Badges (PLACED/PACKED/OUT_FOR_DELIVERY/DELIVERED), "Track Order" CTA, "Reorder" Button',
    content: 'Customer order management screen displaying active delivery cards and past order history.',
    state: 'Real-time Firestore snapshot listener on orders where userId == uid.',
    backend: 'Firestore orders collection query with composite index.'
  },
  {
    file: '58_ORDER_DETAILS.md',
    number: '58',
    title: 'Order Details & Receipt Screen',
    route: 'src/features/orders/OrderDetailsScreen.tsx',
    category: 'Order Tracking',
    tokens: 'Clean Invoice White / Dark, Timeline Nodes, Price Table',
    components: 'Order Status Timeline (Placed -> Confirmed -> Packed -> Out for Delivery -> Delivered), Shipping Address Card, Purchased Items List, Download Invoice Button, "File Beauty Protection Claim" Link',
    content: 'Comprehensive order invoice and status timeline document showing rider details and invoice PDF export.',
    state: 'Subscribe to single order document in Firestore.',
    backend: 'Firestore orders/{orderId} document subscription.'
  },
  {
    file: '59_LIVE_RIDER_TRACKING.md',
    number: '59',
    title: 'Real-Time Rider GPS Map Tracking Screen',
    route: 'src/features/orders/LiveRiderTrackingScreen.tsx',
    category: 'Order Tracking & Delivery',
    tokens: 'Google Maps Dark Theme, Rider EV Icon Marker, Cyan Polyline Route',
    components: 'Interactive React Native Maps View, Moving Rider EV Marker, Darkstore Dispatch Pin, User House Pin, Bottom Rider Card (Name, Phone Call Button, ETA Countdown)',
    content: 'Live delivery tracking map showing real-time GPS coordinates of assigned delivery rider en route to customer doorstep.',
    state: 'Listens to riderTelemetry updates in Firestore or WebSocket -> Decodes driving polyline.',
    backend: 'Firestore orders/{orderId}/tracking snapshot.'
  },
  {
    file: '60_DELIVERY_OTP_CONFIRMATION.md',
    number: '60',
    title: 'Handshake Delivery OTP Display Screen',
    route: 'src/features/orders/DeliveryOtpScreen.tsx',
    category: 'Order Delivery Handshake',
    tokens: 'Dark Theme, Glowing OTP Box (#00F2FE), Security Shield Graphic',
    components: '4-Digit Delivery OTP Display ("OTP: 4892"), Security Instructions Card ("Share OTP with rider upon package handoff")',
    content: 'Displays secure 4-digit OTP required by delivery rider to verify package handoff and mark order as DELIVERED.',
    state: 'Rider verifies OTP on vendor app -> Order status transitions to DELIVERED.',
    backend: 'Firestore orders/{orderId}.deliveryOtp.'
  },
  {
    file: '61_ORDER_CANCEL.md',
    number: '61',
    title: 'Order Cancellation Request Screen',
    route: 'src/features/orders/OrderCancelScreen.tsx',
    category: 'Order Management',
    tokens: 'Dark Sheet Overlay, Reason Checkboxes, Red Cancel Button',
    components: 'Cancellation Reason Radio List ("Placed by mistake", "ETA too long", "Changed mind"), Refund Details Note, "Confirm Cancellation" CTA',
    content: 'Allows customer to cancel active order before vendor dark store packs items (within SLA window).',
    state: 'Check order status -> If PLACED/CONFIRMED -> Initiate cancellation & automated refund.',
    backend: 'Cloud Function cancelOrder endpoint.'
  },
  {
    file: '62_RATE_ORDER_DELIVERY.md',
    number: '62',
    title: 'Order Delivery & Product Rating Modal Screen',
    route: 'src/features/orders/RateOrderModal.tsx',
    category: 'Order Feedback',
    tokens: 'Dark Sheet Overlay, Star Rating Bar (#F59E0B), Tag Chips',
    components: 'Rider Rating Stars (1-5), Delivery Speed Feedback Tags, Product Quality Stars, Written Feedback Textarea, Submit Rating CTA',
    content: 'Post-delivery feedback prompt allowing customers to rate rider speed and skincare product satisfaction.',
    state: 'Save review to Firestore -> Prompt user to share referral link.',
    backend: 'Firestore orders/{id}/ratings subcollection.'
  },

  // Category I: Beauty Protection Claims & Referrals
  {
    file: '63_BEAUTY_PROTECTION_CLAIM_FORM.md',
    number: '63',
    title: 'File Beauty Protection Claim Form Screen',
    route: 'src/features/orders/BeautyProtectionClaimFormScreen.tsx',
    category: 'Beauty Protection Warranty',
    tokens: 'Teal Warranty Accent (#0D9488), Dark Form Surface, Photo Upload Cards',
    components: 'Reason Selector (Adverse Reaction / Transit Damage / Seal Tampered), Photo Evidence Upload Grid (Up to 3 photos), Clinical Symptoms Textarea, Batch Number Input, "Submit Claim" CTA',
    content: 'Claims submission portal allowing users to upload photo proof of adverse reactions or damaged bottles under Beauty Protection warranty.',
    state: 'Upload photos to Firebase Storage -> Create beautyProtectionClaims document in Firestore.',
    backend: 'Firebase Storage claims/ & Firestore beautyProtectionClaims collection.'
  },
  {
    file: '64_CLAIM_STATUS_TRACKER.md',
    number: '64',
    title: 'Beauty Protection Claim Review Tracker Screen',
    route: 'src/features/orders/ClaimStatusTrackerScreen.tsx',
    category: 'Beauty Protection Warranty',
    tokens: 'Status Colors: Blue (Submitted), Amber (Under Review), Green (Approved/Refunded), Red (Rejected)',
    components: 'Claim ID Badge, Status Timeline, Admin/Dermatologist Review Notes Card, Refund Amount / Wallet Voucher Display',
    content: 'Tracks live audit status of filed Beauty Protection claims by GlowVAI dermatology operations team.',
    state: 'Subscribe to beautyProtectionClaims/{claimId} in Firestore.',
    backend: 'Firestore beautyProtectionClaims document listener.'
  },
  {
    file: '65_REFERRAL_HUB.md',
    number: '65',
    title: 'Student Referral Hub & Coin Wallet Screen',
    route: 'app/(customer)/referrals/index.tsx | src/features/referrals/ReferralsScreen.tsx',
    category: 'Student Referrals',
    tokens: 'Gold Coin Accent (#F59E0B), Deep Purple/Blue Gradient (#4F46E5 -> #060D1E), Card Elevation',
    components: 'Referral Coin Balance Dial (e.g. 450 Coins = ₹450), Personal Referral Code Card with Copy Link Button, WhatsApp Share Action Button, How It Works 3-Step Card, Invite Friends CTA',
    content: 'Central referral management hub allowing verified college students to share referral codes and view coin balances.',
    state: 'Copy link to clipboard -> Trigger native OS share sheet.',
    backend: 'Firestore users/{uid}.referralCode and referralCoinBalance.'
  },
  {
    file: '66_REFERRAL_TRANSACTIONS.md',
    number: '66',
    title: 'Referral Coin Transactions Ledger Screen',
    route: 'src/features/referrals/ReferralTransactionsScreen.tsx',
    category: 'Student Referrals',
    tokens: 'Dark Theme Surface (#0F172A), Coin Credit Green (+50), Coin Debit Red (-100)',
    components: 'Transaction History List, Referee Details ("Rajesh K. completed order"), Coin Status (CREDITED / HOLDING_7_DAYS / EXPIRED), Expiration Notice',
    content: 'Detailed ledger listing all earned referral coins, pending 7-day holding periods, and redeemed store discounts.',
    state: 'Fetch user coinTransactions subcollection.',
    backend: 'Firestore users/{uid}/coinTransactions subcollection query.'
  },

  // Category J: Profile, Settings, Support & Admin
  {
    file: '67_PROFILE_OVERVIEW.md',
    number: '67',
    title: 'Customer Profile & Settings Overview Screen',
    route: 'app/(customer)/(tabs)/profile.tsx | src/features/auth/ProfileScreen.tsx',
    category: 'Profile & Settings',
    tokens: 'Dark Theme Surface (#060D1E), Rounded Menu Rows, Chevron Icons',
    components: 'User Header Avatar & Name, Student Verified Badge, Menu Items (Saved Addresses, Skin Scan History, Referral Wallet, Privacy Controls, Terms & Policies, Help & Support), "Logout" Button',
    content: 'Main profile dashboard providing access to saved addresses, previous diagnostic scan history, privacy controls, and account settings.',
    state: 'Confirm logout modal -> Signs out Firebase Auth session.',
    backend: 'Firebase Auth signOut call.'
  },
  {
    file: '68_HELP_AND_SUPPORT.md',
    number: '68',
    title: 'Customer Help, FAQ & Support Tickets Screen',
    route: 'app/(customer)/support/index.tsx | src/features/support/SupportScreen.tsx',
    category: 'Customer Support',
    tokens: 'Clean Accordion Surface, WhatsApp Green (#25D366), Action Cards',
    components: 'FAQ Accordion List (Orders, Quick-Commerce, Beauty Protection, Referrals), Direct WhatsApp Chat Button, "Create Support Ticket" Form Button, Active Tickets Status List',
    content: 'Support center enabling instant FAQ resolution, direct WhatsApp coordination with operations, or ticket creation.',
    state: 'Deep link to WhatsApp with order context -> Create support ticket document.',
    backend: 'Firestore supportTickets collection & WhatsApp Deep Link generator.'
  },
  {
    file: '69_ADMIN_DARKSTORE_OPERATIONS.md',
    number: '69',
    title: 'Web Admin Dark Store & Order Dispatch Dashboard Screen',
    route: 'admin/darkstore-dashboard.tsx | src/features/admin/DarkStoreDashboard.tsx',
    category: 'Admin Operations',
    tokens: 'Web Operations Grid, Alert Badges, SLA Countdown Timer',
    components: 'Live Orders Queue Table, 90s Pick SLA Countdown Timer, Staging Bay Assign Picker, Dark Store Inventory Stock Manager, Rider Dispatch Trigger',
    content: 'Backoffice web administration portal for dark store operators managing Vijayawada quick-commerce picking, packing, and rider dispatch.',
    state: 'Updates order status to PACKED / OUT_FOR_DELIVERY -> Trigger WhatsApp notification.',
    backend: 'Firestore orders & vendors collections admin access.'
  },
  {
    file: '70_ADMIN_CLAIMS_PORTAL.md',
    number: '70',
    title: 'Web Admin Beauty Protection Claims Review Dashboard Screen',
    route: 'admin/claims-dashboard.tsx | src/features/admin/ClaimsDashboard.tsx',
    category: 'Admin Operations',
    tokens: 'Clinical Admin Interface, Photo Evidence Lightbox, Approve Green / Reject Red Buttons',
    components: 'Claims Review Queue, Photo Evidence Lightbox Viewer, User Skin Diagnostic History Snapshot, Approve Claim Button, Reject Claim Button with Reason Notes',
    content: 'Administrative dashboard for dermatology operations team reviewing submitted Beauty Protection claims and approving automated refunds.',
    state: 'Approve claim -> Updates status to APPROVED -> Triggers automated gateway refund.',
    backend: 'Firestore beautyProtectionClaims collection update.'
  }
];

screens.forEach((screen) => {
  const filePath = path.join(screensDir, screen.file);
  const markdownContent = `# Screen ${screen.number}: ${screen.title}

## 1. Executive Summary & Overview
**${screen.title}** is an essential screen within the **${screen.category}** module of the **GlowVAI V2** application.

- **Screen Title**: ${screen.title}
- **Route / File Path**: \`${screen.route}\`
- **Domain Category**: ${screen.category}
- **Target OS / Framework**: Android / React Native (Expo Router)

---

## 2. Layout & UI Design System Specifications

- **Color Palette & Tokens**: ${screen.tokens}
- **Core Components Used**: \`${screen.components}\`
- **Typography Standards**: Google Font \`Syne\` (\`Syne_700Bold\`) for primary headers, \`Inter\` for body and form fields.
- **Visual Description**: ${screen.content}

---

## 3. Screen Structure & Visual Components

\`\`\`
┌─────────────────────────────────────────────────────────┐
│                    HEADER / NAV BAR                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                   MAIN CONTENT AREA                     │
│                                                         │
│  - ${screen.content}
│                                                         │
├─────────────────────────────────────────────────────────┤
│                 PRIMARY ACTION FOOTER                   │
└─────────────────────────────────────────────────────────┘
\`\`\`

### Detailed Content Breakdown:
1. **Header Section**: Displays domain status, back navigation control, or active location context.
2. **Main Viewport**: Renders \`${screen.components}\`.
3. **Action Area**: Contextual primary action CTA or state feedback indicator.

---

## 4. User Interaction & State Machine

- **Default / Success State**: ${screen.state}
- **Loading State**: Displays atomic \`LoadingState\` spinner or skeleton shimmer card.
- **Error Handling**: Graceful fallback using \`ErrorState\` with retry options.
- **Offline Mode**: Renders cached offline banner when network drops out.

---

## 5. Backend, Firebase & API Integration

- **Firebase / Database Hook**: \`${screen.backend}\`
- **Data Collections Referenced**: \`users\`, \`products\`, \`orders\`, \`deliveryZones\`, \`beautyProtectionClaims\` (where applicable).
- **Security & Privacy**: Adheres strictly to GlowVAI zero-secrets policy and DPDP Act 2023 compliance.
`;

  fs.writeFileSync(filePath, markdownContent, 'utf8');
  console.log(`✅ Created documentation for Screen ${screen.number}: ${screen.file}`);
});

console.log(`\n🎉 Successfully generated all 70 screen documentation markdown files in ${screensDir}!`);
