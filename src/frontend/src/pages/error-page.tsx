import { Link, useRouteError } from "react-router-dom";
import { Result, Button } from "antd";
interface ErrorProps {
  statusText?: string;
  message?: string;
  status: 404 | 403 | 500;
}

export default function ErrorPage() {
  const error = useRouteError() as ErrorProps;

  return (
    <Result
      status={error.status}
      title={error.status}
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button>
          <Link to="/">Back Home</Link>
        </Button>
      }
    />
  );
}
