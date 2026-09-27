import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
  ScrollView,
  Platform,
  useWindowDimensions,
  Linking,
  Alert,
} from 'react-native';
import {
  ArrowLeft,
  Sparkles,
  Phone,
  MessageSquare,
  Share2,
  Navigation,
  Compass,
  Star,
  CheckCircle2,
  Clock,
  MapPin,
  Store,
  Home,
  ShieldCheck,
  Truck,
  ChevronRight,
  Maximize2,
  RefreshCw,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useHeaderTopInset } from '../../utils/useHeaderTopInset';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getActiveLocation, getDeviceCurrentLocation } from '../../services/locationService';
import { safeHapticImpact, safeHapticSelection } from '../../utils/haptics';

const ColorTokens = {
  deepBerry: '#8F0D2F',
  deepPlum: '#5E173E',
  plum: '#5C2A91',
  warmIvory: '#FFFDF7',
  softCream: '#FAF4EE',
  coral: '#F27F78',
  softCoral: '#FBE0DC',
  lavender: '#F2ECFA',
  cobaltBlue: '#1677E8',
  successGreen: '#159447',
  softGreen: '#E3F5EA',
  text: '#1E293B',
  mutedText: '#64748B',
  border: '#E8E1E5',
};

export interface LiveRiderTrackingScreenProps {
  onBack?: () => void;
  onCallRider?: () => void;
  onChatRider?: () => void;
}

