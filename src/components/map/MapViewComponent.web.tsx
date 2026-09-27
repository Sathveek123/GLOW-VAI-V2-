import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export const PROVIDER_DEFAULT = 'default';

export const MapView: React.FC<any> = ({ children, style, initialRegion, onRegionChangeComplete }) => {
  const lat = initialRegion?.latitude || 16.5062;
  const lng = initialRegion?.longitude || 80.6480;

  // Google Maps embed URL centered on active coordinates
  const mapEmbedUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;

  return (
    <View style={[styles.mapContainer, style]}>
      {Platform.OS === 'web' ? (
        // Web Interactive Google Maps iframe
        <iframe
          title="Google Maps"
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0, width: '100%', height: '100%' }}
          src={mapEmbedUrl}
          allowFullScreen
        />
      ) : (
        <View style={styles.webMapFallback}>
          <Text style={styles.webMapText}>📍 Google Maps (Vijayawada 16.5062, 80.6480)</Text>
        </View>
      )}
      {children}
    </View>
  );
};

export const Marker: React.FC<any> = ({ children }) => {
  return <View style={styles.markerFallback}>{children}</View>;
};

export const Polyline: React.FC<any> = () => {
  return null;
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
  },
  webMapFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  webMapText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '600',
  },
  markerFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MapView;
