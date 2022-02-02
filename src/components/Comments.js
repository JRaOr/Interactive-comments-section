import { useState } from "react"
import { BsFillReplyFill, BsFillTrashFill } from "react-icons/bs"
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai'
import { useDispatch, useSelector } from "react-redux"
import { db } from '../util/firebase';
import { addDoc, collection, serverTimestamp, deleteDoc, doc, getDoc, updateDoc} from '@firebase/firestore'
import { MdOutlineModeEditOutline } from 'react-icons/md'
import { dataAvailable } from "../store/ux/actions";
import Reply from './Reply'

import Modal from './Modal'
export default function Comments({data}){
    const [modalOpen, setModalOpen] = useState(false)
    const user = useSelector((state) => state.user);
    const [newComment, setNewComment] = useState('')
    const dispatch = useDispatch()
    const [replyActive, setReplyActive] = useState('')
    const [reply, setReply] = useState('')
    const [modalData, setModalData] = useState(null)
    async function postComment(){
        if(newComment != ''){
            const docRef = await addDoc(collection(db, 'comments'),{
                username: user.name,
                id: user.id,
                timestamp: serverTimestamp(),
                content: newComment,
                score: 0,
                replies: [],
                image: user.image,
                voted: []
            })
            setNewComment('')
            dispatch(dataAvailable())
        }
    }

    function getDate(date){
        return date.toDate().toDateString()
    }

    async function deleteComment(key){
        console.log('Deleting Comment')
        try{    
            const response = await deleteDoc(doc(db, "comments", key));
            dispatch(dataAvailable())
        }catch(error){
            console.log(error)
        }
    }

    async function voteUp(key){
        try{
            const docRef = doc(db, "comments", key);
            const response = await getDoc(docRef)
            if(user.id === response.data().id){
                console.log("You can't upvote your own comment!")
            }else if(response.data().voted.includes(user.id)){
                console.log("You've already voted in this comment")
            } else if(user.id){
                await updateDoc(docRef, {
                    voted: [user.id, ...response.data().voted],
                    score: response.data().score + 1
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

    async function voteDown(key){
        try{
            const docRef = doc(db, "comments", key);
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

    async function addReply(key){
        if(user.id){
            console.log('Replying to commet')
            const docRef = await addDoc(collection(db, 'replies'),{
                username: user.name,
                id: user.id,
                timestamp: serverTimestamp(),
                content: reply,
                score: 0,
                image: user.image,
                voted: []
            })
            console.log('Reply posted, id:', docRef.id)
            const updateRef = doc(db, "comments", key);
            const response = await getDoc(updateRef)
            await updateDoc(updateRef, {
                replies: [docRef.id, ...response.data().replies]
            });
            setReply('')
            dispatch(dataAvailable())

        }else{
            console.log('You need to be logged in to reply in this comment!')
        }
    }
    function handleReply(comment){
        console.log('Handling reply')
        setReply('')
        setReplyActive(comment)
    }

    const _renderControls = (comment) => {
        if(user.id === comment.id)
            return(
                <div className="flex text-md gap-2 font-bold">
                    <div onClick={()=>{
                        setModalData(comment)
                        setModalOpen(true)
                    }} className="text-red-500 flex gap-[2px] items-center hover:text-red-400 cursor-pointer">
                        <BsFillTrashFill/>
                        Delete
                    </div>
                    <div className="text-[#573ec4] flex gap-2 items-center hover:text-[#a799e2] cursor-pointer">
                        <MdOutlineModeEditOutline/>
                        Edit
                    </div>
                </div>
            )
        else return(
            <div onClick={()=>{
                    setReplyActive(comment.key)
                    setReply('')
                }} className="text-[#573ec4] font-bold cursor-pointer flex items-center gap-[2px] hover:scale-105 transition-all ease-in-out duration-100 hover:text-[#765af3] dark:text-gray-300">
                    <BsFillReplyFill/>
                    Reply
            </div>
        )
    }

    function handleCloseModal(){
        setModalOpen(false)
        setModalData(null)
    }

    return(
        <div className="mb-[20vh]">
            <Modal title={"Delete comment"} show={modalOpen} onCloseModal={handleCloseModal}>
                <p className="max-w-[300px]">
                    Are you sure you want to delete this comment? This will remove the comment nad can&apos;t be undone.
                </p>
                <div className="flex items-center justify-between mt-6">
                    <button onClick={()=>{
                        handleCloseModal()
                    }} className=" bg-gray-500 text-white font-bold px-3 py-2 text-md rounded-md">
                        NO, CANCEL
                    </button>
                    <button onClick={()=>{
                        console.log(modalData)
                        deleteComment(modalData.key)
                        handleCloseModal()
                    }} className=" bg-red-400 text-white font-bold px-3 py-2 text-md rounded-md">
                        YES, DELETE
                    </button>
                </div>  
            </Modal>
            {data.map((comment, index)=>{
                return(
                    <div key={`comment-${comment.key}`}>
                        <div className="bg-white shadow-lg p-5 mb-5 rounded-md dark:text-white dark:bg-[#324152] flex">
                            <div className="w-[40px] hidden md:flex items-start justify-center">
                                <div className="font-bold bg-[#e9ebf0] rounded-md px-2 py-[5px] flex items-center gap-2 flex-col">
                                    <div onClick={()=>{
                                        voteUp(comment.key)
                                    }} className="cursor-pointer text-[#a799e2] hover:text-[#573ec4] transition-all ease-in-out duration-300">
                                        <AiOutlinePlus/>
                                    </div>
                                    <p className="text-[#573ec4]">
                                        {comment.score}
                                    </p>
                                    <div onClick={()=>{
                                        voteDown(comment.key)
                                    }} className="cursor-pointer text-[#a799e2] hover:text-[#573ec4] transition-all ease-in-out duration-300">
                                        <AiOutlineMinus/>
                                    </div>
                                </div>
                            </div>
                            <div className="grow md:ml-5">
                                <div className="flex items-start gap-[15px] justify-between">
                                    <div className="flex items-center gap-[15px]">
                                        <div className="h-[50px] w-[50px] rounded-full overflow-hidden hover:scale-105 cursor-pointer transition-all ease-in-out duration-300">
                                            <img src={comment.image}/>
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:gap-2">
                                            <p className="font-bold">
                                                {comment.username}
                                            </p>
                                            <p className="font-normal">
                                                {getDate(comment.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="hidden md:flex">
                                        {_renderControls(comment)}
                                    </div>
                                </div>
                                <p className="font-normal text-gray-500 mt-6 dark:text-gray-50">
                                    {comment.content}
                                </p>
                                <div className="flex justify-between text-[#573ec4] font-bold mt-6 md:hidden">
                                    <div className="bg-[#e9ebf0] rounded-lg px-2 py-[5px] flex items-center gap-2">
                                        <div onClick={()=>{
                                            voteUp(comment.key)
                                        }} className="cursor-pointer text-[#a799e2] hover:text-[#573ec4] transition-all ease-in-out duration-300">
                                            <AiOutlinePlus/>
                                        </div>
                                        <p>
                                            {comment.score}
                                        </p>
                                        <div onClick={()=>{
                                            voteDown(comment.key)
                                        }} className="cursor-pointer text-[#a799e2] hover:text-[#573ec4] transition-all ease-in-out duration-300">
                                            <AiOutlineMinus/>
                                        </div>
                                    </div>
                                    {_renderControls(comment)}
                                </div>
                                {replyActive === comment.key &&
                                    <div className="mt-6">
                                        <input value={reply} onChange={(e)=>{
                                            setReply(e.target.value)
                                        }} className="w-[100%] h-[48px] px-2 border-gray-400 border-[1px] rounded-md dark:bg-transparent dark:text-white" placeholder={`Reply to: ${comment.username}`}/>
                                        <div className="flex items-center justify-end gap-5 mt-6">
                                            <button onClick={()=>{
                                                setReplyActive('')
                                                setReply('')
                                            }} className="h-[40px] bg-[#24af98] text-white px-8 font-bold text-lg rounded-lg hover:scale-105 transition-all ease-in-out duration-300 hover:bg-[#509e9a]">
                                                Cancel
                                            </button>
                                            <button onClick={()=>{
                                                addReply(comment.key)
                                            }} disabled={reply === ''} className="h-[40px] bg-[#5358b6] text-white px-8 font-bold text-lg rounded-lg hover:scale-105 transition-all ease-in-out duration-300 hover:bg-[#c4c6ec] disabled:bg-gray-500 disabled:cursor-default">
                                                Reply
                                            </button>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                        {comment.replies.length > 0 &&
                            <div className="pl-5 border-l-[1px] mb-6 border-gray-400 dark:border-gray-800">
                                {comment.replies.map((element, index)=>(<Reply handleReply={handleReply} key={`replie-${element}`} user={user} id={element} comment={comment.key}/>))}
                            </div>
                        }
                    </div>
                )
            })}
            {user.id &&
            <div className="bg-white shadow-lg p-5 rounded-md dark:bg-[#324152] md:flex md:gap-4 md:justify-between">
                <div className="h-[50px] hidden md:flex w-[50px] rounded-full overflow-hidden hover:scale-105 cursor-pointer transition-all ease-in-out duration-300">
                    <img src={user.image}/>
                </div>
                <input value={newComment} onChange={(e)=>{
                    setNewComment(e.target.value)
                }} className="border-[1px] w-[100%] md:w-[400px] lg:w-[700px] xl:w-[900px] rounded-lg h-[100px] md:h-auto px-5 dark:bg-transparent dark:text-white"  placeholder="Add a comment..."/>
                <button onClick={()=>{
                    postComment()
                }} disabled={newComment === ''} className="hidden md:flex items-center justify-center h-[40px] bg-[#5358b6] text-white px-8 font-bold text-lg rounded-lg hover:scale-105 transition-all ease-in-out duration-300 hover:bg-[#c4c6ec] disabled:bg-gray-600">
                    SEND
                </button>
                <div className="flex items-center justify-between h-[50px] mt-6 md:hidden">
                    <div className="h-[50px] w-[50px] rounded-full overflow-hidden hover:scale-105 cursor-pointer transition-all ease-in-out duration-300">
                        <img src={user.image}/>
                    </div>
                    <button onClick={()=>{
                        postComment()
                    }} disabled={newComment === ''} className="h-[40px] bg-[#5358b6] text-white px-8 font-bold text-lg rounded-lg hover:scale-105 transition-all ease-in-out duration-300 hover:bg-[#c4c6ec] disabled:bg-gray-600">
                        SEND
                    </button>
                </div>
            </div>}
        </div>
    )
}