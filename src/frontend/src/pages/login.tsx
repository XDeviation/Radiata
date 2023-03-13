import React from "react";
import { Button, Form, Input, Divider } from "antd";
import { Link } from "react-router-dom";

const onFinish = (values: any) => {
  console.log("Success:", values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};

const Login: React.FC = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      flexWrap: "nowrap",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      style={{
        display: "flex",
        flexWrap: "nowrap",
        flexDirection: "column",
        alignItems: "center",
      }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="username"
        style={{ marginTop: "16px" }}
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <Button>
            <Link to="/resigner">Resigner</Link>
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              marginLeft: "16px",
            }}
          >
            Sign In
          </Button>
        </div>
      </Form.Item>
    </Form>
    <Divider
      type="vertical"
      style={{
        height: "150px",
      }}
    />
    <Button> Sign with Github</Button>
  </div>
);

export default Login;
