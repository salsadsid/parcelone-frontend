import { useGetParcelsQuery, useGetMetricsQuery, useGetAgentsQuery, useAssignAgentMutation } from '@/features/auth/parcelApiSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const AdminDashboard = () => {
    const { data: parcels } = useGetParcelsQuery();
    const { data: metrics } = useGetMetricsQuery();
    const { data: agents } = useGetAgentsQuery();
    const [assignAgent] = useAssignAgentMutation();

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
                <h3 className="text-xl font-semibold">All Parcels</h3>
                <div className="grid gap-4">
                    {parcels?.map((parcel) => (
                        <Card key={parcel._id}>
                            <CardContent className="p-4 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">ID: {parcel._id.slice(-6)}</p>
                                    <p className="text-sm">From: {parcel.sender?.name}</p>
                                    <p className="text-sm">Status: {parcel.status}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <select
                                        className="border rounded p-1"
                                        defaultValue={parcel.assignedAgent?._id || ""}
                                        onChange={(e) => handleAssign(parcel._id, e.target.value)}
                                    >
                                        <option value="">Assign Agent</option>
                                        {agents?.map(agent => (
                                            <option key={agent._id} value={agent._id}>{agent.name}</option>
                                        ))}
                                    </select>
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
