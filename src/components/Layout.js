import Topbar from "./Topbar"
import stytes from '../styles/components/Layout.module.scss'
import { useEffect, useState } from "react"
import Head from "next/head"
import { useDispatch, useSelector } from "react-redux"
import { useSession } from "next-auth/react"
import { useRouter } from "next/dist/client/router"
import { fillUserProfile, signout } from '../store/user/actions';


function Layout({children, location, title}) {
    const [openImageModal, setOpenImageModal] = useState(false)
    const user = useSelector((state) => state.user);
    const {data: session} = useSession();
    const router = useRouter();
    const dispatch = useDispatch()
    useEffect(() => {
        if(session != undefined){
            if(session){
                if (!user.id) {
                    console.log(session)
                    dispatch(fillUserProfile(router, session))
                }
            }
        }
    }, [session])
    return (
        <div className={stytes.layout_main}>

            <Head>
                <title>Sea Ocelot {(title ? `| ${title}` : '')}</title>
            </Head>
            <Topbar location={location} openImageModal={openImageModal} setOpenImageModal={setOpenImageModal}/>
            <div className={`${stytes.layout_content} bg-[#F4F5F9] dark:bg-[#67727E] `}>
                <div className={`${stytes.layout_container}`}>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Layout
