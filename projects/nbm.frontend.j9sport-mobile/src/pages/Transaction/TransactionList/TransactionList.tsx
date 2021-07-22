import React, { useEffect, useState } from 'react';
import InfiniteScroll from "react-infinite-scroller";
import EmptyList from "../../../components/common/EmptyList";

function TransactionList(
  {
    dataSource,
    columns,
    rowKey,
    hasMore,
    loadMore
  }: {
    dataSource: any
    columns: Array<{
      title: string
      dataIndex: string
      key?: string
      render?: Function
      color?: Function
      default?: string
      header?: boolean
    }>,
    rowKey: string
    hasMore: boolean
    loadMore: Function
  }
) {
  const [data, setData] = useState([])

  useEffect(() => {
    const data = dataSource.map((data: any) => {
      const list = columns.map((col, index) => {
        const newColData = {
          ...col,
          value: data[col.dataIndex] || col.default,
          key: col.key ? data[col.key] : index
        }
        if (!!col.render) {
          newColData.value = col.render(data[col.dataIndex],data)
        }
        if (!!col.color) {
          newColData.color = col.color(data[col.dataIndex])
        }
        return newColData
      })

      return {
        header: list.find((item) => item.header),
        key: data[rowKey],
        list: list.filter((item) => !item.header)
      }
    })
    setData(data)
  }, [dataSource])

  if (dataSource.length === 0) {
    return <EmptyList style={{marginTop: '30%'}}/>;
  }

  return (
    <InfiniteScroll
      className={"transaction-list"}
      initialLoad={false}
      pageStart={0}
      useWindow
      hasMore={hasMore}
      loadMore={(page) => loadMore(page)}
    >
      {
        data.map((item: any) => (
          <ul
            key={item.key}
          >
            {
              item.header
              &&
              <header>
                <span>{item.header.title}</span>
                <span style={{color: item.header.color}}>{item.header.value}</span>
              </header>
            }
            {
              item.list.map((col: any) => (
                <li key={col.key}>
                  <span>{col.title}</span>
                  <span style={{color: col.color}}>{col.value}</span>
                </li>
              ))
            }
          </ul>
        ))
      }
    </InfiniteScroll>
  );
}

export default TransactionList;