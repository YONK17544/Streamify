import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import useAuthUser from '../hooks/useAuthUser.js';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../lib/api.js';
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageList,
  MessageInput,
  Thread,
  Window
} from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import toast from 'react-hot-toast';
import ChatLoader from '../components/ChatLoader.jsx';
import CallButton from '../components/CallButton.jsx';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_SPI_KEY;

function ChatPage() {

  const {id:targetUserId } = useParams();
  
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const {authUser} = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: Boolean(authUser) // Only fetch token if user is authenticated
  });

  useEffect(() =>{
    const initChat = async () => {
      if(!tokenData?.token || !authUser) {
        console.error("No token or user data available");
        return;
      }

      try {
        console.log("Initializing stream chat client....");

        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser({
          id: authUser._id,
          name: authUser.name,
          image: authUser.profilePicture,
        }, tokenData.token);

        const channelId = [authUser._id, targetUserId].sort().join("-");

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        })

        await currChannel.watch();
        setChatClient(client);
        setChannel(currChannel);

      } catch (error) {
        console.error("Error initializing chat client:", error);
        toast.error("Could not connect to chat. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    initChat();
  }, [tokenData, authUser, targetUserId]);

  const handleVideoCall = () => {
    if(channel){
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Click here to join: ${callUrl}`,
      });

      toast.success("Video call link sent to the chat!");
    }
  }

  if(loading || !chatClient || !channel) return <ChatLoader/>

  return (
    <>
      <div className = "h-[93vh]">
        <Chat client = {chatClient}>
          <Channel channel = {channel}>
            <div className = "w-full relative">
              <CallButton handleVideoCall = {handleVideoCall}/>
              <Window>
                <ChannelHeader/>
                <MessageList />
                <MessageInput focus />
              </Window>
            </div>
            <Thread/>
          </Channel>
        </Chat>
      </div>
    </>
  )
}

export default ChatPage
