import React from 'react';
import { useIoTData } from '../hooks/useIoTData';
import type { DeviceStatus } from '../types/iot';
import {
    Search,
    Filter,
    MoreHorizontal,
    Battery,
    BatteryCharging,
    RefreshCw,
    Download
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '../components/ui/table';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '../components/ui/dropdown-menu';
import { Card } from '../components/ui/card';
import { motion } from 'framer-motion';

import { useNavigate } from 'react-router-dom';

export default function DeviceList() {
    const { filteredDevices, setFilter, setSearchQuery, isLoading } = useIoTData();
    const [statusFilter, setStatusFilter] = React.useState<DeviceStatus | 'all'>('all');
    const navigate = useNavigate();

    const handleStatusFilter = (status: DeviceStatus | 'all') => {
        setStatusFilter(status);
        if (status === 'all') {
            setFilter({});
        } else {
            setFilter({ status });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Device Management</h2>
                    <p className="text-muted-foreground">Manage and monitor your IoT fleet.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="gap-2">
                        <Download size={16} />
                        Export
                    </Button>
                    <Button className="gap-2">
                        <RefreshCw size={16} />
                        Sync Now
                    </Button>
                </div>
            </div>

            <Card glass className="border-none shadow-none bg-transparent">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, ID, or IP..."
                            className="pl-9 bg-card/50 backdrop-blur-sm"
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                        <Button
                            variant={statusFilter === 'all' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => handleStatusFilter('all')}
                            className="rounded-full"
                        >
                            All
                        </Button>
                        <Button
                            variant={statusFilter === 'active' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => handleStatusFilter('active')}
                            className="rounded-full text-green-500 hover:text-green-600 hover:bg-green-500/10"
                        >
                            Active
                        </Button>
                        <Button
                            variant={statusFilter === 'inactive' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => handleStatusFilter('inactive')}
                            className="rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-500/10"
                        >
                            Inactive
                        </Button>
                        <Button
                            variant={statusFilter === 'maintenance' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => handleStatusFilter('maintenance')}
                            className="rounded-full text-yellow-500 hover:text-yellow-600 hover:bg-yellow-500/10"
                        >
                            Maintenance
                        </Button>
                        <Button variant="outline" size="icon" className="ml-2">
                            <Filter size={16} />
                        </Button>
                    </div>
                </div>

                <div className="rounded-xl border border-white/10 overflow-hidden bg-card/40 backdrop-blur-md shadow-2xl">
                    <Table>
                        <TableHeader className="bg-white/5">
                            <TableRow className="hover:bg-transparent border-white/5">
                                <TableHead className="w-[200px] text-white font-semibold">Device Name</TableHead>
                                <TableHead className="text-white font-semibold">Type</TableHead>
                                <TableHead className="text-white font-semibold">Status</TableHead>
                                <TableHead className="text-white font-semibold">Battery</TableHead>
                                <TableHead className="text-white font-semibold">Signal</TableHead>
                                <TableHead className="text-white font-semibold">Last Seen</TableHead>
                                <TableHead className="text-right text-white font-semibold">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                        Loading devices...
                                    </TableCell>
                                </TableRow>
                            ) : filteredDevices.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                        No devices found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredDevices.map((device) => (
                                    <TableRow
                                        key={device.id}
                                        className="group hover:bg-white/5 border-white/5 transition-colors cursor-pointer"
                                        onClick={() => navigate(`/devices/${device.id}`)}
                                    >
                                        <TableCell className="font-medium">
                                            <div className="flex flex-col">
                                                <span className="text-foreground">{device.name}</span>
                                                <span className="text-xs text-muted-foreground">{device.serialNumber}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize bg-white/5 border-white/10">
                                                {device.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={device.status} />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {device.batteryLevel > 20 ? (
                                                    <Battery className="w-4 h-4 text-muted-foreground" />
                                                ) : (
                                                    <BatteryCharging className="w-4 h-4 text-red-500" />
                                                )}
                                                <span className={device.batteryLevel < 20 ? "text-red-500 font-bold" : "text-muted-foreground"}>
                                                    {device.batteryLevel}%
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <SignalStrength strength={device.signalStrength} />
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {formatDistanceToNow(new Date(device.lastSeen), { addSuffix: true })}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-black/90 border-white/10">
                                                    <DropdownMenuItem className="cursor-pointer" onClick={(e) => { e.stopPropagation(); navigate(`/devices/${device.id}`); }}>View Details</DropdownMenuItem>
                                                    <DropdownMenuItem className="cursor-pointer">View Telemetry</DropdownMenuItem>
                                                    <DropdownMenuItem className="cursor-pointer text-yellow-500">Reboot Device</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </motion.div>
    );
}

function StatusBadge({ status }: { status: DeviceStatus }) {
    const styles = {
        active: "bg-green-500/15 text-green-500 hover:bg-green-500/25 border-green-500/20",
        inactive: "bg-gray-500/15 text-gray-500 hover:bg-gray-500/25 border-gray-500/20",
        maintenance: "bg-yellow-500/15 text-yellow-500 hover:bg-yellow-500/25 border-yellow-500/20",
    };

    return (
        <Badge className={`capitalize border ${styles[status]} shadow-none`}>
            {status}
        </Badge>
    );
}

function SignalStrength({ strength }: { strength: number }) {
    return (
        <div className="flex gap-0.5">
            {[0, 1, 2, 3, 4].map((bar) => (
                <div
                    key={bar}
                    className={`w-1 h-3 rounded-sm transition-all ${bar < strength ? 'bg-primary' : 'bg-muted/30'
                        }`}
                />
            ))}
        </div>
    );
}
