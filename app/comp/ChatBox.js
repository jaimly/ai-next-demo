"use client"

import React, { useState, useEffect } from 'react';
import { List, Input, Button, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { request } from '../api/request';

const ChatBox = () => {
  const [messages, setMessages] = useState([{
    key: Date.now(), 
    author: '',
    content: 'Hello!',
  }]);
  const [inputValue, setInputValue] = useState('React是什么?');
  const [btnName, setBtnName] = useState('发送');

  useEffect(() => {
    const list = document.getElementById('list');
    list.scrollTop = list.scrollHeight;
  }, [messages]);
 
  const handleSendMessage = async () => {
    const msg = inputValue.trim();
    if (!msg) return;

    const arr = [...messages, {
      key: Date.now(), 
      author: 'user',
      content: inputValue,
    }];
    setMessages(arr);
    setInputValue('');
    setBtnName('等候');

    const content = await request('/openai', 'POST', {message: msg});
    setMessages([...arr, {
      key: Date.now(),
      author: '',
      content
    }]);
    setBtnName('发送');
  };
 
  return (
    <div style={{
      margin: '10px 20px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <List
        id='list'
        itemLayout="horizontal"
        dataSource={messages}
        style={{ 
          height: '90vh',
          marginBottom: 5,
          overflowY: 'auto'
        }}
        renderItem={item => (
          <List.Item  style={{
            borderBlockEnd: 0,
            display: 'flex',
            flexDirection: 'column', 
            alignItems: item.author === 'user' ? 'flex-end' : 'flex-start'
          }}>
            <List.Item.Meta 
              avatar={<UserOutlined />} 
              title={item.author === 'user' ? 'You' : 'root'} 
              description={item.content}
            />
          </List.Item>
        )}
      />
      <div style={{
        display: 'flex',
        gap: 10
      }}>
        <Input 
          value={inputValue} 
          onChange={e => setInputValue(e.target.value)} 
        />
        <Button onClick={handleSendMessage} type="primary" disabled={btnName==='等候'}>{btnName}</Button>
      </div>
    </div>
  );
};
 
export default ChatBox;