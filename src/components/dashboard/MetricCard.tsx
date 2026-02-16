import React from 'react';
import { cn } from '../../lib/utils';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string | number;
    change?: number;
    trend?: 'up' | 'down' | 'neutral';
    icon?: React.ReactNode;
    className?: string;
    description?: string;
}

export function MetricCard({
    title,
    value,
    change,
    trend = 'neutral',
    icon,
    className,
    description
}: MetricCardProps) {
    return (
        <div className={cn("rounded-xl border bg-card text-card-foreground shadow p-6", className)}>
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium text-muted-foreground">{title}</h3>
                {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
            </div>
            <div className="flex items-baseline space-x-2">
                <div className="text-2xl font-bold">{value}</div>
                {change !== undefined && (
                    <div className={cn(
                        "flex items-center text-xs font-medium",
                        trend === 'up' ? "text-green-500" : trend === 'down' ? "text-red-500" : "text-gray-500"
                    )}>
                        {trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-1" /> :
                            trend === 'down' ? <ArrowDownRight className="h-3 w-3 mr-1" /> :
                                <Minus className="h-3 w-3 mr-1" />}
                        {Math.abs(change)}%
                    </div>
                )}
            </div>
            {description && (
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
        </div>
    );
}
