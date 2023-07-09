import React, { useEffect, useState } from 'react';
import { Avatar, Card, Col, Divider, Input, List, message, Row } from 'antd';
import Meta from 'antd/es/card/Meta';
import { history } from '@umijs/max';
import { async } from 'rxjs';
import { listAiModelUsingGET, listAiModelUsingPOST } from '@/services/flybi/aiModelController';

const { Search } = Input;

/**
 * 我的图表
 * @constructor
 */
const ListAllPage: React.FC = () => {
  const [aiName, setAiName] = useState<string>();
  const [AiModelList, setAiModelList] = useState<API.Aimodel[]>();
  const [AIId, setAIId] = useState<number>();
  const [loading, setLoading] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string>('');


  const loadAllData = async () => {
    setLoading(true);
    const res = await listAiModelUsingGET({
      aName: searchValue,
    });
    if (res) {
      // console.log(res);
      setAiModelList(res?.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAllData();
  }, [searchValue]);


  function handleCardClick(airoute: any, id: any) {
    if (airoute === '/more') {
      message.success('等待加入更多功能');
      return;
    }
    localStorage.setItem('AIId', id.toString());
    history.push(airoute);
  }


  return (
    <div className={'list-all-page'}>
      <Divider />
      <div>
        <Search placeholder="请输入AI名称" loading={loading} enterButton onSearch={(value) => {
          setSearchValue(value);
        }} />
      </div>
      <Divider />
      <List
        dataSource={AiModelList}
        itemLayout="vertical"
        grid={{ gutter: 16, xs: 1, sm: 1, md: 1, lg: 4, xl: 4, xxl: 4 }}
        renderItem={(item, index) => (
          <List.Item key={item.id}>
            <Card
              hoverable={true}
              onClick={() => handleCardClick(item.airoute, item.id)}>
              <List.Item.Meta
                avatar={<Avatar src={item.aiavatar} />}
                title={<div className="list-item-title">{item.ainame}</div>}
                description={<div className="list-item-description">{item.aidescription}</div>}>
              </List.Item.Meta>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};


export default ListAllPage;
