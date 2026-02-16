import React from 'react';
import { useOrgStore } from '../store/useOrgStore';
import {
    Building2,
    User,
    Bell,
    Shield,
    Save
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function SettingsPage() {
    const { currentOrg } = useOrgStore();
    const [activeTab, setActiveTab] = React.useState<'organization' | 'profile' | 'notifications' | 'security'>('organization');

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your application preferences and organization settings.</p>
            </div>

            {/* Tabs */}
            <div className="border-b">
                <nav className="flex gap-6">
                    <TabButton
                        icon={<Building2 size={16} />}
                        label="Organization"
                        isActive={activeTab === 'organization'}
                        onClick={() => setActiveTab('organization')}
                    />
                    <TabButton
                        icon={<User size={16} />}
                        label="Profile"
                        isActive={activeTab === 'profile'}
                        onClick={() => setActiveTab('profile')}
                    />
                    <TabButton
                        icon={<Bell size={16} />}
                        label="Notifications"
                        isActive={activeTab === 'notifications'}
                        onClick={() => setActiveTab('notifications')}
                    />
                    <TabButton
                        icon={<Shield size={16} />}
                        label="Security"
                        isActive={activeTab === 'security'}
                        onClick={() => setActiveTab('security')}
                    />
                </nav>
            </div>

            {/* Tab Content */}
            <div className="max-w-3xl">
                {activeTab === 'organization' && <OrganizationSettings currentOrg={currentOrg} />}
                {activeTab === 'profile' && <ProfileSettings />}
                {activeTab === 'notifications' && <NotificationSettings />}
                {activeTab === 'security' && <SecuritySettings />}
            </div>
        </div>
    );
}

function TabButton({ icon, label, isActive, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 px-1 py-3 border-b-2 text-sm font-medium transition-colors",
                isActive
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
            )}
        >
            {icon}
            {label}
        </button>
    );
}

function OrganizationSettings({ currentOrg }: any) {
    if (!currentOrg) return <div>Loading...</div>;

    return (
        <div className="space-y-6 rounded-lg border bg-card p-6">
            <div>
                <h3 className="text-lg font-semibold">Organization Details</h3>
                <p className="text-sm text-muted-foreground">Manage your organization information and preferences.</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Organization Name</label>
                    <input
                        type="text"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        defaultValue={currentOrg.name}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Organization ID</label>
                    <input
                        type="text"
                        className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm"
                        defaultValue={currentOrg.id}
                        disabled
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Slug</label>
                    <input
                        type="text"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        defaultValue={currentOrg.slug}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Theme</label>
                    <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                        <option>Dark Mode</option>
                        <option>Light Mode</option>
                        <option>System</option>
                    </select>
                </div>
            </div>

            <button className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                <Save size={16} />
                Save Changes
            </button>
        </div>
    );
}

function ProfileSettings() {
    return (
        <div className="space-y-6 rounded-lg border bg-card p-6">
            <div>
                <h3 className="text-lg font-semibold">Profile Settings</h3>
                <p className="text-sm text-muted-foreground">Update your personal information.</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <input
                        type="text"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        defaultValue="John Smith"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <input
                        type="email"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        defaultValue="john.smith@example.com"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Role</label>
                    <input
                        type="text"
                        className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm"
                        defaultValue="Administrator"
                        disabled
                    />
                </div>
            </div>

            <button className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                <Save size={16} />
                Save Changes
            </button>
        </div>
    );
}

function NotificationSettings() {
    return (
        <div className="space-y-6 rounded-lg border bg-card p-6">
            <div>
                <h3 className="text-lg font-semibold">Notification Preferences</h3>
                <p className="text-sm text-muted-foreground">Choose what notifications you receive.</p>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">Device Alerts</p>
                        <p className="text-sm text-muted-foreground">Get notified when devices go offline</p>
                    </div>
                    <input type="checkbox" className="h-4 w-4" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">Critical Warnings</p>
                        <p className="text-sm text-muted-foreground">Receive alerts for critical system warnings</p>
                    </div>
                    <input type="checkbox" className="h-4 w-4" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">Weekly Reports</p>
                        <p className="text-sm text-muted-foreground">Get weekly summaries via email</p>
                    </div>
                    <input type="checkbox" className="h-4 w-4" />
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">Product Updates</p>
                        <p className="text-sm text-muted-foreground">Stay informed about new features</p>
                    </div>
                    <input type="checkbox" className="h-4 w-4" defaultChecked />
                </div>
            </div>

            <button className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                <Save size={16} />
                Save Preferences
            </button>
        </div>
    );
}

function SecuritySettings() {
    return (
        <div className="space-y-6 rounded-lg border bg-card p-6">
            <div>
                <h3 className="text-lg font-semibold">Security Settings</h3>
                <p className="text-sm text-muted-foreground">Manage your account security.</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Current Password</label>
                    <input
                        type="password"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="••••••••"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">New Password</label>
                    <input
                        type="password"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="••••••••"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Confirm New Password</label>
                    <input
                        type="password"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="••••••••"
                    />
                </div>

                <div className="rounded-md bg-muted p-4">
                    <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground mb-3">Add an extra layer of security to your account.</p>
                    <button className="text-sm font-medium text-primary hover:underline">Enable 2FA</button>
                </div>
            </div>

            <button className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                <Save size={16} />
                Update Password
            </button>
        </div>
    );
}
