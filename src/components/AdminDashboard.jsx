import { useGetParcelsQuery, useGetMetricsQuery, useGetAgentsQuery, useAssignAgentMutation } from '@/features/auth/parcelApiSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { User, MapPin, Calendar } from 'lucide-react';
import Loading from '@/components/Loading';

const AdminDashboard = () => {
    const { data: parcels, isLoading: isLoadingParcels } = useGetParcelsQuery();
    const { data: metrics, isLoading: isLoadingMetrics } = useGetMetricsQuery();
    const { data: agents } = useGetAgentsQuery();
    const [assignAgent] = useAssignAgentMutation();

    if (isLoadingParcels || isLoadingMetrics) return <Loading fullScreen={false} />;

    const handleAssign = async (parcelId, agentId) => {
        if (!agentId) return;
        try {
            await assignAgent({ id: parcelId, agentId }).unwrap();
        } catch (err) {
            console.error('Failed to assign agent:', err);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Admin Dashboard</h2>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Parcels</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold">{metrics?.totalParcels || 0}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Delivered</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold">{metrics?.deliveredParcels || 0}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Failed</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-red-500">{metrics?.failedParcels || 0}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Revenue</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold">${metrics?.totalRevenue || 0}</div></CardContent>
                </Card>
            </div>

            {/* All Parcels */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">All Parcels</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {parcels?.map((parcel) => (
                        <Card key={parcel._id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Tracking ID</p>
                                        <p className="font-mono text-sm">{parcel._id.slice(-8).toUpperCase()}</p>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${parcel.status === 'delivered' ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900' :
                                            parcel.status === 'failed' ? 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900' :
                                                'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900'
                                            }`}>
                                            {parcel.status.replace('_', ' ').toUpperCase()}
                                        </span>
                                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground justify-end">
                                            <Calendar size={10} />
                                            {new Date(parcel.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 py-2 border-t border-b">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm">From: <span className="font-medium">{parcel.sender?.name}</span></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm truncate" title={parcel.deliveryAddress}>To: {parcel.deliveryAddress}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-xs font-medium text-muted-foreground">Assign Agent</p>
                                    <Select
                                        defaultValue={parcel.assignedAgent?._id || ""}
                                        onValueChange={(value) => handleAssign(parcel._id, value)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Agent" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {agents?.map(agent => (
                                                <SelectItem key={agent._id} value={agent._id}>{agent.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
