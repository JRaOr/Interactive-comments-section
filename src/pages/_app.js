import { useRouter } from "next/router"
import { useEffect } from "react";
import { Provider } from "react-redux";
import useStore from '../store/store';
import { getEnv } from '../lib/calls'
import Config from '../util/Config'
import '../styles/globals.css'
import { SessionProvider } from "next-auth/react";
import { CookiesProvider } from 'react-cookie';
import Router from 'next/router'

import ProgressBar from '@badrap/bar-of-progress'
const progress = new ProgressBar({
    size: 4,
    color: '#2499f2',
    className: 'z-50',
    delay: 100
})

Router.events.on('routeChangeStart', progress.start);
Router.events.on('routeChangeComplete', progress.finish)
Router.events.on('routeChangeError', progress.finish)


export default function App ({Component, pageProps : {session , ...pageProps}}) {
    const router = useRouter()
    const store = useStore(pageProps.initialReduxState);

    useEffect(() => {
        async function getServer() {
            await getEnv(window.location.protocol, window.location.host);
        }
        if (!Config.API_SERVER) {
            getServer();
        }
    }, [])

    return (
        <Provider store={store}>
            <SessionProvider session={session}>
                <CookiesProvider>
                    <Component {...pageProps} />
                </CookiesProvider>
            </SessionProvider>
        </Provider>
    )
}