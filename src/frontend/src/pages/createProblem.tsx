import React, { useState } from "react";
import { Marked, Renderer } from "@ts-stack/markdown";
import { Col, Steps, Row, Tag, Tabs, Select, Button } from "antd";
import type { TabsProps } from "antd";
import { judge, JudgeRequest, JudgeResponse, JudgeResult } from "../api/judge";
import MonacoEditor from "react-monaco-editor";
Marked.setOptions({
  renderer: new Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
});
const style: React.CSSProperties = {
  background: "#D3D3D3",
  padding: "8px 16px",
  margin: "16px 0",
};
type Language =
  | "c"
  | "cpp"
  | "java"
  | "python2"
  | "python3"
  | "golang"
  | "php"
  | "javascript";
const languages: Language[] = [
  "c",
  "cpp",
  "java",
  "python2",
  "python3",
  "golang",
  "php",
  "javascript",
];
type StepItemStatusProps = "wait" | "process" | "finish" | "error";
const Problem: React.FC = () => {
  const [src, setSrc] = useState<string>("");
  const [currentTab, setCurrentTab] = useState<string>("1");
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [language, setLanguage] = useState<Language>("c");
  const [submitted, setSubmitted] = useState<StepItemStatusProps>("wait");
  const [judged, setJudged] = useState<StepItemStatusProps>("wait");
  const [accepted, setAccepted] = useState<StepItemStatusProps>("wait");
  const [judgeResult, setJudgeResult] = useState<string>("Accept");
  const [timeLimit, setTimeLimit] = useState<number>(1000);
  const [memoryLimit, setMemoryLimit] = useState<number>(1024 * 1024 * 128);
  const [problemId, setProblemId] = useState<number>(1001);

  const md =
    "## I am using __markdown__.\n## Test problem\nthis is a looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong string";

  const initSubmit = () => {
    setCurrentStep(1);
    setCurrentTab("3");
    setSubmitted("finish");
    setJudged("process");
    setAccepted("wait");
    setJudgeResult("Waiting");
  };
  const acceptedSubmit = () => {
    setJudged("finish");
    setAccepted("finish");
    setJudgeResult("Accept");
  };

  const failedSubmit = (
    code: number = 0,
    result: JudgeResult | undefined = undefined
  ) => {
    setJudged("finish");
    setAccepted("error");
    if (code === 1) {
      // Compile Error
      setJudgeResult("Compile Error");
      return;
    }
    if (result) {
      if (result.cpu_time > timeLimit) {
        setJudgeResult("Time Limit Exceeded");
      } else if (result.memory > memoryLimit) {
        setJudgeResult("Memory Limit Exceeded");
      } else {
        setJudgeResult("Wrong Answer");
      }
    }
  };

  async function onSubmit() {
    const params: JudgeRequest = {
      src,
      language,
      time_limit: timeLimit,
      memory_limit: memoryLimit,
      problem_id: problemId,
    };
    initSubmit();
    judge<JudgeResponse>(params).then((res) => {
      console.log(res);
      const result = res.data?.result;
      const code = res.code;

      console.log(result);
      if (result === undefined) {
        setJudged("error");
        return;
      }

      if (code === 1) {
        failedSubmit(1);
        return;
      }

      for (let i = 0; i < result.length; i++) {
        if (result[i].result !== 0) {
          failedSubmit(0, result[i]);
          return;
        }
      }
      acceptedSubmit();
    });
  }
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `Problem`,
      children: (
        <td
          style={{ overflowWrap: "anywhere" }}
          dangerouslySetInnerHTML={{ __html: Marked.parse(md) }}
        />
      ),
    },
    {
      key: "2",
      label: `Submit`,
      children: (
        <div>
          <Select<Language>
            value={language}
            onChange={(value) => {
              setLanguage(value);
            }}
            style={{ width: 120 }}
            options={languages.map((value) => {
              return { value, label: value };
            })}
          ></Select>
          <Button style={{ marginLeft: "16px" }} onClick={onSubmit}>
            Submit
          </Button>
          <div style={{ marginTop: "8px" }}>
            <MonacoEditor
              width="100%"
              height={window.innerHeight - 310}
              theme="vs-dark"
              value={src}
              onChange={(value) => {
                setSrc(value);
              }}
              options={{
                selectOnLineNumbers: true,
                matchBrackets: "near",
              }}
            />
          </div>
        </div>
      ),
    },
    {
      key: "3",
      label: `Status`,
      children: (
        <Steps
          current={currentStep}
          size="small"
          items={[
            {
              title: "Submitted",
              status: submitted,
            },
            {
              title: "Judging",
              status: judged,
            },
            {
              title: judgeResult,
              status: accepted,
            },
          ]}
        ></Steps>
      ),
    },
  ];

  return (
    <Row gutter={[16, 24]}>
      <Col className="gutter-row" span={18}>
        <div style={style}>
          <Tabs
            activeKey={currentTab}
            items={items}
            onChange={(key) => setCurrentTab(key)}
          />
        </div>
      </Col>
      <Col className="gutter-row" span={6}>
        <div style={style}>Time Limit: {timeLimit} ms</div>
        <div style={style}>Memory Limit: {memoryLimit / 1024 / 1024} MB</div>
        <div style={style}>
          Tags:
          <Tag style={{ margin: "4px" }} color="magenta">
            magenta
          </Tag>
          <Tag style={{ margin: "4px" }} color="red">
            red
          </Tag>
          <Tag style={{ margin: "4px" }} color="volcano">
            volcano
          </Tag>
          <Tag style={{ margin: "4px" }} color="orange">
            orange
          </Tag>
          <Tag style={{ margin: "4px" }} color="gold">
            gold
          </Tag>
          <Tag style={{ margin: "4px" }} color="lime">
            lime
          </Tag>
          <Tag style={{ margin: "4px" }} color="green">
            green
          </Tag>
          <Tag style={{ margin: "4px" }} color="cyan">
            cyan
          </Tag>
          <Tag style={{ margin: "4px" }} color="blue">
            blue
          </Tag>
          <Tag style={{ margin: "4px" }} color="geekblue">
            geekblue
          </Tag>
          <Tag style={{ margin: "4px" }} color="purple">
            purple
          </Tag>
        </div>
      </Col>
    </Row>
  );
};

export default Problem;
