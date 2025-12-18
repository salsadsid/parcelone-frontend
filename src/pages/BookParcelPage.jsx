import { useNavigate } from 'react-router-dom';
import { useCreateParcelMutation } from '@/features/auth/parcelApiSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useForm, Controller } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Loading from '@/components/Loading';

const BookParcelPage = () => {
    const [createParcel, { isLoading: isCreating }] = useCreateParcelMutation();
    const { register, handleSubmit, control, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            await createParcel(data).unwrap();
            alert('Parcel booked successfully!');
            navigate('/');
        } catch (err) {
            console.error('Failed to book parcel:', err);
            alert('Failed to book parcel');
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4 py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Book a New Parcel</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Pickup Address</Label>
                                <Input {...register('pickupAddress', { required: 'Pickup address is required' })} />
                                {errors.pickupAddress && <span className="text-sm text-destructive">{errors.pickupAddress.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label>Delivery Address</Label>
                                <Input {...register('deliveryAddress', { required: 'Delivery address is required' })} />
                                {errors.deliveryAddress && <span className="text-sm text-destructive">{errors.deliveryAddress.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label>Receiver Name</Label>
                                <Input {...register('receiverName', { required: 'Receiver name is required' })} />
                                {errors.receiverName && <span className="text-sm text-destructive">{errors.receiverName.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label>Receiver Phone</Label>
                                <Input {...register('receiverPhone', { required: 'Receiver phone is required' })} />
                                {errors.receiverPhone && <span className="text-sm text-destructive">{errors.receiverPhone.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label>Parcel Type</Label>
                                <Input {...register('parcelType', { required: 'Parcel type is required' })} placeholder="e.g., Document, Box" />
                                {errors.parcelType && <span className="text-sm text-destructive">{errors.parcelType.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label>Cost</Label>
                                <Input type="number" {...register('cost', { required: 'Cost is required' })} />
                                {errors.cost && <span className="text-sm text-destructive">{errors.cost.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label>Payment Mode</Label>
                                <Controller
                                    name="paymentMode"
                                    control={control}
                                    defaultValue="prepaid"
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select payment mode" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="prepaid">Prepaid</SelectItem>
                                                <SelectItem value="cod">COD</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={() => navigate('/')}>Cancel</Button>
                            <Button type="submit" disabled={isCreating}>
                                {isCreating ? <Loader2 className="animate-spin mr-2" /> : 'Book Parcel'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default BookParcelPage;
