import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/dist/client/router'
import styles from '../styles/components/Topbar.module.scss'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { signout } from '../store/user/actions'
import { useDispatch } from 'react-redux'
import { BsMoonFill, BsSunFill } from 'react-icons/bs'
const Avatar = ({image, name}) => {
    return (
        <div className={styles.avatar_container}>
            <Image src={image} alt={name} width={45} height={45} />
        </div>
    )
}
function Topbar({location , setOpenImageModal, openImageModal}) {
    const {data : session} = useSession()
    const router = useRouter()
    const dispatch = useDispatch()
    const [theme, setTheme] = useState('')
    useEffect(()=>{
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark')
            setTheme('dark')
        } else {
            document.documentElement.classList.remove('dark')
            setTheme('light')
        }
    },[])

    function changeTheme(){
        if(localStorage.theme === 'dark'){
            document.documentElement.classList.remove('dark')
            localStorage.theme = 'light'
            setTheme('light')
        }else{
            localStorage.theme = 'dark'
            setTheme('dark')
            document.documentElement.classList.add('dark')
        }
    }

    return (
        <div className={`${styles.topbar_container} dark:bg-[#324152] dark:text-white`}>
            <div className={styles.topbar_content}>
                <div className='flex gap-2 items-end'>
                    <div className='flex flex-row cursor-pointer gap-2 hover:text-[#2499f2]' onClick={()=>{
                        router.push('/')
                    }}>
                        <p className=' text-2xl font-bold transition-all ease-in-out duration-300'>
                            SeaOcelot
                        </p>
                    </div>
                </div>
                <div className='flex items-center gap-5'>
                    <div onClick={()=>{
                            changeTheme()
                        }} className='flex items-center gap-2 cursor-pointer text-black dark:text-yellow-500'>
                            {theme === 'light' ? 
                                <BsMoonFill/>
                                :
                                <BsSunFill/>}
                    </div>
                    {session ? 
                    <div className={styles.topbar_tools}>
                        <button className={`${styles.topbar_tools_button} hover:text-red-600 transition-all ease-in-out duration-300 font-semibold`} onClick={()=>{
                            dispatch(signout(router))
                        }}>
                            Sign Out
                        </button>
                        <Avatar image={session.user.image} name={session.user.name} />
                    </div>    
                    :
                    <div className={styles.topbar_tools}>
                        <button className={`text-md font-semibold border-2 border-blue-900 rounded-md px-2 text-white bg-blue-600 hover:bg-blue-700 hover:border-blue-700 transition-all ease-in-out duration-300`} 
                                onClick={()=>{router.push('/auth/signin' + (location ? '?page=' + location : ''))}}>Sign In</button>
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default Topbar
