import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import reducer from './reducer';

//-----------------------|| REDUX - MAIN STORE ||-----------------------//

const store = configureStore({
    reducer: reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    devTools: process.env.NODE_ENV !== 'production',
});

const persister = persistStore(store);

export { store, persister };
