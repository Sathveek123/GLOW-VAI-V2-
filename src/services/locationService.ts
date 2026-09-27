/**
 * High-Accuracy Location & Geocoding Service for GlowVAI V2
 */

import * as Location from 'expo-location';
import { Platform } from 'react-native';
import { getCountryByIso, CountryCodeItem } from '../data/countryCodes';
import { logTelemetryEvent } from './telemetryService';
import { getBackendBaseUrl, getCloudBackendUrl } from './apiConfig';
import { storage } from '../utils/storage';

export interface UserLocationResult {
  latitude: number;
  longitude: number;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  countryCode?: string | null;
  postalCode?: string | null;
  formattedAddress?: string;
  detectedCountryItem: CountryCodeItem;
}

export interface PermissionStatusResult {
  status: 'granted' | 'denied' | 'restricted' | 'undetermined';
  canAskAgain: boolean;
}

export const LOCATION_STORAGE_KEY = 'glowvai_active_location';
const locationListeners = new Set<(location: string) => void>();

/**
 * Subscribe to real-time location updates across web and mobile headers
 */
export const subscribeToLocationChange = (callback: (location: string) => void) => {
  locationListeners.add(callback);
  return () => {
    locationListeners.delete(callback);
  };
};

/**
 * Saves and broadcasts active selected delivery location
 */
export const saveActiveLocation = async (
  address: string,
  lat?: number,
  lng?: number
): Promise<void> => {
  if (!address || !address.trim()) return;
  const cleanAddr = address.trim();
  try {
    const locData = JSON.stringify({ address: cleanAddr, lat, lng, timestamp: Date.now() });
    await storage.setItem(LOCATION_STORAGE_KEY, cleanAddr);
    await storage.setItem(LOCATION_STORAGE_KEY + '_details', locData);
    locationListeners.forEach((fn) => fn(cleanAddr));
  } catch (err) {
    console.warn('[LocationService] Error saving active location:', err);
  }
};

/**
 * Retrieves stored active delivery location
 */
export const getActiveLocation = async (): Promise<string> => {
  try {
    const saved = await storage.getItem(LOCATION_STORAGE_KEY);
    if (saved && saved.trim()) return saved.trim();
  } catch (_) {}
  return 'Payakapuram, Vijayawada';
};

/**
 * Checks existing foreground permission status without prompting
 */
export const checkLocationPermission = async (): Promise<PermissionStatusResult> => {
  try {
    const res = await Location.getForegroundPermissionsAsync();
    return {
      status: res.status as any,
      canAskAgain: res.canAskAgain,
    };
  } catch (err) {
    console.warn('[LocationService] Failed to check permission:', err);
    return { status: 'undetermined', canAskAgain: true };
  }
};

/**
 * Requests real device location permission and prompts high-accuracy GPS if needed
 */
export const requestDeviceLocationPermission = async (): Promise<boolean> => {
  try {
    const serviceEnabled = await Location.hasServicesEnabledAsync();
    if (!serviceEnabled) {
      await Location.enableNetworkProviderAsync().catch(() => null);
    }

    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === Location.PermissionStatus.GRANTED;
  } catch (err) {
    console.warn('[LocationService] Permission request error:', err);
    return false;
  }
};

let cachedLocation: { data: UserLocationResult; timestamp: number } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches GPS coordinates with reverse geocoding & Payakapuram fallback
 */
