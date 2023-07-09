import { Avatar, Button, Card, Col, Divider, Input, List, Row, Skeleton } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { sendAndReceiveMessageUsingPOST } from '@/services/flybi/aiChatController';

interface DataType {
  name: string;
  avatar: string;
  content: string;
  updateTime: Date
}

const ChatBox = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataType[]>([]);
  const [text, setText] = useState<string>('');
  const scrollableDivRef = useRef<HTMLDivElement>(null);
  const endOfChatRef = useRef<HTMLDivElement>(null);
  const latestUpdateTimeRef = useRef<HTMLDivElement>(null);

  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMoreData()
  }, [data]);


  const handleSend = () => {
    const newMessage = {
      name: 'hello',
      avatar: 'https://picsum.photos/200/300',
      content: text,
      updateTime: new Date(),
    };

    const updatedData = [...data, newMessage];
    setData(updatedData);
    setText('');

    const responseMessage: DataType = {
      name: 'Backend',
      avatar: 'https://picsum.photos/200/300',
      content: 'ok',
      updateTime: new Date(),
    };
    const updatedResponseData = [...updatedData, responseMessage];
    setData(updatedResponseData);
    scrollToLatestUpdateTime();

  };

  const scrollToLatestUpdateTime = () => {
    if (latestUpdateTimeRef.current) {
      latestUpdateTimeRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSend();
    }
    scrollToBottom();
  };

  const scrollToBottom = () => {
    if (endOfChatRef.current) {
      endOfChatRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  /**
   * 格式化时间**/
  const formatDate = (dateTimeString: any) => {
    const date = new Date(dateTimeString);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
      .getDate()
      .toString()
      .padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <Card>
        <div id="scrollableDiv"
             ref={scrollableDivRef}
             style={{
               height: 500,
               overflow: 'auto',
               padding: '0 16px',
               border: '1px solid rgba(140, 140, 140, 0.35)',
             }}>
          < Card>
            {/*滚动*/}
            <InfiniteScroll
              dataLength={data.length}
              next={loadMoreData}
              hasMore={data.length < 50}
              loader={<Skeleton avatar paragraph={{ rows: 1 }} loading={loading} />}
              endMessage={
                <div ref={endOfChatRef}>
                  <Divider plain>It is all, nothing more 🤐</Divider>
                </div>
              }
              scrollableTarget="scrollableDiv"
            >
              <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item, index) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={item.avatar} />}
                      title={item.name+"                "+formatDate(item.updateTime)+ ''}
                    />
                    {item.content}
                  </List.Item>
                )}
              />
            </InfiniteScroll>

          </Card>
        </div>
        <Divider />
        <Row>
          <Col span={22}>
            <Input style={{ width: '100%', height: '100%' }} placeholder={'请输入你的问题'} maxLength={1024} value={text}
                   onChange={(e) => setText(e.target.value)}
                   onKeyPress={handleKeyPress}
            >
            </Input>
          </Col>
          <Col span={2} onClick={handleSend}>
            <Button>
              发送
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ChatBox;
