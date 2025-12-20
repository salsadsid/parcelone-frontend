import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetMeQuery } from '@/features/auth/authApiSlice';
import { setCredentials, selectCurrentToken, logOut, selectCurrentUser } from '@/features/auth/authSlice';
import { Outlet } from 'react-router-dom';
import Loading from './Loading';

const PersistLogin = () => {
    const token = useSelector(selectCurrentToken);
    const userInStore = useSelector(selectCurrentUser);
    const dispatch = useDispatch();


    const { data: user, isLoading, isSuccess, isError, error } = useGetMeQuery(undefined, {
        skip: !token || !!userInStore,
    });

    useEffect(() => {
        console.log('PersistLogin effect:', {
            isSuccess,
            isError,
            isLoading,
            hasUser: !!user,
            token: token ? `${token.substring(0, 10)}...` : null,
            error
        });

        if (isSuccess && user && token && !userInStore) {
            console.log('PersistLogin: Success, setting credentials');
            dispatch(setCredentials({ user, token }));
        } else if (isError) {
            console.log('PersistLogin: Error fetching user, clearing token', error);
            dispatch(logOut());
        }
    }, [isSuccess, isError, isLoading, user, token, dispatch, error, userInStore]);


    if (isLoading || (token && !userInStore && !isError)) {
        return <Loading />
    }

    return <Outlet />;
};

export default PersistLogin;
