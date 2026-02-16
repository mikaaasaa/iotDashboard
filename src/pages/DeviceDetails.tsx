import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIoTData } from '../hooks/useIoTData';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Battery,
    Signal,
    Wifi,
    Activity,
    Thermometer,
    Droplets,
    Gauge,
    Clock,
    MapPin,
    Cpu
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import type { Device } from '../types/iot';

export default function DeviceDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { devices, telemetryHistory } = useIoTData();
    const [device, setDevice] = useState<Device | undefined>(undefined);

    useEffect(() => {
        if (devices.length > 0) {
            const found = devices.find(d => d.id === id);
            setDevice(found);
        }
    }, [id, devices]);

    if (!device) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold">Device Not Found</h2>
                    <Button onClick={() => navigate('/devices')}>Back to Devices</Button>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 max-w-7xl mx-auto"
        >
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/devices')} className="hover:bg-white/10">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        {device.name}
                        <Badge variant={device.status === 'active' ? 'success' : device.status === 'inactive' ? 'secondary' : 'warning'} className="text-sm px-2 py-0.5">
                            {device.status}
                        </Badge>
                    </h1>
                    <p className="text-muted-foreground font-mono text-sm mt-1">
                        Serial: {device.serialNumber} • ID: {device.id}
                    </p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <Button variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">
                        Reboot Device
                    </Button>
                    <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/10">
                        Update Firmware
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Status Card */}
                <Card glass hoverEffect className="md:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Activity className="w-5 h-5 text-primary" />
                            Device Health
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                                    <Battery className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Battery Level</p>
                                    <p className="text-2xl font-bold">{device.batteryLevel}%</p>
                                </div>
                            </div>
                            <div className="h-10 w-1 bg-white/10 rounded-full" />
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                                    <Signal className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Signal Strength</p>
                                    <div className="flex gap-0.5 mt-1">
                                        {[0, 1, 2, 3, 4].map((bar) => (
                                            <div
                                                key={bar}
                                                className={`w-1.5 h-4 rounded-sm ${bar < device.signalStrength ? 'bg-blue-500' : 'bg-muted/30'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-white/5">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground flex items-center gap-2">
                                    <Cpu className="w-4 h-4" /> Firmware
                                </span>
                                <span className="font-mono">{device.firmwareVersion}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground flex items-center gap-2">
                                    <Wifi className="w-4 h-4" /> Network
                                </span>
                                <span>WiFi - 5GHz</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground flex items-center gap-2">
                                    <Clock className="w-4 h-4" /> Last Seen
                                </span>
                                <span>{formatDistanceToNow(new Date(device.lastSeen), { addSuffix: true })}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> Location
                                </span>
                                <span>{device.location.lat.toFixed(4)}, {device.location.lng.toFixed(4)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Real-time Metrics */}
                <Card glass hoverEffect className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Gauge className="w-5 h-5 text-primary" />
                            Live Telemetry
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={telemetryHistory}>
                                <defs>
                                    <linearGradient id="colorTempDetails" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" vertical={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="temp" stroke="#8884d8" fillOpacity={1} fill="url(#colorTempDetails)" />
                            </AreaChart>
                        </ResponsiveContainer>
                        <div className="grid grid-cols-3 gap-4 mt-6">
                            <div className="bg-white/5 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-white/10 transition-colors">
                                <Thermometer className="w-6 h-6 text-orange-500 mb-2" />
                                <span className="text-2xl font-bold">{device.metrics.temperature.toFixed(1)}°C</span>
                                <span className="text-xs text-muted-foreground">Temperature</span>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-white/10 transition-colors">
                                <Droplets className="w-6 h-6 text-blue-500 mb-2" />
                                <span className="text-2xl font-bold">{device.metrics.humidity.toFixed(1)}%</span>
                                <span className="text-xs text-muted-foreground">Humidity</span>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-white/10 transition-colors">
                                <Activity className="w-6 h-6 text-purple-500 mb-2" />
                                <span className="text-2xl font-bold">{device.metrics.pressure.toFixed(0)} hPa</span>
                                <span className="text-xs text-muted-foreground">Pressure</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
}
