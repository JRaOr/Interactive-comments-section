import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react"
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { BsFillReplyFill, BsFillTrashFill } from "react-icons/bs"
import { MdOutlineModeEditOutline } from "react-icons/md";
import { useDispatch } from "react-redux";
import { dataAvailable } from "../store/ux/actions";
import { db } from "../util/firebase";

export default function Reply({ id, user, comment, handleReply}){
    const [reply, setReply] = useState(null)
    const dispatch = useDispatch()
    useEffect(()=>{
        getReply()
    },[])
    
    async function getReply(){
        const docRef = doc(db, "replies", id);
        const response = await getDoc(docRef)
        setReply(response.data())
        dispatch(dataAvailable())
    }

    function getDate(date){
        return date.toDate().toDateString()
    }

    async function deleteReply(key){
        try{    
            console.log(reply)
            const response = await deleteDoc(doc(db, "replies", key));
            const updateRef = doc(db, "comments", comment);
            const res = await getDoc(updateRef)
            let temp = res.data().replies
            for( var i = 0; i < temp.length; i++){ 
                if ( temp[i] === key) { 
                    temp.splice(i, 1); 
                }
            }
            await updateDoc(updateRef, {
                replies: temp
            });
            getReply()
            dispatch(dataAvailable())
        }catch(error){
            console.log(error)
        }
    }

    async function voteUp(key){
        try{
            const docRef = doc(db, "replies", key);
            const response = await getDoc(docRef)
            if(user.id === response.data().id){
                console.log("You can't upvote your own reply!")
            }else if(response.data().voted.includes(user.id)){
                console.log("You've already voted in this comment")
            } else if(user.id){
                await updateDoc(docRef, {
                    voted: [user.id, ...response.data().voted],
                    score: response.data().score + 1
                });
                console.log("You've voted successfully")
                dispatch(dataAvailable())
                getReply()
            } else {
                console.log('You need to be logged in to vote')
            }
        }catch(error){
            console.error(error)
        }
    }

    async function voteDown(key){
        try{
            const docRef = doc(db, "replies", key);
            const response = await getDoc(docRef)
            if(user.id === response.data().id){
                console.log("You can't downvote your own comment!")
            }else if(response.data().voted.includes(user.id)){
                console.log("You've already voted in this comment")
            } else if(user.id){
                await updateDoc(docRef, {
                    voted: [user.id, ...response.data().voted],
                    score: response.data().score - 1
                });
                console.log("You've voted successfully")
                dispatch(dataAvailable())
            } else {
                console.log('You need to be logged in to vote')
            }
        }catch(error){
            console.error(error)
        }
    }

    const _renderControls = (data) => {
        if(user.id === data.id)
            return(
                <div className="flex text-md gap-2 font-bold">
                    <div onClick={()=>{
                        deleteReply(data.key)
                    }} className="text-red-500 flex gap-[2px] items-center hover:text-red-400 cursor-pointer">
                        <BsFillTrashFill/>
                        Delete
                    </div>
                </div>
            )
        else return(
            <div onClick={()=>{
                    handleReply(comment)
                }} className="text-[#573ec4] font-bold cursor-pointer flex items-center gap-[2px] hover:scale-105 transition-all ease-in-out duration-100 hover:text-[#765af3] dark:text-gray-300">
                    <BsFillReplyFill/>
                    Reply
            </div>
        )
    }

    if(reply)
    return(
        <div key={`comment-${id}`} className="bg-white shadow-lg p-5 mb-5 rounded-md dark:bg-[#324152] dark:text-white flex">
            <div className="w-[40px] hidden md:flex items-start justify-center">
                <div className="font-bold bg-[#e9ebf0] rounded-md px-2 py-[5px] flex items-center gap-2 flex-col">
                    <div onClick={()=>{
                        voteUp(id)
                    }} className="cursor-pointer text-[#a799e2] hover:text-[#573ec4] transition-all ease-in-out duration-300">
                        <AiOutlinePlus/>
                    </div>
                    <p className="text-[#573ec4]">
                        {reply.score}
                    </p>
                    <div onClick={()=>{
                        voteDown(id)
                    }} className="cursor-pointer text-[#a799e2] hover:text-[#573ec4] transition-all ease-in-out duration-300">
                        <AiOutlineMinus/>
                    </div>
                </div>
            </div>
            <div className="grow md:ml-5">
                <div className="flex items-center gap-[15px] justify-between">
                    <div className="flex items-center gap-[15px]">
                        <div className="h-[50px] w-[50px] rounded-full overflow-hidden hover:scale-105 cursor-pointer transition-all ease-in-out duration-300">
                            <img src={reply.image}/>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:gap-2">
                            <p className="font-bold">
                                {reply.username}
                            </p>
                            <p className="font-normal">
                                {getDate(reply.timestamp)}
                            </p>
                        </div>
                    </div>
                    <div className="hidden md:flex">
                        {_renderControls({id: reply.id, key: id})}
                    </div>
                </div>
                <p className="font-normal text-gray-500 mt-6 dark:text-gray-50">
                    {reply.content}
                </p>
                <div className="flex justify-between text-[#573ec4] font-bold mt-6 md:hidden">
                    <div className="bg-[#e9ebf0] rounded-lg px-2 py-[5px] flex items-center gap-2">
                        <div onClick={()=>{
                            voteUp(id)
                        }} className="cursor-pointer text-[#a799e2] hover:text-[#573ec4] transition-all ease-in-out duration-300">
                            <AiOutlinePlus/>
                        </div>
                        <p>
                            {reply.score}
                        </p>
                        <div onClick={()=>{
                            voteDown(id)
                        }} className="cursor-pointer text-[#a799e2] hover:text-[#573ec4] transition-all ease-in-out duration-300">
                            <AiOutlineMinus/>
                        </div>
                    </div>
                    {_renderControls({id: reply.id, key: id})}
                </div>
            </div>
        </div>
    )
    else return <></>
}