import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ActivityIndicator,
  Platform,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import {
  ArrowLeft,
  Search,
  MapPin,
  Sparkles,
  X,
  Navigation,
  AlertTriangle,
  Building2,
  Check,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useHeaderTopInset } from '../../utils/useHeaderTopInset';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { safeHapticImpact } from '../../utils/haptics';
import * as Location from 'expo-location';
import { saveActiveLocation, getActiveLocation } from '../../services/locationService';

// Dynamically import WebView on native mobile platforms
let WebView: any = null;
if (Platform.OS !== 'web') {
  try {
    WebView = require('react-native-webview').WebView;
  } catch (_) {}
}

const ColorTokens = {
  deepBerry: '#8F0D2F',
  plum: '#5C2A91',
  warmIvory: '#FFFDF7',
  softCream: '#FAF4EE',
  coral: '#F27F78',
  softCoral: '#FBE0DC',
  lavender: '#F2ECFA',
  cobaltBlue: '#1677E8',
  successGreen: '#159447',
  softGreen: '#E3F5EA',
  text: '#321A2B',
  mutedText: '#756C73',
  border: '#E8E1E5',
};

const DEFAULT_LAT = 16.5062;
const DEFAULT_LNG = 80.648;

const POPULAR_LOCATIONS = [
  { name: 'Payakapuram', detail: 'Near Water Tank Road, Vijayawada', lat: 16.5385, lng: 80.6456 },
  { name: 'Benz Circle', detail: 'MG Road, Vijayawada', lat: 16.5002, lng: 80.6472 },
  { name: 'MG Road', detail: 'Labbipet, Vijayawada', lat: 16.5074, lng: 80.6389 },
  { name: 'Vijayawada Railway Station', detail: 'Station Road, Hanumanpet, Vijayawada', lat: 16.5173, lng: 80.6202 },
  { name: 'GMR IT Campus', detail: 'GMR Nagar, Rajam', lat: 18.4674, lng: 83.6611 },
  { name: 'Gudavalli', detail: 'NH 16, Vijayawada Rural', lat: 16.5218, lng: 80.7291 },
];

const LEAFLET_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    body, html, #map {
      margin: 0; padding: 0; width: 100%; height: 100%; background: #FAF4EE;
    }
    .leaflet-control-container .leaflet-routing-container-hide { display: none; }
    .leaflet-control-attribution { display: none !important; }
    .leaflet-control-zoom { display: none !important; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', {
      center: [${DEFAULT_LAT}, ${DEFAULT_LNG}],
      zoom: 16,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: 'abc'
    }).addTo(map);

    function post(data) {
      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
        window.ReactNativeWebView.postMessage(JSON.stringify(data));
      } else if (window.parent) {
        window.parent.postMessage(JSON.stringify(data), '*');
      }
    }

    map.on('move', function() {
      var center = map.getCenter();
      post({ type: 'moving', lat: center.lat, lng: center.lng });
    });

    map.on('moveend', function() {
      var center = map.getCenter();
      post({ type: 'moved', lat: center.lat, lng: center.lng });
    });

    function setLocation(lat, lng) {
      map.flyTo([lat, lng], 17, { animate: true, duration: 1.0 });
    }

    window.addEventListener('message', function(e) {
      try {
        var data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (data && data.type === 'setLocation') {
          setLocation(data.lat, data.lng);
        }
      } catch(err) {}
    });
  </script>
