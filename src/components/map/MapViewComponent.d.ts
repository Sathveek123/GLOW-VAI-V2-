import React from 'react';

export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export const PROVIDER_DEFAULT: string;
export class MapView extends React.Component<any, any> {
  animateToRegion(region: Region, duration?: number): void;
}
export const Marker: React.FC<any>;
export const Polyline: React.FC<any>;

export default MapView;
