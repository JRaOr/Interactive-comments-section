import { getProviders, signIn } from "next-auth/react"
import styles from '../../styles/signin.module.scss'
import Layout from '../../components/Layout'
import { FcGoogle }  from 'react-icons/fc'
function signin({ providers }) {
    return (
        <Layout>
            <div className="w-[100%] flex flex-col items-center">
                <h1 className="text-2xl font-bold text-gray-500 mb-14">Sign In Page</h1>
                {Object.values(providers).map((provider) => (
                    <div key={provider.name}>
                        <button className="bg-blue-600 text-white flex items-center px-5 py-2 rounded-md gap-3 hover:bg-blue-400 active:scale-105 transition-all ease-in-out duration-200" onClick={() => signIn(provider.id, {callbackUrl: '/'})}>
                            Sign in with <FcGoogle/>
                        </button>
                    </div>
                ))}
            </div>
        </Layout>
    )
}

export async function getServerSideProps(){
    const providers = await getProviders();
    return {
        props: {
            providers
        }
    }
}

export default signin
