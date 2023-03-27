import { Spin } from "antd";
import React, { useEffect, useState } from "react";
import { Marked, Renderer } from "@ts-stack/markdown";

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

const Sandbox: React.FC = () => {
  const [sandboxPort, setSandboxPort] = useState<number>();
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/api/v1/ws/sandbox");
    ws.onmessage = function (event) {
      setSandboxPort(parseInt(event.data));
    };
  }, []);
  const md = "This is a example\n\nhave a try!\n```\n$ ls```";

  return (
    <div style={{ width: "100%" }}>
      <td
        style={{ overflowWrap: "anywhere" }}
        dangerouslySetInnerHTML={{ __html: Marked.parse(md) }}
      />
      {sandboxPort ? (
        <iframe
          style={{ width: "100%" }}
          src={`http://localhost:${sandboxPort}`}
          title="terminal"
        ></iframe>
      ) : (
        <Spin></Spin>
      )}
    </div>
  );
};

export default Sandbox;