export const getDeviceCurrentLocation = async (
  timeoutMs: number = 5000
): Promise<UserLocationResult> => {
  const defaultFallback: UserLocationResult = {
    latitude: 16.5417,
    longitude: 80.6425,
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    country: 'India',
    countryCode: 'IN',
    postalCode: '520015',
    formattedAddress: 'Payakapuram, Vijayawada',
    detectedCountryItem: getCountryByIso('IN'),
  };

  // Return cached result immediately if within TTL
  if (cachedLocation && Date.now() - cachedLocation.timestamp < CACHE_TTL_MS) {
    return cachedLocation.data;
  }

  try {
    const isGranted = await requestDeviceLocationPermission();
    if (!isGranted) {
      return defaultFallback;
    }

    let position = await Location.getLastKnownPositionAsync().catch(() => null);

    if (!position) {
      const positionPromise = Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      const timeoutPromise = new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), timeoutMs)
      );

      position = await Promise.race([positionPromise, timeoutPromise]);
    }

    if (!position) {
      cachedLocation = { data: defaultFallback, timestamp: Date.now() };
      return defaultFallback;
    }

    const { latitude, longitude } = position.coords;

    // Web Nominatim High-Accuracy Reverse Geocoding
    if (Platform.OS === 'web') {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 3000);
        const nomRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          { signal: controller.signal }
        ).catch(() => null);
        clearTimeout(timer);

        if (nomRes?.ok) {
          const nomData = await nomRes.json();
          const addr = nomData.address || {};
          const suburb = addr.suburb || addr.neighbourhood || addr.residential || addr.road || '';
          const city = addr.city || addr.town || addr.village || addr.county || 'Vijayawada';
          const state = addr.state || 'Andhra Pradesh';
          const formatted = suburb ? `${suburb}, ${city}` : `${city}, ${state}`;

          const res: UserLocationResult = {
            latitude,
            longitude,
            city,
            state,
            country: addr.country || 'India',
            countryCode: addr.country_code ? addr.country_code.toUpperCase() : 'IN',
            postalCode: addr.postcode || '520015',
            formattedAddress: formatted,
            detectedCountryItem: getCountryByIso('IN'),
          };

          saveActiveLocation(formatted, latitude, longitude);
          cachedLocation = { data: res, timestamp: Date.now() };
          return res;
        }
      } catch (_) {}
    }

    // Backend Google Geocoding Proxy
    const candidateUrls = [
      `${getBackendBaseUrl()}/api/maps/geocode?lat=${latitude}&lng=${longitude}`,
      `${getCloudBackendUrl()}/api/maps/geocode?lat=${latitude}&lng=${longitude}`,
    ];

    for (const url of candidateUrls) {
      try {
        const controller = new AbortController();
        const fetchTimeout = setTimeout(() => controller.abort(), 1500);
        const proxyRes = await fetch(url, { signal: controller.signal }).catch(() => null);
        clearTimeout(fetchTimeout);

        if (proxyRes?.ok) {
          const proxyData = await proxyRes.json();
          if (proxyData.formattedAddress) {
            const result: UserLocationResult = {
              latitude,
              longitude,
              city: proxyData.city || 'Vijayawada',
              state: 'Andhra Pradesh',
              country: 'India',
              countryCode: 'IN',
              postalCode: '520015',
              formattedAddress: proxyData.formattedAddress,
              detectedCountryItem: getCountryByIso('IN'),
            };
            saveActiveLocation(result.formattedAddress!, latitude, longitude);
            cachedLocation = { data: result, timestamp: Date.now() };
            return result;
          }
        }
      } catch (_) {}
    }

    // Native Expo Reverse Geocode fallback
    const reverseGeocoded = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    }).catch(() => []);

    if (reverseGeocoded.length > 0) {
      const addr = reverseGeocoded[0]!;
      const isoCode = addr.isoCountryCode || 'IN';
      const detectedCountryItem = getCountryByIso(isoCode);
      const city = addr.city || addr.subregion || addr.district || 'Vijayawada';
      const region = addr.region || 'Andhra Pradesh';
      const formattedAddress = [addr.name || addr.street, city].filter(Boolean).join(', ') || `${city}, ${region}`;

      const result: UserLocationResult = {
        latitude,
        longitude,
        city,
        state: region,
        country: addr.country || 'India',
        countryCode: isoCode,
        postalCode: addr.postalCode || '520015',
        formattedAddress,
        detectedCountryItem,
      };

      saveActiveLocation(formattedAddress, latitude, longitude);
      cachedLocation = { data: result, timestamp: Date.now() };
      return result;
    }

    return defaultFallback;
  } catch (err: any) {
    console.warn('[LocationService] Location fetch note, using calibrated default:', err?.message);
    return defaultFallback;
  }
};

/**
 * Geocodes user inputted address string to Lat/Lng
 */
export const geocodeUserAddress = async (
  addressString: string
): Promise<{ latitude: number; longitude: number; formattedAddress: string }> => {
  const fallback = {
    latitude: 16.5417,
    longitude: 80.6425,
    formattedAddress: addressString || 'Payakapuram, Vijayawada',
  };

  if (!addressString || addressString.trim().length === 0) return fallback;

  const candidateUrls = [
    `${getBackendBaseUrl()}/api/maps/geocode?address=${encodeURIComponent(addressString)}`,
    `http://localhost:4000/api/maps/geocode?address=${encodeURIComponent(addressString)}`,
    `http://10.0.2.2:4000/api/maps/geocode?address=${encodeURIComponent(addressString)}`,
    `${getCloudBackendUrl()}/api/maps/geocode?address=${encodeURIComponent(addressString)}`,
  ];

  for (const url of candidateUrls) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.ok && data.latitude && data.longitude) {
          return {
            latitude: Number(data.latitude),
            longitude: Number(data.longitude),
            formattedAddress: data.formattedAddress || addressString,
          };
        }
      }
    } catch (_) {}
  }

  const lower = addressString.toLowerCase();
  if (lower.includes('benz') || lower.includes('mg road')) {
    return { latitude: 16.5062, longitude: 80.648, formattedAddress: addressString };
  } else if (lower.includes('governorpet') || lower.includes('besant')) {
    return { latitude: 16.5125, longitude: 80.628, formattedAddress: addressString };
  } else if (lower.includes('singh') || lower.includes('payakapuram')) {
    return { latitude: 16.5448, longitude: 80.648, formattedAddress: addressString };
  }

  return fallback;
};
