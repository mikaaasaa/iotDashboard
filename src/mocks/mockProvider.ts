import type { Device, Organization, TelemetryPoint, ActivityLog } from "../types/iot";
import { subMinutes, subHours } from "date-fns";

export const MOCK_ORGS: Organization[] = [
    { id: "org-1", name: "Acme Corp", slug: "acme-corp" },
    { id: "org-2", name: "Global Industries", slug: "global-ind" },
    { id: "org-3", name: "TechNova", slug: "technova" },
];

const DEVICE_TYPES = ["sensor", "gateway", "actuator"] as const;
const ACTIVITY_TYPES = ["info", "warning", "error", "success"] as const;
const MESSAGES = {
    info: ["Firmware updated", "Configuration changed", "Maintenance scheduled"],
    warning: ["High temperature detected", "Weak signal", "High latency"],
    error: ["Device offline", "Sensor failure", "Connection lost"],
    success: ["Device connected", "Calibration complete", "Self-test passed"]
};

// Seeded random number generator
function seededRandom(seed: number) {
    let state = seed;
    return function () {
        state = (state * 1664525 + 1013904223) % 4294967296;
        return state / 4294967296;
    };
}

export function generateDevices(count: number, orgId: string): Device[] {
    const seed = orgId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = seededRandom(seed);
    const devices: Device[] = [];

    for (let i = 0; i < count; i++) {
        const isActive = random() > 0.15;
        const lastSeenDate = isActive
            ? subMinutes(new Date(), random() * 10)
            : subMinutes(new Date(), 60 + random() * 10000);

        devices.push({
            id: `dev-${orgId}-${i}`,
            orgId,
            name: `Device-${i.toString().padStart(4, "0")}`,
            serialNumber: `SN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            type: DEVICE_TYPES[Math.floor(random() * DEVICE_TYPES.length)],
            status: isActive ? "active" : random() > 0.5 ? "inactive" : "maintenance",
            lastSeen: lastSeenDate.toISOString(),
            firmwareVersion: `v${Math.floor(random() * 5)}.${Math.floor(random() * 10)}`,
            batteryLevel: Math.floor(random() * 100),
            signalStrength: Math.floor(random() * 5),
            location: {
                lat: 40.7128 + (random() - 0.5) * 0.1,
                lng: -74.006 + (random() - 0.5) * 0.1,
            },
            metrics: {
                temperature: 20 + random() * 15,
                humidity: 30 + random() * 40,
                pressure: 1000 + random() * 50,
            },
        });
    }
    return devices;
}

export function generateTelemetry(points: number) {
    const now = new Date();
    return Array.from({ length: points }, (_, i) => {
        const time = subHours(now, points - 1 - i);
        return {
            time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            temp: 20 + Math.random() * 10 + (Math.sin(i / 5) * 5),
            humidity: 40 + Math.random() * 20 + (Math.cos(i / 5) * 10),
            power: 100 + Math.random() * 50 + (i > 12 ? 50 : 0) // Simulate generic peak
        };
    });
}

export function generateRecentActivity(count: number, devices: Device[]): ActivityLog[] {
    const now = new Date();
    const logs: ActivityLog[] = [];

    for (let i = 0; i < count; i++) {
        const device = devices[Math.floor(Math.random() * devices.length)];
        const type = ACTIVITY_TYPES[Math.floor(Math.random() * ACTIVITY_TYPES.length)];
        const messages = MESSAGES[type];

        logs.push({
            id: `log-${i}`,
            deviceId: device?.id || "unknown",
            deviceName: device?.name || "Unknown Device",
            type,
            message: messages[Math.floor(Math.random() * messages.length)],
            timestamp: subMinutes(now, i * 15 + Math.random() * 10).toISOString()
        });
    }
    return logs;
}
