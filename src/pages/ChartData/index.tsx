import React, { useEffect, useState } from 'react';
import { Button, Divider, message, Table, Checkbox, Row, Col } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Link, useParams } from '@@/exports';
import { getChartDetailByIdUsingGET } from '@/services/flybi/chartController';
import * as XLSX from 'xlsx';

interface DataType {
  key: React.Key;
}

const ChartData: React.FC = () => {
  const { dataId } = useParams();
  const [headers, setHeaders] = useState<string>();
  const [tableData, setTableData] = useState<DataType[] | undefined>(undefined);
  const [columns, setColumns] = useState<ColumnsType<DataType>>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  function fetchData() {
    getChartDetailByIdUsingGET({ id: dataId })
      .then(res => {
        console.log(res); // 实际的响应数据

        // 更新表格列
        const dynamicColumns = Object.keys(res.data[0]).map((key) => ({
          title: key,
          dataIndex: key,
        }));
        setColumns(dynamicColumns);

        // 更新表格数据
        setTableData(res.data);

        // 更新选择的列，默认选择全部列
        setSelectedColumns(Object.keys(res.data[0]));
      })
      .catch(error => {
        console.error(error);
      });
  }

  useEffect(() => {
    fetchData();
  }, [dataId]);

  /*
  * 保存为xls格式
  * */


  const handleExport = () => {
    if (tableData) {
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(tableData, { header: selectedColumns });
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const excelData = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      const excelFileName = 'chart_data.xlsx';

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(excelData);
      link.setAttribute('download', excelFileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      message.error('没有可导出的数据');
    }
  };

  /*  const handleExport = () => {
    if (tableData) {
      const xlsxData = tableData.map(item => {
        const xlsxItem = {};
        for (const key in item) {
          if (Object.prototype.hasOwnProperty.call(item, key) && selectedColumns.includes(key)) {
            xlsxItem[key] = item[key];
          }
        }
        return xlsxItem;
      });

      if (xlsxData.length > 0) {
        const xlsxHeaders = selectedColumns;
        const xlsxFileName = 'chart_data.xlsx';

        const worksheet = XLSX.utils.json_to_sheet(xlsxData, { header: xlsxHeaders });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        const xlsxBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const xlsxBlob = new Blob([xlsxBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(xlsxBlob);
        link.download = xlsxFileName;
        link.click();
      } else {
        message.error('没有可导出的数据');
      }
    }
    };*/

  // 导出数据为CSV文件
  /*const handleExport = () => {
    if (tableData) {
      const csvData = tableData.map(item => {
        const csvItem: any = {};
        for (const key in item) {
          if (Object.prototype.hasOwnProperty.call(item, key) && selectedColumns.includes(key)) {
            csvItem[key] = item[key];
          }
        }
        return csvItem;
      });

      if (csvData.length > 0) {
        const csvHeaders = selectedColumns;
        const csvFileName = 'chart_data.csv';

        // 生成CSV字符串
        let csvContent = '\ufeff'; // 添加BOM头，解决中文乱码问题
        csvContent += csvHeaders.join(',') + '\n'; // 添加表头
        csvData.forEach(item => {
          const row = csvHeaders.map(header => item[header]);
          csvContent += row.join(',') + '\n'; // 添加每一行的数据
        });

        // 创建下载链接并进行导出
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(new Blob([csvContent], { type: 'text/csv;charset=UTF-8' }));
        link.setAttribute('download', csvFileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        message.error('没有可导出的数据');
      }
    }
  };*/
  const handleColumnChange = (checkedValues: any) => {
    setSelectedColumns(checkedValues);
  };

  const handleGoBack = () => {
    window.history.back(-1);
  };

  return (
    <div>
      <Row>
        <Col span={12} offset={2}>
          <Button onClick={handleGoBack}>
            返回上一级
          </Button>
          <Button onClick={handleExport}>
            导出
          </Button>
        </Col>
      </Row>

      <Divider />

      <Row>
        <Col span={20} offset={2}>
          <Checkbox.Group options={columns.map(col => col.title)} value={selectedColumns} onChange={handleColumnChange} />
          <Table
            columns={columns.filter(col => selectedColumns.includes(col.title))}
            dataSource={tableData}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ChartData;
