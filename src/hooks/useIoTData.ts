import { useState, useEffect, useMemo } from 'react';
import type { Device, DeviceStatus, ActivityLog } from '../types/iot';
import { generateDevices, generateRecentActivity, generateTelemetry } from '../mocks/mockProvider';
import { useOrgStore } from '../store/useOrgStore';

interface UseIoTDataResult {
    devices: Device[];
    filteredDevices: Device[];
    recentActivity: ActivityLog[];
    telemetryHistory: any[];
    stats: {
        total: number;
        active: number;
        inactive: number;
        maintenance: number;
        avgSignal: number;
        totalDevices: number;
        activeDevices: number;
        alerts24h: number;
    };
    filter: DeviceStatus | 'all';
    setFilter: (filter: any) => void;
    search: string;
    setSearchQuery: (term: string) => void;
    refresh: () => void;
    isLoading: boolean;
}

export function useIoTData(): UseIoTDataResult {
    const { currentOrg, isLoading } = useOrgStore();
    const [devices, setDevices] = useState<Device[]>([]);
    const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);
    const [telemetryHistory, setTelemetryHistory] = useState<any[]>([]);
    const [filter, setFilter] = useState<{ status?: DeviceStatus | 'all' }>({});
    const [search, setSearch] = useState('');

    // Simulate data fetching when Org changes
    useEffect(() => {
        if (!isLoading) {
            const mockDevices = generateDevices(50, currentOrg.id); // Generate 50 devices per org
            setDevices(mockDevices);
            setRecentActivity(generateRecentActivity(10, mockDevices));
            setTelemetryHistory(generateTelemetry(24));
        }
    }, [currentOrg, isLoading]);

    const filteredDevices = useMemo(() => {
        return devices.filter((device) => {
            const statusFilter = filter.status;
            const matchesFilter = !statusFilter || statusFilter === 'all' || device.status === statusFilter;
            const matchesSearch = device.name.toLowerCase().includes(search.toLowerCase()) ||
                device.serialNumber.toLowerCase().includes(search.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [devices, filter, search]);

    const stats = useMemo(() => {
        const active = devices.filter(d => d.status === 'active').length;
        const inactive = devices.filter(d => d.status === 'inactive').length;
        const maintenance = devices.filter(d => d.status === 'maintenance').length;
        const avgSignal = devices.reduce((acc, d) => acc + d.signalStrength, 0) / (devices.length || 1);

        return {
            total: devices.length,
            active,
            inactive,
            maintenance,
            avgSignal,
            // Aliases for compatibility
            totalDevices: devices.length,
            activeDevices: active,
            alerts24h: Math.floor(devices.length * 0.2) // Mock alert count
        };
    }, [devices]);

    const refresh = () => {
        const mockDevices = generateDevices(50, currentOrg.id);
        setDevices(mockDevices);
        setRecentActivity(generateRecentActivity(10, mockDevices));
        setTelemetryHistory(generateTelemetry(24));
    };

    return {
        devices,
        filteredDevices,
        recentActivity,
        telemetryHistory,
        stats,
        filter: filter.status || 'all',
        setFilter,
        search,
        setSearchQuery: setSearch,
        refresh,
        isLoading
    };
}

