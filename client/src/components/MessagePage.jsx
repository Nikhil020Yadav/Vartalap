import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import {Link, useParams } from 'react-router-dom'
import Avatar from './Avatar';
import {HiDotsVertical} from 'react-icons/hi'
import { FaAngleLeft } from 'react-icons/fa';
import { IoMdAttach } from "react-icons/io";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import { AiFillAudio } from "react-icons/ai";
import { IoDocumentTextOutline } from "react-icons/io5";
import uploadFile from '../helpers/uploadFile';
import { IoClose } from "react-icons/io5";
import Loading from './Loading';
import backgroundImage from '../assets/wallapaper.jpeg'
import { IoMdSend } from "react-icons/io";
import Emoji from './Emoji';
import moment from 'moment'

const MessagePage = () => {
  
  const params = useParams()
  const socketConnection=useSelector(state => state?.user?.socketConnection);
  const user=useSelector(state => state?.user)
  
  const [dataUser,setDataUser]=useState({
    name : "",
    email : "",
    profile_pic: "",
    online: false
  })

  const [openUpload,setOpenUpload]=useState(false);
  const [message,setMessage]=useState({
    text : "",
    imageUrl : "",
    videoUrl :"",
    documentUrl : "",
    audioUrl : ""
  })

  const [loading,setLoading]=useState(false)
  const [allMessage,setAllMessage]=useState([])
  const currentMessage=useRef(null)
  console.log("params : ",params.userId);
  
  useEffect(()=>{
    if(currentMessage.current){
        currentMessage.current.scrollIntoView({behavior : 'smooth', block : 'end'})
    }
},[allMessage])
  const handleUpload=()=>{
      setOpenUpload(preve => !preve)
  }

  const handleUploadImage=async(e)=>{
    const file = e.target.files[0]
    setLoading(true)
    const uploadPhoto = await uploadFile(file)
    setLoading(false)
    setOpenUpload(false)
    //console.log(uploadPhoto.url);
    setMessage(preve =>{
      return{
        ...preve,
        imageUrl : uploadPhoto.url
      }
    })
    
  }
  const handleClearUploadImage=()=>{
    setMessage(preve => {
      return{
        ...preve,
        imageUrl : ""
      }
    })
  }
  const handleUploadVideo=async(e)=>{
    const file = e.target.files[0]
    setLoading(true);
    const uploadVideo = await uploadFile(file)
    setLoading(false);
    setOpenUpload(false)
    setMessage(preve =>{
      return{
        ...preve,
        videoUrl : uploadVideo.url
      }
    })
  }
  const handleClearUploadVideo=()=>{
    setMessage(preve => {
      return{
        ...preve,
        videoUrl : ""
      }
    })
  }
  const handleUploadDocument=async(e)=>{
    const file = e.target.files[0]
    setLoading(true);
    const uploadDocument = await uploadFile(file)
    setLoading(false);
    setOpenUpload(false)
    setMessage(preve =>{
      return{
        ...preve,
        documentUrl : uploadDocument.url
      }
    })
  }
  const handleClearUploadDocument=()=>{
    setMessage(preve => {
      return{
        ...preve,
        documentUrl : ""
      }
    })
  }
  const handleUploadAudio=async(e)=>{
    const file = e.target.files[0]
    setLoading(true);
    const uploadAudio = await uploadFile(file)
    setLoading(false);
    setOpenUpload(false)
    setMessage(preve =>{
      return{
        ...preve,
        audioUrl : uploadAudio.url
      }
    })
  }
  const handleClearUploadAudio=()=>{
    setMessage(preve => {
      return{
        ...preve,
        audioUrl : ""
      }
    })
  }

  useEffect(()=>{
      if(socketConnection)
      {
        socketConnection.emit('message-page',params.userId);
        
        socketConnection.emit('seen',params.userId);
        socketConnection.on('message-user',(data)=>{
          console.log("USer Details :::-> ",data);
          setDataUser(data)
        })

        socketConnection.on('message',(data)=>{
          console.log('message data ', data);
          setAllMessage(data)
        })
      }
  },[socketConnection,params?.userId,user])


  const handleOnChange=(e)=>{
    const { name, value} = e.target

    setMessage(preve => {
      return{
        ...preve,
        text : value
      }
    })
  }
  const handleSendMessage=(e)=>{
    e.preventDefault()

    if(message.text || message.imageUrl || message.videoUrl || message.documentUrl || message.audioUrl){
      if(socketConnection){
        socketConnection.emit('new message',{
          sender : user?._id,
          receiver : params.userId,
          text : message.text,
          imageUrl : message.imageUrl,
          videoUrl : message.videoUrl,
          documentUrl : message.documentUrl,
          audioUrl : message.audioUrl,
          msgByUserId : user?._id
        })
        setMessage({
          text : "",
          imageUrl : "",
          videoUrl : "",
          documentUrl:"",
          audioUrl: "",
        })
      }
    }
  }
  return (
    <div style={{ backgroundImage : `url(${backgroundImage})`}} className='bg-no-repeat bg-cover'>
       <header className='sticky top-0 h-16 bg-white flex justify-between items-center px-4'>
            <div className='flex items-center gap-4'>
                  <Link to={"/"} className='lg:hidden'>
                      <FaAngleLeft size={25}/>
                  </Link>
              <div>
                <Avatar
                  width={50}
                  height={50}
                  imageUrl={dataUser?.profile_pic}
                  name={dataUser?.name}
                  userId={dataUser?._id}
                />

              </div>
              <div>
              <h3 className='font-semibold text-lg my-0 text-ellipsis line-clamp-1'>{dataUser?.name}</h3>
                     <p className='-my-2 text-sm'>
                      {
                        dataUser.online ? <span className='text-primary'>online</span> : <span className='text-slate-400'>offline</span>
                      }
                     </p>
              </div>
            </div>
            <div>
                    <button className='cursor-pointer hover:text-primary'>
                      <HiDotsVertical/>
                    </button>
            </div>
       </header>

       {/** Show All Messages */}
       <section className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50'> 
              
              {/** All Message  show here */}
              <div className='flex flex-col gap-2 py-2 mx-2' ref={currentMessage}>
                  {
                      allMessage.map((msg,index)=>{
                        return (
                          <div className={` p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${user._id === msg?.msgByUserId ? "ml-auto bg-teal-100" : "bg-white"}`}>
                              <div className='w-full relative'>
                              {
                                msg?.imageUrl && (
                                  <img 
                                    src={msg?.imageUrl}
                                    className='w-full h-full object-scale-down'
                                  />
                                )
                              }
                              {
                                msg?.videoUrl && (
                                  <video
                                    src={msg.videoUrl}
                                    className='w-full h-full object-scale-down'
                                    controls
                                  />
                                )
                              }
                              {
                                msg?.audioUrl && (
                                  <audio
                                    src={msg.audioUrl}
                                    className='w-full h-full object-scale-down'
                                  />
                                )
                              }
                            </div>
                              
                              <p className='px-2'> {msg.text} </p>
                              <p className='text-xs ml-auto w-fit'>{moment(msg.createdAt).format('hh:mm')}</p>
                          </div>
                        )
                      })
                  }
              </div>

              {/** Upload Image Display  */}
              {
                  message.imageUrl && (
                    <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
                       <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600' onClick={handleClearUploadImage}>
                            <IoClose size={30}/>
                        </div>
                       <div className='bg-white p-3'>
                       <img
                        src={message.imageUrl}
                        alt="IMAGE"
                        className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                      />

                       </div>
                    </div>
                  )
              }

              {/** Upload Video Display  */}
              {
                  message.videoUrl && (
                    <div className='w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
                       <div className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600' onClick={handleClearUploadVideo}>
                            <IoClose size={30}/>
                        </div>
                       <div className='bg-white p-3'>
                       <video
                        src={message.videoUrl}
                        
                        className='aspect-square w-full h-full max-w-sm m-2 object-scale-down'
                        controls
                        muted
                        autoPlay
                      />

                       </div>
                    </div>
                  )
              }
              {
                loading && (
                  <div className='w-full h-full flex sticky bottom-0 justify-center items-center'>
                  <Loading/>
                </div>
                )
              }
       </section>
      


      {/** Send Text */}
       <section className='h-16 bg-white flex items-center px-4'>
              <div className='relative '> 
                    {/* <Emoji/> */}
                    <button onClick={handleUpload} className='flex justify-center items-center w-14 h-14 rounded-full hover:bg-primary hover:text-white'>
                       <IoMdAttach size={20}/>
                    </button>

                    {/** Video and Image  */}
                    {
                        openUpload && (
                          <div className='bg-white shadow rounded absolute bottom-16 w-36 p-2'>
                          <form>
                            <label htmlFor='uploadImage' className='flex items-center p-2 gap-3 hover:bg-slate-200 cursor-pointer'>
                              <div className='text-primary'>
                                  <FaImage size={18}/>
                              </div>
                              <p> Image </p>
                            </label>

                            <label htmlFor='uploadVideo' className='flex items-center p-2 gap-3 hover:bg-slate-200 cursor-pointer'>
                              <div className='text-purple-500'>
                                  <FaVideo size={18}/>
                              </div>
                              <p> Video </p>
                            </label>

                            <label htmlFor='uploadDocument' className='flex items-center p-2 gap-3 hover:bg-slate-200 cursor-pointer'>
                              <div >
                                  <IoDocumentTextOutline size={18}/>
                              </div>
                              <p> Document </p>
                            </label>

                            <label htmlFor='uploadAudio' className='flex items-center p-2 gap-3 hover:bg-slate-200 cursor-pointer'>
                              <div className='text-green-900'>
                                  <AiFillAudio size={18}/>
                              </div>
                              <p> Audio  </p>
                            </label>

                            <input 
                              type='file'
                              id='uploadImage'
                              onChange={handleUploadImage}
                              className='hidden'
                            />
                            <input 
                              type='file'
                              id='uploadVideo'
                              onChange={handleUploadVideo}
                              className='hidden'
                            />
                            <input 
                              type='file'
                              id='uploadDocument'
                              onChange={handleUploadDocument}
                              className='hidden'
                            />
                            <input 
                              type='file'
                              id='uploadAudio'
                              onChange={handleUploadAudio}
                              className='hidden'
                            />

                          </form>
                          </div>
                        )
                    }
                    
              </div>

              {/** Input Box */}
              <form className='h-full w-full flex gap-2' onSubmit={handleSendMessage}>
                  <input
                    type='text'
                    placeholder='Type here message...'
                    className='py-1 px-4 outline-none w-full h-full'
                    value={message.text}
                    onChange={handleOnChange}
                  />
                  <button className='text-primary hover:text-secondary'>
                      <IoMdSend size={28}/>
                  </button>
              </form>
       </section>



    </div>
  )
}

export default MessagePage
