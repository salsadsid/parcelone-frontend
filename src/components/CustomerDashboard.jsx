import { useState } from 'react';
import { useGetParcelsQuery, useCreateParcelMutation } from '@/features/auth/parcelApiSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';

const CustomerDashboard = () => {
    const { data: parcels, isLoading } = useGetParcelsQuery();
    const [createParcel, { isLoading: isCreating }] = useCreateParcelMutation();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [showForm, setShowForm] = useState(false);

    const onSubmit = async (data) => {
        try {
            await createParcel(data).unwrap();
            reset();
            setShowForm(false);
            alert('Parcel booked successfully!');
        } catch (err) {
            console.error('Failed to book parcel:', err);
            alert('Failed to book parcel');
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">My Parcels</h2>
                <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : 'Book New Parcel'}
                </Button>
            </div>

            {showForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>Book a Parcel</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Pickup Address</Label>
                                    <Input {...register('pickupAddress', { required: true })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Delivery Address</Label>
                                    <Input {...register('deliveryAddress', { required: true })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Receiver Name</Label>
                                    <Input {...register('receiverName', { required: true })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Receiver Phone</Label>
                                    <Input {...register('receiverPhone', { required: true })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Parcel Type</Label>
                                    <Input {...register('parcelType', { required: true })} placeholder="e.g., Document, Box" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Cost</Label>
                                    <Input type="number" {...register('cost', { required: true })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Payment Mode</Label>
                                    <select className="w-full border rounded-md p-2" {...register('paymentMode')}>
                                        <option value="prepaid">Prepaid</option>
                                        <option value="cod">COD</option>
                                    </select>
                                </div>
                            </div>
                            <Button type="submit" disabled={isCreating}>
                                {isCreating ? <Loader2 className="animate-spin mr-2" /> : 'Book Parcel'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4">
                {parcels?.map((parcel) => (
                    <Card key={parcel._id}>
                        <CardContent className="p-4 flex justify-between items-center">
                            <div>
                                <p className="font-semibold">To: {parcel.receiverName}</p>
                                <p className="text-sm text-gray-500">Status: {parcel.status}</p>
                                <p className="text-sm text-gray-500">Type: {parcel.parcelType}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">${parcel.cost}</p>
                                <p className="text-sm text-gray-500">{parcel.paymentMode.toUpperCase()}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {parcels?.length === 0 && <p>No parcels found.</p>}
            </div>
        </div>
    );
};

export default CustomerDashboard;