export const LiveRiderTrackingScreen: React.FC<LiveRiderTrackingScreenProps> = ({
  onBack,
  onCallRider,
  onChatRider,
}) => {
  const router = useRouter();
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();

  const isDesktopWeb = Platform.OS === 'web' && windowWidth > 768;

  // Real User Destination Address & Vendor Origin State
  const [userDestinationAddress, setUserDestinationAddress] = useState('Payikapuram, Vijayawada');
  const [vendorShopName] = useState('GlowVAI Express Darkstore #04');
  const [vendorShopAddress] = useState('MG Road, Benz Circle, Vijayawada');
  
  // Real-time animated rider tracking progress & ETA state
  const [etaMinutes, setEtaMinutes] = useState(7);
  const [etaSeconds, setEtaSeconds] = useState(42);
  const [progressPercent, setProgressPercent] = useState(68);
  const [shared, setShared] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'route' | 'details'>('route');

  useEffect(() => {
    getActiveLocation().then((loc) => {
      if (loc) setUserDestinationAddress(loc);
    });
    getDeviceCurrentLocation()
      .then((loc) => {
        if (loc?.formattedAddress) setUserDestinationAddress(loc.formattedAddress);
      })
      .catch(() => {});
  }, []);

  // Countdown Ticker for Live ETA
  useEffect(() => {
    const timer = setInterval(() => {
      setEtaSeconds((prevSec) => {
        if (prevSec > 0) return prevSec - 1;
        setEtaMinutes((prevMin) => (prevMin > 0 ? prevMin - 1 : 0));
        return 59;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulated Rider Motion Progress Animation
  useEffect(() => {
    const motion = setInterval(() => {
      setProgressPercent((prev) => (prev < 92 ? prev + 1.5 : 68));
    }, 2500);
    return () => clearInterval(motion);
  }, []);

  const handleCallRiderAction = () => {
    safeHapticImpact();
    if (onCallRider) {
      onCallRider();
    } else {
      Linking.openURL('tel:+919876543210').catch(() => {
        Alert.alert('Calling Rider', 'Rider Contact: +91 98765 43210 (Rahul Kumar)');
      });
    }
  };

  const handleChatRiderAction = () => {
    safeHapticImpact();
    if (onChatRider) {
      onChatRider();
    } else {
      Alert.alert('Live Chat', 'Connecting to delivery partner Rahul Kumar in-app chat...');
    }
  };

  const handleShareTracking = () => {
    safeHapticImpact();
    setShared(true);
    setTimeout(() => setShared(false), 3000);
  };

  const productThumbs = [
    { name: 'Minimalist Niacinamide 10%', image: 'https://images.unsplash.com/photo-1608248597261-5421d55ab385?auto=format&fit=crop&w=200&q=80', qty: 1, price: 599 },
    { name: 'Cetaphil Gentle Cleanser', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=200&q=80', qty: 1, price: 349 },
    { name: 'Dot & Key Vitamin C Gel', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=200&q=80', qty: 1, price: 490 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={ColorTokens.deepBerry} />

      {/* TOP BRAND NAVIGATION HEADER */}
      <View style={[styles.header, { paddingTop: Math.max(headerTopInset, 12), height: undefined, minHeight: 68 }]}>
        <TouchableOpacity
          style={styles.backCircle}
          onPress={onBack || (() => router.back())}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Back to orders"
        >
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.brandRow}>
          <Sparkles size={16} color="#FFD45F" />
          <View>
            <Text style={styles.headerTitle}>Live Order Delivery Tracking</Text>

            <Text style={styles.headerSubTitle} numberOfLines={1}>
              Order #GV-892401 · Darkstore Dispatch
            </Text>
          </View>
        </View>

        <View style={styles.statusPill}>
          <Text style={styles.statusPillText}>⚡ ON THE WAY</Text>
        </View>
      </View>

      {/* DESKTOP WIDESCREEN 2-COLUMN LAYOUT vs MOBILE LAYOUT */}
      {isDesktopWeb ? (
        <View style={styles.desktopContainer}>
          {/* LEFT 60%: SWIGGY/UBER-STYLE VECTOR MAP ROUTE CANVAS */}
          <View style={styles.desktopMapColumn}>
            <MapCanvasView
              vendorShopName={vendorShopName}
              vendorShopAddress={vendorShopAddress}
              userDestinationAddress={userDestinationAddress}
              progressPercent={progressPercent}
              etaMinutes={etaMinutes}
            />
          </View>

          {/* RIGHT 40%: LIVE TRACKING PANEL & RIDER CARD */}
          <ScrollView style={styles.desktopPanelColumn} showsVerticalScrollIndicator={false}>
            <TrackingPanelContent
              etaMinutes={etaMinutes}
              etaSeconds={etaSeconds}
              progressPercent={progressPercent}
              userDestinationAddress={userDestinationAddress}
              vendorShopName={vendorShopName}
              vendorShopAddress={vendorShopAddress}
              productThumbs={productThumbs}
              shared={shared}
              onShareTracking={handleShareTracking}
              onCallRider={handleCallRiderAction}
              onChatRider={handleChatRiderAction}
            />
          </ScrollView>
        </View>
      ) : (
        <View style={styles.mobileMapArea}>
          {/* SWIGGY/ZEPTO/UBER-STYLE UNIQUE VECTOR ROUTE MAP */}
          <MapCanvasView
            vendorShopName={vendorShopName}
            vendorShopAddress={vendorShopAddress}
            userDestinationAddress={userDestinationAddress}
            progressPercent={progressPercent}
            etaMinutes={etaMinutes}
          />

          {/* BOTTOM SHEET CONTROL PANEL */}
          <View style={[styles.bottomSheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
            <View style={styles.dragHandle} />
            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: Dimensions.get('window').height * 0.52 }}>
              <TrackingPanelContent
                etaMinutes={etaMinutes}
                etaSeconds={etaSeconds}
                progressPercent={progressPercent}
                userDestinationAddress={userDestinationAddress}
                vendorShopName={vendorShopName}
                vendorShopAddress={vendorShopAddress}
                productThumbs={productThumbs}
                shared={shared}
                onShareTracking={handleShareTracking}
                onCallRider={handleCallRiderAction}
                onChatRider={handleChatRiderAction}
              />
            </ScrollView>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

// ─────────────────────────────────────────────
// REAL INTERACTIVE LEAFLET / OPENSTREETMAP CARTOGRAPHY MAP
// ─────────────────────────────────────────────
function MapCanvasView({
  vendorShopName,
  vendorShopAddress,
  userDestinationAddress,
  progressPercent,
  etaMinutes,
}: {
  vendorShopName: string;
  vendorShopAddress: string;
  userDestinationAddress: string;
  progressPercent: number;
  etaMinutes: number;
}) {
  const leafletHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #leafletMap { width: 100%; height: 100%; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; }
    
    .leaflet-container { background: #e2e8f0; }
    
    .custom-pin-wrap {
      display: flex;
      align-items: center;
      gap: 6px;
      pointer-events: auto;
    }
    .pin-icon-box {
      width: 38px;
      height: 38px;
      border-radius: 19px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6px 16px rgba(0,0,0,0.3);
      border: 2px solid #ffffff;
      color: white;
      font-size: 18px;
      flex-shrink: 0;
    }
    .pin-label-box {
      background: rgba(255, 255, 255, 0.98);
      padding: 6px 12px;
      border-radius: 10px;
      border: 1px solid #cbd5e1;
      box-shadow: 0 4px 14px rgba(0,0,0,0.12);
      white-space: nowrap;
    }
    .pin-title {
      font-size: 11px;
      font-weight: 800;
      color: #0f172a;
      line-height: 14px;
    }
    .pin-sub {
      font-size: 9px;
      font-weight: 600;
      color: #64748b;
      line-height: 12px;
    }
    
    .rider-scooter-marker {
      width: 48px;
      height: 48px;
      border-radius: 24px;
      background: #8F0D2F;
      border: 3px solid #FFFFFF;
      box-shadow: 0 8px 24px rgba(143,13,47,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      animation: riderPulse 1.6s infinite ease-in-out;
    }
    @keyframes riderPulse {
      0% { box-shadow: 0 0 0 0 rgba(143,13,47,0.6); }
      70% { box-shadow: 0 0 0 18px rgba(143,13,47,0); }
      100% { box-shadow: 0 0 0 0 rgba(143,13,47,0); }
    }

    .top-floating-bar {
      position: absolute;
      top: 14px;
      left: 14px;
      z-index: 1000;
      display: flex;
      gap: 10px;
    }
    .badge-gps {
      background: #0f172a;
      color: #38bdf8;
      font-size: 11px;
      font-weight: 700;
      padding: 6px 12px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    .dot-live-green {
      width: 8px;
      height: 8px;
      border-radius: 4px;
      background: #22c55e;
      box-shadow: 0 0 8px #22c55e;
      animation: blinkGreen 1.2s infinite;
    }
    @keyframes blinkGreen { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
    
    .badge-eta-pill {
      background: #8F0D2F;
      color: #ffffff;
      font-size: 11px;
      font-weight: 700;
      padding: 6px 12px;
      border-radius: 20px;
      box-shadow: 0 4px 12px rgba(143,13,47,0.35);
    }

    .recenter-btn {
      position: absolute;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      color: #0f172a;
      padding: 10px 14px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 12px;
      cursor: pointer;
      box-shadow: 0 6px 18px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
    }
    .recenter-btn:hover {
      background: #f8fafc;
      transform: translateY(-2px);
    }
  </style>
</head>
<body>
  <div class="top-floating-bar">
    <div class="badge-gps"><div class="dot-live-green"></div> LIVE GPS SATELLITE</div>
    <div class="badge-eta-pill">⚡ ${etaMinutes} MINS ETA</div>
  </div>
  
  <div id="leafletMap"></div>

  <button class="recenter-btn" onclick="recenterRoute()">🎯 Recenter Route View</button>

  <script>
    // Real Vijayawada City Coordinates Grid
    const originCoords = [16.5062, 80.6480]; // MG Road Darkstore Hub
    const destCoords = [16.5185, 80.6320];   // Destination Home

    const map = L.map('leafletMap', {
      zoomControl: true,
      attributionControl: false
    }).setView([16.5123, 80.6400], 14);

    // High Quality CartoDB Voyager Street Cartography Tile Layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);

    // Curved turn-by-turn road waypoints along MG Road & Vijayawada street corridors
    const roadWaypoints = [
      [16.5062, 80.6480], // Darkstore MG Road
      [16.5082, 80.6452], // Benz Circle Flyover
      [16.5108, 80.6422], // Bandar Road Corridor
      [16.5138, 80.6388], // Convent Street Junction
      [16.5162, 80.6352], // Eluru Road Crossing
      [16.5185, 80.6320]  // User Destination Address
    ];

    // Outer Glow Shadow Polyline
    L.polyline(roadWaypoints, {
      color: '#FBE0DC',
      weight: 12,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    // Primary Delivery Route Polyline Path
    const routeLine = L.polyline(roadWaypoints, {
      color: '#8F0D2F',
      weight: 6,
      opacity: 0.95,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    // Auto fit map view to route bounds
    map.fitBounds(routeLine.getBounds(), { padding: [60, 60] });

    // 1. ORIGIN DARKSTORE VENDOR MARKER
    const storeIcon = L.divIcon({
      className: 'custom-store-pin',
      html: \`
        <div class="custom-pin-wrap">
          <div class="pin-icon-box" style="background:#5C2A91;">🏪</div>
          <div class="pin-label-box">
            <div class="pin-title">${vendorShopName.replace(/'/g, "\\'")}</div>
            <div class="pin-sub">Vendor Origin · Dispatched</div>
          </div>
        </div>
      \`,
      iconSize: [220, 44],
      iconAnchor: [19, 22]
    });
    L.marker(originCoords, { icon: storeIcon }).addTo(map);

    // 2. DESTINATION HOME MARKER
    const homeIcon = L.divIcon({
      className: 'custom-home-pin',
      html: \`
        <div class="custom-pin-wrap">
          <div class="pin-icon-box" style="background:#159447;">🏠</div>
          <div class="pin-label-box">
            <div class="pin-title">Your Saved Address</div>
            <div class="pin-sub">${userDestinationAddress.replace(/'/g, "\\'")}</div>
          </div>
        </div>
      \`,
      iconSize: [240, 44],
      iconAnchor: [19, 22]
    });
    L.marker(destCoords, { icon: homeIcon }).addTo(map);

    // 3. LIVE ANIMATED RIDER SCOOTER MARKER
    const riderIcon = L.divIcon({
      className: 'custom-rider-pin',
      html: '<div class="rider-scooter-marker">🛵</div>',
      iconSize: [48, 48],
      iconAnchor: [24, 24]
    });

    let currentIdx = 2;
    const riderMarker = L.marker(roadWaypoints[currentIdx], { icon: riderIcon }).addTo(map);
    riderMarker.bindPopup('<b>Rahul Kumar</b><br>🛵 TVS Jupiter (AP 39 KQ 7321)<br><i>⚡ Arriving in ${etaMinutes} mins</i>').openPopup();

    // Smooth movement along street nodes
    setInterval(() => {
      currentIdx = (currentIdx + 1) % roadWaypoints.length;
      if (currentIdx === 0) currentIdx = 1;
      riderMarker.setLatLng(roadWaypoints[currentIdx]);
    }, 3500);

    function recenterRoute() {
      map.fitBounds(routeLine.getBounds(), { padding: [60, 60] });
    }
  </script>
</body>
</html>
  `;

  if (Platform.OS === 'web') {
    return (
      <View style={styles.mapCanvasContainer}>
        <iframe
          title="Live Delivery Route Map"
          srcDoc={leafletHtml}
          style={{ width: '100%', height: '100%', border: 0 }}
        />
      </View>
    );
  }

  return (
    <View style={styles.mapCanvasContainer}>
      {/* Native Leaflet / Vector Map Fallback View */}
      <View style={styles.vectorRoadGrid} />
      <View style={styles.vectorRiverRibbon} />

      <View style={[styles.mapLabelBadge, { top: '12%', left: '8%' }]}>
        <Text style={styles.mapLabelText}>📍 Benz Circle Hub</Text>
      </View>
      <View style={[styles.mapLabelBadge, { top: '38%', right: '12%' }]}>
        <Text style={styles.mapLabelText}>📍 MG Road Express Corridor</Text>
      </View>

      <View style={styles.routePolylineTrack} />
      <View style={[styles.routePolylineActive, { height: `${progressPercent}%` }]} />

      <View style={[styles.pinBadge, styles.originPinPos]}>
        <View style={styles.originMarkerBox}>
          <Store size={18} color="#FFFFFF" />
        </View>
        <View style={styles.pinTooltip}>
          <Text style={styles.pinTooltipTitle}>{vendorShopName}</Text>
          <Text style={styles.pinTooltipSub}>Vendor Origin · Dispatched</Text>
        </View>
      </View>

      <View style={[styles.riderMarkerPos, { top: `${30 + progressPercent * 0.42}%` }]}>
        <View style={styles.pulseRing} />
        <View style={styles.riderMarkerBadge}>
          <Text style={{ fontSize: 20 }}>🛵</Text>
        </View>
        <View style={styles.riderTooltip}>
          <Text style={styles.riderTooltipText}>Rahul · {etaMinutes} Mins Away</Text>
          <Text style={styles.riderTooltipSub}>TVS Jupiter (AP 39 KQ 7321)</Text>
        </View>
      </View>

      <View style={[styles.pinBadge, styles.destinationPinPos]}>
        <View style={styles.destinationPulseRing} />
        <View style={styles.destinationMarkerBox}>
          <Home size={18} color="#FFFFFF" />
        </View>
        <View style={styles.destinationTooltip}>
          <Text style={styles.destinationTooltipTitle}>Your Delivery Address</Text>
          <Text style={styles.destinationTooltipSub} numberOfLines={1}>{userDestinationAddress}</Text>
        </View>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────
// TRACKING PANEL CONTENT (HERO ETA, STEPPER, RIDER & ADDRESS)
// ─────────────────────────────────────────────
function TrackingPanelContent({
  etaMinutes,
  etaSeconds,
  progressPercent,
  userDestinationAddress,
  vendorShopName,
  vendorShopAddress,
  productThumbs,
  shared,
  onShareTracking,
  onCallRider,
  onChatRider,
}: {
  etaMinutes: number;
  etaSeconds: number;
  progressPercent: number;
  userDestinationAddress: string;
  vendorShopName: string;
  vendorShopAddress: string;
  productThumbs: { name: string; image: string; qty: number; price: number }[];
  shared: boolean;
  onShareTracking: () => void;
  onCallRider: () => void;
  onChatRider: () => void;
}) {
  const formattedSec = etaSeconds < 10 ? `0${etaSeconds}` : `${etaSeconds}`;

  return (
    <View style={styles.panelContentWrap}>
      {/* 1. HERO ETA & LIVE COUNTDOWN */}
      <View style={styles.heroEtaCard}>
        <View style={styles.heroEtaLeft}>
          <Text style={styles.heroEtaEyebrow}>ESTIMATED ARRIVAL TIME</Text>
          <Text style={styles.heroEtaBigNumber}>
            {etaMinutes}:{formattedSec} <Text style={{ fontSize: 18, color: '#64748B' }}>MINS</Text>
          </Text>
          <Text style={styles.heroEtaSubText}>Rider is 1.8 km away · Traffic clear</Text>
        </View>
        <View style={styles.heroEtaBadgeRight}>
          <Truck size={24} color="#159447" />
          <Text style={styles.heroEtaBadgeLabel}>ON TIME</Text>
        </View>
      </View>

      {/* 2. LIVE 4-STAGE DELIVERY PROGRESS STEPPER */}
      <View style={styles.stepperCard}>
        <Text style={styles.sectionHeading}>Order Status Progress</Text>
        <View style={styles.stepperRow}>
          {/* Step 1: Placed */}
          <View style={styles.stepCol}>
            <View style={[styles.stepCircle, styles.stepDone]}>
              <CheckCircle2 size={14} color="#FFFFFF" />
            </View>
            <Text style={styles.stepTextDone}>Placed</Text>
            <Text style={styles.stepTimeText}>11:42 AM</Text>
          </View>
          <View style={[styles.stepLine, styles.stepLineDone]} />

          {/* Step 2: Packed */}
          <View style={styles.stepCol}>
            <View style={[styles.stepCircle, styles.stepDone]}>
              <CheckCircle2 size={14} color="#FFFFFF" />
            </View>
            <Text style={styles.stepTextDone}>Packed</Text>
            <Text style={styles.stepTimeText}>11:44 AM</Text>
          </View>
          <View style={[styles.stepLine, styles.stepLineDone]} />

          {/* Step 3: Picked Up */}
          <View style={styles.stepCol}>
            <View style={[styles.stepCircle, styles.stepDone]}>
              <CheckCircle2 size={14} color="#FFFFFF" />
            </View>
            <Text style={styles.stepTextDone}>Picked Up</Text>
            <Text style={styles.stepTimeText}>11:46 AM</Text>
          </View>
          <View style={[styles.stepLine, styles.stepLineActive]} />

          {/* Step 4: On The Way */}
          <View style={styles.stepCol}>
            <View style={[styles.stepCircle, styles.stepActive]}>
              <Truck size={14} color="#FFFFFF" />
            </View>
            <Text style={styles.stepTextActive}>On The Way</Text>
            <Text style={styles.stepTimeText}>7 Mins</Text>
          </View>
        </View>
      </View>

      {/* 3. RIDER PARTNER PROFILE CARD */}
      <View style={styles.riderCard}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          }}
          style={styles.riderAvatar}
        />
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={styles.riderNameRow}>
            <Text style={styles.riderName} numberOfLines={1}>Rahul Kumar</Text>
            <View style={styles.ratingBadge}>
              <Star size={11} color="#FFD700" fill="#FFD700" />
              <Text style={styles.ratingText}>4.9</Text>
            </View>
          </View>
          <Text style={styles.vehicleText}>TVS Jupiter · AP 39 KQ 7321</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 }}>
            <ShieldCheck size={12} color="#159447" />
            <Text style={styles.trustedBadge}>Verified Delivery Partner · Masked Call</Text>
          </View>
        </View>

        {/* CALL & CHAT ACTIONS */}
        <View style={styles.riderActionsCol}>
          <TouchableOpacity style={styles.callRiderBtn} onPress={onCallRider} activeOpacity={0.85}>
            <Phone size={16} color="#FFFFFF" />
            <Text style={styles.callRiderText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chatRiderBtn} onPress={onChatRider} activeOpacity={0.85}>
            <MessageSquare size={16} color="#8F0D2F" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 4. ORIGIN TO DESTINATION ADDRESS CARD */}
      <View style={styles.addressRouteCard}>
        <Text style={styles.sectionHeading}>Delivery Route Details</Text>
        
        {/* ORIGIN */}
        <View style={styles.routeItemRow}>
          <View style={styles.originIconCircle}>
            <Store size={14} color="#8F0D2F" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.routeRoleLabel}>ORIGIN (VENDOR DARKSTORE)</Text>
            <Text style={styles.routeNameText}>{vendorShopName}</Text>
            <Text style={styles.routeAddressText}>{vendorShopAddress}</Text>
          </View>
        </View>

        <View style={styles.routeDottedLine} />

        {/* DESTINATION */}
        <View style={styles.routeItemRow}>
          <View style={styles.destinationIconCircle}>
            <Home size={14} color="#159447" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.routeRoleLabel}>DESTINATION (YOUR LOCATION)</Text>
            <Text style={styles.routeNameText}>Your Saved Address</Text>
            <Text style={styles.routeAddressText} numberOfLines={2}>{userDestinationAddress}</Text>
          </View>
        </View>
      </View>

      {/* 5. ORDERED ITEMS PREVIEW */}
      <View style={styles.orderItemsCard}>
        <View style={styles.orderItemsHeader}>
          <Text style={styles.sectionHeading}>Order Items (3 Formulations)</Text>
          <Text style={styles.paidBadge}>PAID ₹1,438 ✓</Text>
        </View>
        <View style={styles.itemsListRow}>
          {productThumbs.map((item, idx) => (
            <View key={idx} style={styles.itemThumbBox}>
              <Image source={{ uri: item.image }} style={styles.itemThumbImg} resizeMode="contain" />
              <Text style={styles.itemThumbName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.itemThumbQty}>x{item.qty} · ₹{item.price}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 6. SHARE TRACKING BUTTON */}
      <TouchableOpacity style={styles.shareBtn} onPress={onShareTracking} activeOpacity={0.9}>
        <Share2 size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
        <Text style={styles.shareBtnText}>
          {shared ? '✓ Tracking Link Copied to Clipboard' : 'Share Live Tracking Link'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorTokens.warmIvory,
  },
  header: {
    backgroundColor: ColorTokens.deepBerry,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 20,
  },
  backCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  headerSubTitle: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: '#FBE0DC',
  },
  statusPill: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusPillText: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },

  // DESKTOP SPLIT LAYOUT
  desktopContainer: {
    flex: 1,
    flexDirection: 'row',
    maxWidth: 1440,
    width: '100%',
    alignSelf: 'center',
  },
  desktopMapColumn: {
    flex: 1.4,
    height: '100%',
    borderRightWidth: 1,
    borderColor: ColorTokens.border,
  },
  desktopPanelColumn: {
    flex: 1,
    padding: 24,
    backgroundColor: ColorTokens.warmIvory,
  },

  // MOBILE LAYOUT
  mobileMapArea: {
    flex: 1,
    position: 'relative',
  },
  mapCanvasContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E8F1F3',
    overflow: 'hidden',
  },
  vectorRoadGrid: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.12,
    backgroundColor: '#CBD5E1',
  },
  vectorRiverRibbon: {
    position: 'absolute',
    width: '150%',
    height: 70,
    backgroundColor: 'rgba(22, 119, 232, 0.22)',
    transform: [{ rotate: '-28deg' }],
    top: '36%',
    left: '-20%',
  },
  mapLabelBadge: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  mapLabelText: {
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
    color: ColorTokens.text,
  },
  routePolylineTrack: {
    position: 'absolute',
    width: 4,
    top: '22%',
    bottom: '22%',
    left: '48%',
    backgroundColor: 'rgba(143, 13, 47, 0.2)',
    borderRadius: 2,
  },
  routePolylineActive: {
    position: 'absolute',
    width: 5,
    top: '22%',
    left: '48%',
    backgroundColor: ColorTokens.deepBerry,
    borderRadius: 2.5,
  },
  pinBadge: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  originPinPos: {
    top: '18%',
    left: '32%',
  },
  originMarkerBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: ColorTokens.deepBerry,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  pinTooltip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  pinTooltipTitle: {
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
    color: ColorTokens.text,
  },
  pinTooltipSub: {
    fontSize: 9,
    fontFamily: 'Poppins-Regular',
    color: ColorTokens.mutedText,
  },
  riderMarkerPos: {
    position: 'absolute',
    left: '43%',
    alignItems: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(143, 13, 47, 0.25)',
    marginTop: -5,
  },
  riderMarkerBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: ColorTokens.deepBerry,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  riderTooltip: {
    backgroundColor: ColorTokens.text,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 4,
    alignItems: 'center',
  },
  riderTooltipText: {
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  riderTooltipSub: {
    fontSize: 9,
    fontFamily: 'Poppins-Regular',
    color: '#CBD5E1',
  },
  destinationPinPos: {
    bottom: '22%',
    left: '30%',
  },
  destinationPulseRing: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(21, 148, 71, 0.22)',
    marginTop: -5,
  },
  destinationMarkerBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: ColorTokens.successGreen,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  destinationTooltip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    maxWidth: 180,
  },
  destinationTooltipTitle: {
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
    color: ColorTokens.successGreen,
  },
  destinationTooltipSub: {
    fontSize: 9,
    fontFamily: 'Poppins-Regular',
    color: ColorTokens.mutedText,
  },
  mapTopOverlayControls: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveGpsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(30, 41, 59, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  liveGreenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  liveGpsText: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  etaQuickBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  etaQuickText: {
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
    color: ColorTokens.deepBerry,
  },

  // BOTTOM SHEET CONTROL PANEL
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: ColorTokens.warmIvory,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 18,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: ColorTokens.border,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  dragHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 12,
  },
  panelContentWrap: {
    gap: 14,
  },
  heroEtaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroEtaLeft: {
    flex: 1,
  },
  heroEtaEyebrow: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    color: ColorTokens.mutedText,
    letterSpacing: 0.5,
  },
  heroEtaBigNumber: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: ColorTokens.deepBerry,
    marginTop: 2,
  },
  heroEtaSubText: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: ColorTokens.mutedText,
    marginTop: 2,
  },
  heroEtaBadgeRight: {
    alignItems: 'center',
    backgroundColor: ColorTokens.softGreen,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  heroEtaBadgeLabel: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    color: ColorTokens.successGreen,
    marginTop: 4,
  },

  // STEPPER
  stepperCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  sectionHeading: {
    fontSize: 13,
    fontFamily: 'Poppins-Bold',
    color: ColorTokens.text,
    marginBottom: 12,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepCol: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDone: {
    backgroundColor: ColorTokens.successGreen,
  },
  stepActive: {
    backgroundColor: ColorTokens.deepBerry,
  },
  stepTextDone: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    color: ColorTokens.successGreen,
    marginTop: 4,
  },
  stepTextActive: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    color: ColorTokens.deepBerry,
    marginTop: 4,
  },
  stepTimeText: {
    fontSize: 9,
    fontFamily: 'Poppins-Regular',
    color: ColorTokens.mutedText,
  },
  stepLine: {
    flex: 1,
    height: 3,
    marginHorizontal: 4,
    marginTop: -14,
    borderRadius: 1.5,
  },
  stepLineDone: {
    backgroundColor: ColorTokens.successGreen,
  },
  stepLineActive: {
    backgroundColor: ColorTokens.deepBerry,
  },

  // RIDER CARD
  riderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  riderAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  riderNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  riderName: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: ColorTokens.text,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: ColorTokens.softCream,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    color: ColorTokens.text,
  },
  vehicleText: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: ColorTokens.mutedText,
    marginTop: 2,
  },
  trustedBadge: {
    fontSize: 10,
    fontFamily: 'Poppins-Medium',
    color: ColorTokens.successGreen,
  },
  riderActionsCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  callRiderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: ColorTokens.deepBerry,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  callRiderText: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  chatRiderBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: ColorTokens.lavender,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ROUTE ADDRESS CARD
  addressRouteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  routeItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  originIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: ColorTokens.softCoral,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  destinationIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: ColorTokens.softGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  routeRoleLabel: {
    fontSize: 9,
    fontFamily: 'Poppins-Bold',
    color: ColorTokens.mutedText,
    letterSpacing: 0.5,
  },
  routeNameText: {
    fontSize: 13,
    fontFamily: 'Poppins-Bold',
    color: ColorTokens.text,
  },
  routeAddressText: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: ColorTokens.mutedText,
    marginTop: 2,
  },
  routeDottedLine: {
    height: 18,
    width: 2,
    backgroundColor: '#CBD5E1',
    marginLeft: 13,
    marginVertical: 4,
  },

  // ORDER ITEMS PREVIEW
  orderItemsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
  },
  orderItemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paidBadge: {
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
    color: ColorTokens.successGreen,
    backgroundColor: ColorTokens.softGreen,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  itemsListRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  itemThumbBox: {
    flex: 1,
    backgroundColor: ColorTokens.warmIvory,
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    alignItems: 'center',
  },
  itemThumbImg: {
    width: 36,
    height: 36,
    borderRadius: 6,
    marginBottom: 4,
  },
  itemThumbName: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    color: ColorTokens.text,
    textAlign: 'center',
  },
  itemThumbQty: {
    fontSize: 9,
    fontFamily: 'Poppins-Regular',
    color: ColorTokens.mutedText,
  },

  // SHARE BTN
  shareBtn: {
    backgroundColor: ColorTokens.deepBerry,
    borderRadius: 14,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtnText: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
});
