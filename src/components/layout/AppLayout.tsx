import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Server,
    Settings as SettingsIcon,
    Bell,
    ChevronDown,
    Menu,
    Search,
    LogOut,
    User
} from 'lucide-react';
import { useOrgStore } from '../../store/useOrgStore';
import { MOCK_ORGS } from '../../mocks/mockProvider';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';

export default function AppLayout() {
    const { currentOrg, setOrganization, isLoading } = useOrgStore();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

    return (
        <div className="flex h-screen w-full bg-background text-foreground overflow-hidden selection:bg-primary/20">
            {/* Glass Backdrop Blur & Gradient Overlay */}
            <div className="fixed inset-0 pointer-events-none z-[-1] bg-noise opacity-5"></div>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: isSidebarOpen ? 280 : 0,
                    opacity: isSidebarOpen ? 1 : 0
                }}
                className={cn(
                    "fixed inset-y-0 left-0 z-50 transform md:relative overflow-hidden border-r border-white/10 bg-black/20 backdrop-blur-xl shadow-2xl flex flex-col"
                )}
            >
                <div className="flex h-16 items-center border-b border-white/10 px-6">
                    <div className="flex items-center gap-3 font-bold text-xl text-primary tracking-tight">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 ring-1 ring-white/10">
                            IoT
                        </div>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">Nexus</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    <div className="px-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-2 mb-2 block opacity-70">
                            Organization
                        </label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="glass" className="w-full justify-between h-12 bg-white/5 hover:bg-white/10 border-white/5">
                                    <span className="truncate">{currentOrg.name}</span>
                                    <ChevronDown className="h-4 w-4 opacity-50" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[240px] bg-black/80 backdrop-blur-xl border-white/10 text-white">
                                <DropdownMenuLabel>Switch Organization</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-white/10" />
                                {MOCK_ORGS.map(org => (
                                    <DropdownMenuItem
                                        key={org.id}
                                        onClick={() => setOrganization(org.id)}
                                        className={cn("cursor-pointer focus:bg-primary/20 focus:text-white", currentOrg.id === org.id && "bg-primary/20")}
                                    >
                                        {org.name}
                                        {currentOrg.id === org.id && <Badge variant="glass" className="ml-auto text-[10px] h-5">Active</Badge>}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-4 mb-2 block opacity-70">
                            Menu
                        </label>
                        <div className="space-y-1">
                            <NavItem to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" />
                            <NavItem to="/devices" icon={<Server size={18} />} label="Devices" />
                            <NavItem to="/settings" icon={<SettingsIcon size={18} />} label="Settings" />
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-white/10 bg-black/10">
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-white hover:bg-white/5 gap-3">
                        <LogOut size={18} />
                        Log Out
                    </Button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Navbar */}
                <header className="h-16 border-b border-white/10 bg-black/10 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-40 sticky top-0">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="text-muted-foreground hover:text-white hover:bg-white/10"
                        >
                            <Menu size={20} />
                        </Button>
                        <div className="hidden md:flex text-sm text-muted-foreground items-center gap-2">
                            <span className="opacity-50">/</span>
                            <span className="font-medium text-foreground">
                                {location.pathname === '/' ? 'Dashboard' :
                                    location.pathname === '/devices' ? 'Device Management' :
                                        'Settings'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden sm:block">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                            <Input
                                type="text"
                                placeholder="Global search..."
                                className="w-64 pl-9 bg-white/5 border-white/10 focus:bg-white/10 transition-all hover:bg-white/10 scroll-py-20"
                            />
                            <div className="absolute right-2 top-2 hidden lg:flex">
                                <Badge variant="outline" className="h-5 px-1.5 text-[10px] border-white/10 text-muted-foreground">⌘K</Badge>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="relative hover:bg-white/10">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background animate-pulse"></span>
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="pl-2 pr-1 gap-2 rounded-full hover:bg-white/10 border border-transparent hover:border-white/5">
                                    <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium text-xs shadow-inner">
                                        JS
                                    </div>
                                    <span className="text-sm font-medium hidden md:block">John Smith</span>
                                    <ChevronDown className="h-3 w-3 opacity-50 hidden md:block" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-black/80 backdrop-blur-xl border-white/10 text-white">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuItem className="focus:bg-white/10 cursor-pointer">
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="focus:bg-white/10 cursor-pointer">
                                    <SettingsIcon className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuItem className="focus:bg-red-500/20 focus:text-red-400 cursor-pointer">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-6 scrollbar-hide">
                    {isLoading && (
                        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-50 flex items-center justify-center">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent"
                            />
                        </div>
                    )}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="h-full"
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

function NavItem({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all group relative overflow-hidden",
                isActive
                    ? "text-white"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
            )}
        >
            {({ isActive }) => (
                <>
                    {isActive && (
                        <motion.div
                            layoutId="activeNav"
                            className="absolute inset-0 bg-primary/20 border-l-2 border-primary"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />
                    )}
                    <span className="relative z-10 group-hover:scale-110 transition-transform duration-200">{icon}</span>
                    <span className="relative z-10">{label}</span>
                </>
            )}
        </NavLink>
    );
}
