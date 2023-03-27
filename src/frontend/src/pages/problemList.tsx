import React, { useEffect, useState } from "react";
import {
  getProblemList,
  getProblemPages,
  ProblemListResponse,
  ProblemPageResponse,
} from "../api/problem";
import ErrorPage from "./error-page";
import { Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";

interface DataType {
  key: number;
  id: number;
  name: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: "Id",
    dataIndex: "id",
    key: "id",
    render: (text) => <Link to={`/problem/${text}`}>{text}</Link>,
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text, record) => <Link to={`/problem/${record.id}`}>{text}</Link>,
  },
];
const ProblemList: React.FC = () => {
  const [nowPages, setNowPages] = useState<number>(1);
  const [totPages, setTotPages] = useState<number>(1);
  const [problemList, setProblemList] = useState<DataType[]>();

  useEffect(() => {
    getProblemPages<ProblemPageResponse>().then((response) => {
      setTotPages(response.data.total);
    });
  });

  useEffect(() => {
    setProblemList(undefined);
    getProblemList<ProblemListResponse>(nowPages).then((response) => {
      setProblemList(
        response.data.problems.map((value) => {
          return { ...value, key: value.id };
        })
      );
    });
  }, [nowPages]);

  return (
    <Table
      columns={columns}
      dataSource={problemList}
      loading={problemList === undefined}
      pagination={{
        current: nowPages,
        showSizeChanger: false,
        total: totPages,
        onChange: (e) => {
          setNowPages(e);
        },
      }}
    />
  );
};

export default ProblemList;