</body>
</html>
`;

export interface MapPinPickerScreenProps {
  onBack?: () => void;
  onConfirmLocation?: (location: string) => void;
}

export const MapPinPickerScreen: React.FC<MapPinPickerScreenProps> = ({
  onBack,
  onConfirmLocation,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const headerTopInset = useHeaderTopInset(8);
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<any>(null);

  const isDesktopWeb = Platform.OS === 'web' && windowWidth > 768;

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchViewOpen, setIsSearchViewOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{ title: string; detail: string; lat: number; lng: number }>>([]);
  
  const [isConfirming, setIsConfirming] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const [pinAddress, setPinAddress] = useState('Payakapuram, Vijayawada');
  const [pinSubAddress, setPinSubAddress] = useState(
    'Sector 4, Near Water Tank Road, 520015'
  );

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    getActiveLocation().then((loc) => {
      if (loc) setPinAddress(loc);
    });
  }, []);

  const handleLocationUpdate = useCallback(async (lat: number, lng: number) => {
    setIsGeocoding(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        { headers: { 'User-Agent': 'GlowVAI/1.0' } }
      );
      if (response.ok) {
        const data = await response.json();
        const addr = data.address || {};
        const areaName =
          addr.suburb ||
          addr.neighbourhood ||
          addr.residential ||
          addr.road ||
          addr.city_district ||
          addr.city ||
          addr.town ||
          addr.village ||
          'Selected Location';
        const cityName = addr.city || addr.town || addr.district || addr.state || '';
        const stateName = addr.state || '';
        const postcode = addr.postcode ? `, ${addr.postcode}` : '';

        const resolvedAddress = cityName ? `${areaName}, ${cityName}` : areaName;
        const subAddress = `${addr.road ? addr.road + ', ' : ''}${addr.suburb ? addr.suburb + ', ' : ''}${cityName ? cityName + ', ' : ''}${stateName}${postcode}`;

        setPinAddress(resolvedAddress);
        setPinSubAddress(subAddress || data.display_name || 'Exact GPS location pinned');
        saveActiveLocation(resolvedAddress, lat, lng);
        setErrorMessage(null);
        setIsGeocoding(false);
        return;
      }
    } catch (_) {}

    try {
      const results = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lng,
      });
      if (results && results.length > 0 && results[0]) {
        const r = results[0];
        const mainParts = [r.name, r.street, r.district, r.city]
          .filter(Boolean)
          .join(', ');
        const subParts = [r.subregion, r.region, r.postalCode]
          .filter(Boolean)
          .join(', ');
        const resolvedAddress = mainParts || 'Selected Location';
        setPinAddress(resolvedAddress);
        setPinSubAddress(subParts || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
        saveActiveLocation(resolvedAddress, lat, lng);
        setErrorMessage(null);
      }
    } catch (_) {
      const fallbackAddr = `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
      setPinAddress(fallbackAddr);
      saveActiveLocation(fallbackAddr, lat, lng);
    } finally {
      setIsGeocoding(false);
    }
  }, []);

  const dispatchMapSetLocation = (lat: number, lng: number) => {
    if (Platform.OS === 'web') {
      const iframe: any = document.getElementById('leaflet-web-iframe');
      if (iframe?.contentWindow) {
        iframe.contentWindow.setLocation?.(lat, lng);
        iframe.contentWindow.postMessage?.(JSON.stringify({ type: 'setLocation', lat, lng }), '*');
      }
    } else {
      webViewRef.current?.injectJavaScript(`setLocation(${lat}, ${lng}); true;`);
    }
  };

  const handleNativeWebViewMessage = useCallback(
    (event: any) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === 'moving') {
          setIsGeocoding(true);
        } else if (data.type === 'moved') {
          handleLocationUpdate(data.lat, data.lng);
        }
      } catch (_) {}
    },
    [handleLocationUpdate]
  );

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const handleWebMsg = async (e: MessageEvent) => {
        try {
          if (typeof e.data === 'string') {
            const data = JSON.parse(e.data);
            if (data.type === 'moving') {
              setIsGeocoding(true);
            } else if (data.type === 'moved') {
              handleLocationUpdate(data.lat, data.lng);
            }
          }
        } catch (_) {}
      };
      window.addEventListener('message', handleWebMsg);
      return () => window.removeEventListener('message', handleWebMsg);
    }
  }, [handleLocationUpdate]);

  // Real-time live place suggestions search as user types
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const q = searchQuery.trim();
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&countrycodes=in&addressdetails=1&limit=8`;
        const res = await fetch(url, { headers: { 'User-Agent': 'GlowVAI/1.0' } });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const items = data.map((item: any) => {
              const addr = item.address || {};
              const title =
                addr.suburb ||
                addr.neighbourhood ||
                addr.road ||
                addr.amenity ||
                addr.building ||
                addr.city ||
                addr.town ||
                item.display_name.split(',')[0];
              return {
                title: title,
                detail: item.display_name,
                lat: parseFloat(item.lat),
                lng: parseFloat(item.lon),
              };
            });
            setSearchResults(items);
            setIsSearchViewOpen(true);
          } else {
            setSearchResults([]);
          }
        } else {
          setSearchResults([]);
        }
      } catch (_) {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const selectLocation = (item: { title: string; detail: string; lat: number; lng: number }) => {
    safeHapticImpact();
    setSearchQuery(item.title);
    setIsSearchViewOpen(false);
    dispatchMapSetLocation(item.lat, item.lng);
    handleLocationUpdate(item.lat, item.lng);
  };

  const handleSearchSubmit = async () => {
    if (!searchQuery.trim()) return;
    safeHapticImpact();
    setIsSearching(true);
    setErrorMessage(null);
    try {
      if (searchResults.length > 0 && searchResults[0]) {
        selectLocation(searchResults[0]);
        return;
      }
      const q = searchQuery.trim();
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&countrycodes=in&addressdetails=1&limit=1`;
      const res = await fetch(url, { headers: { 'User-Agent': 'GlowVAI/1.0' } });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          dispatchMapSetLocation(lat, lng);
          handleLocationUpdate(lat, lng);
          setIsSearchViewOpen(false);
        } else {
          setErrorMessage(`No place found for "${searchQuery}". Try typing city or area.`);
        }
      }
    } catch (err: any) {
      setErrorMessage(`Search Error: ${err?.message || err}`);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCurrentLocBtn = async () => {
    safeHapticImpact();
    setIsLocating(true);
    setErrorMessage(null);
    setIsSearchViewOpen(false);

    const applyCoords = (lat: number, lng: number) => {
      dispatchMapSetLocation(lat, lng);
      handleLocationUpdate(lat, lng);
      setIsLocating(false);
    };

    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          applyCoords(pos.coords.latitude, pos.coords.longitude);
        },
        async (err) => {
          try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
              const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
              applyCoords(loc.coords.latitude, loc.coords.longitude);
              return;
            }
          } catch (_) {}
          setErrorMessage(`GPS Error: ${err.message || 'Unable to fetch current location'}`);
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
      );
      return;
    }

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });
        applyCoords(loc.coords.latitude, loc.coords.longitude);
      } else {
        setErrorMessage('Location permission denied. Please allow location access.');
        setIsLocating(false);
      }
    } catch (err: any) {
      setErrorMessage(`GPS Error: ${err?.message || err}`);
      setIsLocating(false);
    }
  };

  const handleConfirm = async () => {
    safeHapticImpact();
    setIsConfirming(true);
    await saveActiveLocation(pinAddress);
    setTimeout(() => {
      setIsConfirming(false);
      if (onConfirmLocation) {
        onConfirmLocation(pinAddress);
      }
      router.push({
        pathname: '/add-address' as any,
        params: { address: pinAddress, subAddress: pinSubAddress },
      });
    }, 400);
  };

  // FULL DESKTOP PC WEB APPLICATION LAYOUT
  if (isDesktopWeb) {
    return (
      <View style={styles.desktopContainer}>
        <StatusBar barStyle="light-content" backgroundColor={ColorTokens.deepBerry} />

        {/* DESKTOP HEADER */}
        <View style={styles.desktopHeader}>
          <View style={styles.desktopHeaderLeft}>
            <TouchableOpacity
              style={styles.backCircle}
              onPress={() => {
                safeHapticImpact();
                if (onBack) onBack();
                else router.back();
              }}
              activeOpacity={0.7}
            >
              <ArrowLeft size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.brandRow}>
              <Sparkles size={18} color="#FFD700" />
              <Text style={styles.desktopHeaderTitle}>Select Delivery Location</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.desktopGpsPill}
            onPress={handleCurrentLocBtn}
            activeOpacity={0.8}
          >
            {isLocating ? (
              <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 6 }} />
            ) : (
              <Navigation size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            )}
            <Text style={styles.desktopGpsPillText}>Detect My GPS Location</Text>
          </TouchableOpacity>
        </View>

        {/* ERROR BANNER */}
        {errorMessage && (
          <View style={styles.errorBanner}>
            <AlertTriangle size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.errorText} numberOfLines={2}>
              {errorMessage}
            </Text>
            <TouchableOpacity onPress={() => setErrorMessage(null)} style={styles.errorClose}>
              <X size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

        {/* DESKTOP SPLIT BODY */}
        <View style={styles.desktopBody}>
          {/* LEFT SIDEBAR PANEL */}
          <View style={styles.desktopSidebar}>
            {/* SEARCH BOX */}
            <View style={styles.desktopSearchBox}>
              <TouchableOpacity onPress={handleSearchSubmit}>
                {isSearching ? (
                  <ActivityIndicator size="small" color={ColorTokens.deepBerry} style={{ marginRight: 8 }} />
                ) : (
                  <Search size={18} color={ColorTokens.deepBerry} style={{ marginRight: 8 }} />
                )}
              </TouchableOpacity>
              <TextInput
                style={styles.floatingSearchInput}
                placeholder="Search city, area or street name..."
                placeholderTextColor={ColorTokens.mutedText}
                value={searchQuery}
                onChangeText={(txt) => {
                  setSearchQuery(txt);
                  if (!isSearchViewOpen) setIsSearchViewOpen(true);
                }}
                onFocus={() => setIsSearchViewOpen(true)}
                returnKeyType="search"
                onSubmitEditing={handleSearchSubmit}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <X size={16} color={ColorTokens.mutedText} />
                </TouchableOpacity>
              )}
            </View>

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
              {/* CURRENT LOCATION BUTTON IN SIDEBAR */}
              <TouchableOpacity
                style={styles.searchCurrentLocItem}
                onPress={handleCurrentLocBtn}
                activeOpacity={0.7}
              >
                <View style={styles.currentLocIconBg}>
                  <Navigation size={18} color="#FFFFFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.currentLocItemTitle}>Use Current Location</Text>
                  <Text style={styles.currentLocItemSub}>High precision GPS auto-detect</Text>
                </View>
              </TouchableOpacity>

              {/* SEARCH RESULTS */}
              {searchResults.length > 0 && (
                <View style={styles.searchGroup}>
                  <Text style={styles.searchGroupLabel}>MATCHING SEARCH RESULTS</Text>
                  {searchResults.map((item, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.searchResultItem}
                      onPress={() => selectLocation(item)}
                      activeOpacity={0.7}
                    >
                      <MapPin size={18} color={ColorTokens.deepBerry} style={{ marginRight: 12 }} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.resultItemTitle}>{item.title}</Text>
                        <Text style={styles.resultItemSub}>{item.detail}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* POPULAR AREAS */}
              <View style={styles.searchGroup}>
                <Text style={styles.searchGroupLabel}>POPULAR AREAS</Text>
                {POPULAR_LOCATIONS.map((loc, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.searchResultItem}
                    onPress={() =>
                      selectLocation({
                        title: loc.name,
                        detail: loc.detail,
                        lat: loc.lat,
                        lng: loc.lng,
                      })
                    }
                    activeOpacity={0.7}
                  >
                    <Building2 size={18} color={ColorTokens.plum} style={{ marginRight: 12 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.resultItemTitle}>{loc.name}</Text>
                      <Text style={styles.resultItemSub}>{loc.detail}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* CONFIRMATION ADDRESS CARD */}
              <View style={{ marginTop: 8, marginBottom: 16 }}>
                <Text style={styles.sectionLabel}>SELECTED DELIVERY ADDRESS</Text>
                <View style={styles.addressCard}>
                  <View style={styles.locationIconBg}>
                    <MapPin size={22} color={ColorTokens.deepBerry} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.selectedTitle}>{pinAddress}</Text>
                    <Text style={styles.selectedSub}>{pinSubAddress}</Text>
                    <Text style={styles.entranceInstruction}>
                      Drag pin on map to refine location
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* CTA BUTTON */}
            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={handleConfirm}
              activeOpacity={0.9}
              disabled={isConfirming || isGeocoding}
            >
              {isConfirming ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.confirmBtnText}>Confirm Delivery Address →</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* RIGHT MAP SECTION */}
          <View style={styles.desktopMapSection}>
            <iframe
              id="leaflet-web-iframe"
              srcDoc={LEAFLET_HTML}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
            />

            {/* CENTERED FIXED PIN */}
            <View style={styles.centeredPinWrapper} pointerEvents="none">
              <View style={styles.berryPinHead}>
                <MapPin size={26} color="#FFFFFF" />
              </View>
              <View style={styles.pinTipShadow} />
              {isGeocoding ? (
                <View style={styles.dragTooltip}>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                </View>
              ) : (
                <View style={styles.dragTooltip}>
                  <Text style={styles.dragTooltipText}>Drag map to adjust pin</Text>
                </View>
              )}
            </View>

            {/* GPS FLOATING BUTTON */}
            <TouchableOpacity
              style={styles.floatingGpsBtn}
              onPress={handleCurrentLocBtn}
              activeOpacity={0.8}
            >
              {isLocating ? (
                <ActivityIndicator size="small" color={ColorTokens.deepBerry} />
              ) : (
                <Navigation size={22} color={ColorTokens.deepBerry} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // MOBILE RESPONSIVE LAYOUT
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={ColorTokens.deepBerry} />

      {/* TOP HEADER */}
      <View
        style={[
          styles.header,
          { paddingTop: headerTopInset, height: undefined, minHeight: 64 },
        ]}
      >
        <TouchableOpacity
          style={styles.backCircle}
          onPress={() => {
            safeHapticImpact();
            if (onBack) onBack();
            else router.back();
          }}
          activeOpacity={0.7}
          delayPressIn={0}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.brandRow}>
          <Sparkles size={16} color="#FFD700" />
          <Text style={styles.headerTitle}>Pin your location</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* ON-SCREEN ERROR DISPLAY BANNER */}
      {errorMessage && (
        <View style={styles.errorBanner}>
          <AlertTriangle size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.errorText} numberOfLines={2}>
            {errorMessage}
          </Text>
          <TouchableOpacity onPress={() => setErrorMessage(null)} style={styles.errorClose}>
            <X size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}

      {/* MAP AREA: LEAFLET REAL MAPS */}
      <View style={styles.mapWrapper}>
        {Platform.OS === 'web' ? (
          <iframe
            id="leaflet-web-iframe"
            srcDoc={LEAFLET_HTML}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
            }}
          />
        ) : WebView ? (
          <WebView
            ref={webViewRef}
            source={{ html: LEAFLET_HTML }}
            style={StyleSheet.absoluteFillObject}
            onMessage={handleNativeWebViewMessage}
            javaScriptEnabled
            domStorageEnabled
            scrollEnabled={false}
            bounces={false}
          />
        ) : (
          <View style={styles.fallbackMapBox}>
            <Text style={styles.fallbackText}>Loading map...</Text>
          </View>
        )}

        {/* FLOATING SEARCH BAR over map */}
        <View style={styles.floatingSearch}>
          <TouchableOpacity
            onPress={handleSearchSubmit}
            activeOpacity={0.7}
            disabled={isSearching}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            {isSearching ? (
              <ActivityIndicator size="small" color={ColorTokens.deepBerry} style={{ marginRight: 8 }} />
            ) : (
              <Search size={18} color={ColorTokens.deepBerry} style={{ marginRight: 8 }} />
            )}
          </TouchableOpacity>
          <TextInput
            style={styles.floatingSearchInput}
            placeholder="Search address or landmark..."
            placeholderTextColor={ColorTokens.mutedText}
            value={searchQuery}
            onChangeText={(txt) => {
              setSearchQuery(txt);
              if (!isSearchViewOpen) setIsSearchViewOpen(true);
            }}
            onFocus={() => setIsSearchViewOpen(true)}
            returnKeyType="search"
            onSubmitEditing={handleSearchSubmit}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                setIsSearchViewOpen(false);
              }}
              style={{ padding: 4 }}
            >
              <X size={16} color={ColorTokens.mutedText} />
            </TouchableOpacity>
          )}
        </View>

        {/* OPEN SEARCH VIEW OVERLAY */}
        {isSearchViewOpen && (
          <View style={styles.searchOverlayView}>
            <View style={styles.searchOverlayHeader}>
              <Text style={styles.searchOverlayTitle}>SEARCH LOCATION</Text>
              <TouchableOpacity
                onPress={() => setIsSearchViewOpen(false)}
                style={styles.searchCloseBtn}
              >
                <X size={16} color={ColorTokens.text} />
              </TouchableOpacity>
            </View>

            <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }}>
              <TouchableOpacity
                style={styles.searchCurrentLocItem}
                onPress={handleCurrentLocBtn}
                activeOpacity={0.7}
              >
                <View style={styles.currentLocIconBg}>
                  <Navigation size={18} color="#FFFFFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.currentLocItemTitle}>Use Current Location</Text>
                  <Text style={styles.currentLocItemSub}>Using high precision GPS</Text>
                </View>
              </TouchableOpacity>

              {searchResults.length > 0 && (
                <View style={styles.searchGroup}>
                  <Text style={styles.searchGroupLabel}>SEARCH RESULTS</Text>
                  {searchResults.map((item, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.searchResultItem}
                      onPress={() => selectLocation(item)}
                      activeOpacity={0.7}
                    >
                      <MapPin size={18} color={ColorTokens.deepBerry} style={{ marginRight: 12 }} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.resultItemTitle}>{item.title}</Text>
                        <Text style={styles.resultItemSub}>{item.detail}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <View style={styles.searchGroup}>
                <Text style={styles.searchGroupLabel}>POPULAR AREAS</Text>
                {POPULAR_LOCATIONS.map((loc, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.searchResultItem}
                    onPress={() =>
                      selectLocation({
                        title: loc.name,
                        detail: loc.detail,
                        lat: loc.lat,
                        lng: loc.lng,
                      })
                    }
                    activeOpacity={0.7}
                  >
                    <Building2 size={18} color={ColorTokens.plum} style={{ marginRight: 12 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.resultItemTitle}>{loc.name}</Text>
                      <Text style={styles.resultItemSub}>{loc.detail}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* CENTERED FIXED PIN */}
        {!isSearchViewOpen && (
          <View style={styles.centeredPinWrapper} pointerEvents="none">
            <View style={styles.berryPinHead}>
              <MapPin size={26} color="#FFFFFF" />
            </View>
            <View style={styles.pinTipShadow} />
            {isGeocoding ? (
              <View style={styles.dragTooltip}>
                <ActivityIndicator size="small" color="#FFFFFF" />
              </View>
            ) : (
              <View style={styles.dragTooltip}>
                <Text style={styles.dragTooltipText}>Drag map to adjust</Text>
              </View>
            )}
          </View>
        )}

        {/* GPS CURRENT LOCATION BUTTON */}
        {!isSearchViewOpen && (
          <TouchableOpacity
            style={styles.floatingGpsBtn}
            onPress={handleCurrentLocBtn}
            activeOpacity={0.8}
            delayPressIn={0}
          >
            {isLocating ? (
              <ActivityIndicator size="small" color={ColorTokens.deepBerry} />
            ) : (
              <Navigation size={22} color={ColorTokens.deepBerry} />
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* BOTTOM SHEET CONFIRMATION CARD */}
      {!isSearchViewOpen && (
        <View style={[styles.bottomSheet, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <View style={styles.dragHandle} />

          <View style={styles.bottomSheetHeader}>
            <Text style={styles.sectionLabel}>YOUR DELIVERY LOCATION</Text>
            <TouchableOpacity onPress={handleCurrentLocBtn} activeOpacity={0.7}>
              <Text style={styles.useCurrentLocText}>Use current location →</Text>
            </TouchableOpacity>
          </View>

          {/* SELECTED ADDRESS CARD */}
          <View style={styles.addressCard}>
            <View style={styles.locationIconBg}>
              <MapPin size={22} color={ColorTokens.deepBerry} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.selectedTitle} numberOfLines={2}>
                {pinAddress}
              </Text>
              <Text style={styles.selectedSub} numberOfLines={2}>
                {pinSubAddress}
              </Text>
              <Text style={styles.entranceInstruction}>
                Move the pin to your exact entrance
              </Text>
            </View>
          </View>

          {/* PRIMARY CTA */}
          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={handleConfirm}
            activeOpacity={0.9}
            disabled={isConfirming || isGeocoding}
            delayPressIn={0}
          >
            {isConfirming ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.confirmBtnText}>Confirm Location →</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // PC DESKTOP STYLES
  desktopContainer: {
    flex: 1,
    backgroundColor: ColorTokens.warmIvory,
    width: '100%',
    height: '100%',
  },
  desktopHeader: {
    backgroundColor: ColorTokens.deepBerry,
    height: 64,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  desktopHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  desktopHeaderTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  desktopGpsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  desktopGpsPillText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  desktopBody: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
  },
  desktopSidebar: {
    width: 440,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: ColorTokens.border,
    padding: 24,
    justifyContent: 'space-between',
  },
  desktopSearchBox: {
    backgroundColor: ColorTokens.softCream,
    borderRadius: 16,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    marginBottom: 20,
  },
  desktopMapSection: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  container: {
    flex: 1,
    backgroundColor: ColorTokens.warmIvory,
  },
  header: {
    backgroundColor: ColorTokens.deepBerry,
    paddingTop: 12,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  errorBanner: {
    backgroundColor: '#D92D20',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 20,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  errorClose: {
    padding: 4,
    marginLeft: 8,
  },
  mapWrapper: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  fallbackMapBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ColorTokens.softCream,
  },
  fallbackText: {
    color: ColorTokens.mutedText,
    fontSize: 14,
    fontWeight: '600',
  },
  floatingSearch: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 10,
  },
  floatingSearchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: ColorTokens.text,
    borderWidth: 0,
  },
  searchOverlayView: {
    position: 'absolute',
    top: 72,
    left: 14,
    right: 14,
    bottom: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    zIndex: 25,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  searchOverlayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: ColorTokens.border,
  },
  searchOverlayTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: ColorTokens.mutedText,
    letterSpacing: 1,
  },
  searchCloseBtn: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: ColorTokens.softCream,
  },
  searchCurrentLocItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColorTokens.softCream,
    padding: 12,
    borderRadius: 14,
    marginBottom: 16,
    gap: 12,
  },
  currentLocIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ColorTokens.deepBerry,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentLocItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ColorTokens.deepBerry,
  },
  currentLocItemSub: {
    fontSize: 12,
    color: ColorTokens.mutedText,
  },
  searchGroup: {
    marginBottom: 16,
  },
  searchGroupLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: ColorTokens.mutedText,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F5EFF3',
  },
  resultItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: ColorTokens.text,
  },
  resultItemSub: {
    fontSize: 12,
    color: ColorTokens.mutedText,
    marginTop: 2,
  },
  centeredPinWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  glowingRing: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(242, 127, 120, 0.35)',
    marginTop: -80,
  },
  berryPinHead: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: ColorTokens.deepBerry,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ColorTokens.deepBerry,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    marginTop: -80,
  },
  pinTipShadow: {
    width: 14,
    height: 4,
    borderRadius: 7,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    marginTop: -76,
  },
  dragTooltip: {
    backgroundColor: ColorTokens.text,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: -68,
    minWidth: 44,
    alignItems: 'center',
  },
  dragTooltipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  floatingGpsBtn: {
    position: 'absolute',
    bottom: 20,
    right: 16,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: ColorTokens.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 10,
  },
  bottomSheet: {
    backgroundColor: ColorTokens.warmIvory,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: ColorTokens.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  dragHandle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: ColorTokens.border,
    alignSelf: 'center',
    marginBottom: 14,
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: ColorTokens.mutedText,
    letterSpacing: 1,
  },
  useCurrentLocText: {
    fontSize: 12,
    fontWeight: '700',
    color: ColorTokens.deepBerry,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: ColorTokens.border,
    gap: 12,
  },
  locationIconBg: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: ColorTokens.softCoral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: ColorTokens.text,
  },
  selectedSub: {
    fontSize: 13,
    color: ColorTokens.mutedText,
    marginTop: 2,
  },
  entranceInstruction: {
    fontSize: 12,
    fontWeight: '700',
    color: ColorTokens.plum,
    marginTop: 6,
  },
  confirmBtn: {
    backgroundColor: ColorTokens.deepBerry,
    borderRadius: 18,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
