import { useGetParcelsQuery, useGetMetricsQuery, useGetAgentsQuery, useAssignAgentMutation } from '@/features/auth/parcelApiSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Loading from '@/components/Loading';
import ParcelCard from '@/components/ParcelCard';
import { Package } from 'lucide-react';

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
                <Card className="border-primary/5 shadow-sm">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Parcels</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold">{metrics?.totalParcels || 0}</div></CardContent>
                </Card>
                <Card className="border-primary/5 shadow-sm">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Delivered</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-green-600 dark:text-green-400">{metrics?.deliveredParcels || 0}</div></CardContent>
                </Card>
                <Card className="border-primary/5 shadow-sm">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Failed</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-red-500">{metrics?.failedParcels || 0}</div></CardContent>
                </Card>
                <Card className="border-primary/5 shadow-sm">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-primary">${metrics?.totalRevenue?.toFixed(2) || '0.00'}</div></CardContent>
                </Card>
            </div>

            {/* All Parcels */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">All Parcels</h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {parcels?.map((parcel) => (
                        <ParcelCard
                            key={parcel._id}
                            parcel={parcel}
                            role="admin"
                            onAssignAgent={handleAssign}
                            agents={agents}
                        />
                    ))}
                    {parcels?.length === 0 && (
                        <div className="col-span-full text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-muted">
                            <Package className="w-16 h-16 mx-auto mb-4 opacity-10" />
                            <p className="text-muted-foreground font-medium">No parcels in the system yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
