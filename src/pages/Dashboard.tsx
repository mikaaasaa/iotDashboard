import { useIoTData } from '../hooks/useIoTData';
import { MetricCard } from '../components/dashboard/MetricCard';
import { motion } from 'framer-motion';
import {
    Activity,
    Wifi,
    Server,
    AlertTriangle,
    Clock,
    CheckCircle2,
    XCircle,
    AlertOctagon
} from 'lucide-react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { formatDistanceToNow } from 'date-fns';

export default function Dashboard() {
    const { stats, telemetryHistory, recentActivity } = useIoTData();

    const deviceStatusData = [
        { name: 'Active', value: stats.activeDevices, color: '#10b981' },
        { name: 'Inactive', value: stats.totalDevices - stats.activeDevices, color: '#64748b' },
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <motion.div
            className="space-y-6"
            variants={container}
            initial="hidden"
            animate="show"
        >
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
                <div className="text-sm text-muted-foreground bg-primary/10 px-3 py-1 rounded-full animate-pulse">
                    Live Updates Active
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Total Devices"
                    value={stats.totalDevices}
                    icon={<Server />}
                    change={12}
                    trend="up"
                />
                <MetricCard
                    title="Active Now"
                    value={stats.activeDevices}
                    icon={<Activity />}
                    change={5}
                    trend="up"
                />
                <MetricCard
                    title="Avg Signal"
                    value={`${Math.round(stats.avgSignal * 20)}%`}
                    icon={<Wifi />}
                    change={2}
                    trend="down"
                />
                <MetricCard
                    title="Alerts (24h)"
                    value={stats.alerts24h}
                    icon={<AlertTriangle />}
                    className="border-red-500/20 bg-red-500/5 text-red-500"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-7">
                <Card glass className="col-span-4 md:col-span-4" hoverEffect>
                    <CardHeader>
                        <CardTitle>Telemetry Trends</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <AreaChart data={telemetryHistory}>
                                <defs>
                                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${Math.round(value)}`} />
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" vertical={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="temp" name="Temperature" stroke="#8884d8" fillOpacity={1} fill="url(#colorTemp)" />
                                <Area type="monotone" dataKey="power" name="Power Usage" stroke="#10b981" fillOpacity={1} fill="url(#colorPower)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <div className="col-span-3 space-y-4">
                    <Card glass hoverEffect className="h-[200px]">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Device Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between h-full">
                                <div className="w-32 h-32">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={deviceStatusData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={40}
                                                outerRadius={55}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {deviceStatusData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="space-y-2 flex-1 pl-4">
                                    {deviceStatusData.map((entry, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                            <span className="text-sm font-medium">{entry.value}</span>
                                            <span className="text-xs text-muted-foreground">{entry.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card glass hoverEffect className="h-[230px] overflow-hidden flex flex-col">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" />
                                Recent Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-auto pr-2 custom-scrollbar">
                            <div className="space-y-4">
                                {recentActivity.map((log) => (
                                    <div key={log.id} className="flex items-start gap-3 text-sm pb-2 border-b border-white/5 last:border-0">
                                        {log.type === 'error' && <XCircle className="w-4 h-4 text-red-500 mt-0.5" />}
                                        {log.type === 'warning' && <AlertOctagon className="w-4 h-4 text-yellow-500 mt-0.5" />}
                                        {log.type === 'success' && <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />}
                                        {log.type === 'info' && <Activity className="w-4 h-4 text-blue-500 mt-0.5" />}

                                        <div className="flex-1 space-y-0.5">
                                            <p className="font-medium leading-none">{log.message}</p>
                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                <span>{log.deviceName}</span>
                                                <span>{formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
}
