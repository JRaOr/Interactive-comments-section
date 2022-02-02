import styles from '../styles/home.module.scss'
import { getTags } from '../lib/calls';
import { db } from '../util/firebase';
import Layout from '../components/Layout';
import Comments from '../components/Comments';
import { useEffect, useState } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { dataUnavailable } from '../store/ux/actions';
export async function getServerSideProps({ resolvedUrl, req, params }) {
    const tags = await getTags(resolvedUrl, req);
    return {
        props: {
            timeline : [],
        },
    }
}

function Index() {
    const [comments, setComments] = useState([])
    const dataReady = useSelector(state => state.ux.data_available)
    const dispatch = useDispatch()
    useEffect(()=>{
        if(dataReady){
            getComments()
            dispatch(dataUnavailable())
        }
    },[dataReady])

    async function getComments(){
        const q = query(collection(db, "comments"));
        const querySnapshot = await getDocs(q);
        let temp = []
        querySnapshot.forEach((doc) => {
            temp.push({key: doc.id, ...doc.data()})
        });
        if(temp.length > 1 )
            temp.sort(function(a,b){
                return b.score - a.score
            })
        setComments(temp)
    }

    useEffect(()=>{
        getComments()
    },[])

    return (
        <Layout>
            <Comments data={comments}/>
        </Layout>
    )
}

export default Index
