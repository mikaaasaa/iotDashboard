export type DeviceStatus = "active" | "inactive" | "maintenance";

export interface Organization {
    id: string;
    name: string;
    slug: string;
}

export interface GeoLocation {
    lat: number;
    lng: number;
    address?: string;
}

export interface TelemetryPoint {
    timestamp: string; // ISO string
    value: number;
    metric: string; // e.g., "temperature", "pressure", "humidity"
}

export interface Device {
    id: string;
    orgId: string;
    name: string;
    serialNumber: string;
    type: "sensor" | "gateway" | "actuator";
    status: DeviceStatus;
    lastSeen: string; // ISO string
    firmwareVersion: string;
    batteryLevel: number; // 0-100
    signalStrength: number; // 0-4 (RSSI bars)
    location: GeoLocation;
    metrics: {
        temperature: number;
        humidity: number;
        pressure: number;
    };
}

export interface DashboardMetrics {
    totalDevices: number;
    activeDevices: number;
    criticalAlerts: number;
    avgSignalStrength: number;
    batteryLowCount: number;
    dataThroughput: string; // e.g. "1.2 GB/s"
}

export interface ActivityLog {
    id: string;
    deviceId: string;
    deviceName: string;
    type: "info" | "warning" | "error" | "success";
    message: string;
    timestamp: string;
}

