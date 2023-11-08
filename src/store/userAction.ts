import { useDispatch } from 'react-redux';
import { setAccessToken } from './userSlice';

/**
 * Сохраняет access_token в Redux store.
 * @param {string | null} token - The user's access token to be saved.
 */
export const saveAccessToken = (token: string | null) => {
    const dispatch = useDispatch();
    dispatch(setAccessToken(token));
};
