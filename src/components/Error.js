import { useRouter } from "next/dist/client/router"
import Layout from "./Layout"
function Error() {
    const router = useRouter()
    return (
        <Layout title={'Error'}>
            <h1>
                You should not be here
            </h1>
            <button onClick={() => router.push('/')}>
                Go to Home
            </button>
        </Layout>
    )
}

export default Error
