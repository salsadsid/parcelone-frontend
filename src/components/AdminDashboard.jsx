import { useGetParcelsQuery, useGetMetricsQuery, useGetAgentsQuery, useAssignAgentMutation } from '@/features/auth/parcelApiSlice';
import { useGetUsersQuery } from '@/features/auth/authApiSlice';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Loading from '@/components/Loading';
import ParcelCard from '@/components/ParcelCard';
import { Package, Users, LayoutDashboard, Calendar, Mail, Shield, User as UserIcon, CheckCircle2, AlertCircle, DollarSign, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('bookings');
    const { data: parcels, isLoading: isLoadingParcels } = useGetParcelsQuery();
    const { data: metrics, isLoading: isLoadingMetrics } = useGetMetricsQuery();
    const { data: agents } = useGetAgentsQuery();
    const { data: users, isLoading: isLoadingUsers } = useGetUsersQuery(undefined, {
        skip: activeTab !== 'users'
    });

    const [assigningId, setAssigningId] = useState(null);
    const [assignAgent] = useAssignAgentMutation();

    if (isLoadingParcels || isLoadingMetrics) return <Loading fullScreen={false} />;

    const handleAssign = async (parcelId, agentId) => {
        if (!agentId) return;
        setAssigningId(parcelId);
        try {
            await assignAgent({ id: parcelId, agentId }).unwrap();
            toast.success('Agent assigned successfully!');
        } catch (err) {
            console.error('Failed to assign agent:', err);
            toast.error('Failed to assign agent. Please try again.');
        } finally {
            setAssigningId(null);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
                    <p className="text-muted-foreground">Manage your logistics network and users.</p>
                </div>
                <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg border">
                    <Button
                        variant={activeTab === 'bookings' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTab('bookings')}
                        className="gap-2"
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        Bookings
                    </Button>
                    <Button
                        variant={activeTab === 'users' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveTab('users')}
                        className="gap-2"
                    >
                        <Users className="w-4 h-4" />
                        Users
                    </Button>
                </div>
            </div>

            {activeTab === 'bookings' ? (
                <>
                    {/* Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="border-primary/10 shadow-md overflow-hidden relative group hover:border-primary/20 transition-all">
                            <div className="absolute top-0 right-0 p-4 text-primary/20 group-hover:scale-110 transition-transform">
                                <Package className="w-12 h-12" />
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Parcels</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black tracking-tighter">{metrics?.totalParcels || 0}</div>
                                <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3 text-primary" />
                                    System wide
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border-green-500/10 shadow-md overflow-hidden relative group hover:border-green-500/20 transition-all">
                            <div className="absolute top-0 right-0 p-4 text-green-500/20 group-hover:scale-110 transition-transform">
                                <CheckCircle2 className="w-12 h-12" />
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Delivered</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black tracking-tighter text-green-600 dark:text-green-400">{metrics?.deliveredParcels || 0}</div>
                                <p className="text-[10px] text-muted-foreground mt-1">Successfully completed</p>
                            </CardContent>
                        </Card>
                        <Card className="border-red-500/10 shadow-md overflow-hidden relative group hover:border-red-500/20 transition-all">
                            <div className="absolute top-0 right-0 p-4 text-red-500/20 group-hover:scale-110 transition-transform">
                                <AlertCircle className="w-12 h-12" />
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Failed</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black tracking-tighter text-red-500">{metrics?.failedParcels || 0}</div>
                                <p className="text-[10px] text-muted-foreground mt-1">Returned or cancelled</p>
                            </CardContent>
                        </Card>
                        <Card className="border-primary/10 shadow-md overflow-hidden relative group hover:border-primary/20 transition-all">
                            <div className="absolute top-0 right-0 p-4 text-primary/20 group-hover:scale-110 transition-transform">
                                <DollarSign className="w-12 h-12" />
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Revenue</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black tracking-tighter text-primary">${metrics?.totalRevenue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</div>
                                <p className="text-[10px] text-muted-foreground mt-1">Total earnings</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* All Parcels */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-foreground">All Bookings</h3>
                            <span className="text-sm text-muted-foreground">{parcels?.length || 0} total parcels</span>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {parcels?.map((parcel) => (
                                <ParcelCard
                                    key={parcel._id}
                                    parcel={parcel}
                                    role="admin"
                                    onAssignAgent={handleAssign}
                                    agents={agents}
                                    isUpdating={assigningId === parcel._id}
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
                </>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-foreground">Registered Users</h3>
                        <span className="text-sm text-muted-foreground">{users?.length || 0} users found</span>
                    </div>

                    {isLoadingUsers ? (
                        <div className="py-20 text-center">
                            <Loading fullScreen={false} />
                        </div>
                    ) : (
                        <div className="border rounded-xl overflow-hidden bg-card shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-muted/50 border-b">
                                            <th className="p-4 font-semibold text-sm">User</th>
                                            <th className="p-4 font-semibold text-sm">Email</th>
                                            <th className="p-4 font-semibold text-sm">Role</th>
                                            <th className="p-4 font-semibold text-sm">Joined</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {users?.map((user) => (
                                            <tr key={user._id} className="hover:bg-muted/30 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                            <UserIcon className="w-5 h-5" />
                                                        </div>
                                                        <span className="font-medium">{user.name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                        <Mail className="w-4 h-4" />
                                                        {user.email}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <Shield className={`w-4 h-4 ${user.role === 'admin' ? 'text-red-500' :
                                                            user.role === 'agent' ? 'text-blue-500' : 'text-green-500'
                                                            }`} />
                                                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                            user.role === 'agent' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                                'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                            }`}>
                                                            {user.role}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                        <Calendar className="w-4 h-4" />
                                                        {new Date(user.createdAt).toLocaleDateString()}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {users?.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="p-12 text-center text-muted-foreground">
                                                    No users found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
