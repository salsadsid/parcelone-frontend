import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetMeQuery } from '@/features/auth/authApiSlice';
import { setCredentials, selectCurrentToken } from '@/features/auth/authSlice';
import { Outlet } from 'react-router-dom';
import Loading from './Loading';

const PersistLogin = () => {
    const token = useSelector(selectCurrentToken);
    const dispatch = useDispatch();

    // Skip query if no token
    const { data: user, isLoading, isSuccess, isError } = useGetMeQuery(undefined, {
        skip: !token,
    });

    useEffect(() => {
        console.log('PersistLogin effect:', { isSuccess, hasUser: !!user, token });
        if (isSuccess && user) {
            console.log('PersistLogin dispatching setCredentials');
            dispatch(setCredentials({ user, token }));
        }
    }, [isSuccess, user, token, dispatch]);

    if (isLoading) {
        return <Loading />
    }

    return <Outlet />;
};

export default PersistLogin;
