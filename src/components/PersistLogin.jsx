import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetMeQuery } from '@/features/auth/authApiSlice';
import { setCredentials, selectCurrentToken } from '@/features/auth/authSlice';
import { Outlet } from 'react-router-dom';

const PersistLogin = () => {
    const token = useSelector(selectCurrentToken);
    const dispatch = useDispatch();

    // Skip query if no token
    const { data: user, isLoading, isSuccess, isError } = useGetMeQuery(undefined, {
        skip: !token,
    });

    useEffect(() => {
        if (isSuccess && user) {
            dispatch(setCredentials({ user, token }));
        }
    }, [isSuccess, user, token, dispatch]);

    if (isLoading) {
        return <div>Loading...</div>; // Or a proper loading spinner
    }

    return <Outlet />;
};

export default PersistLogin;
