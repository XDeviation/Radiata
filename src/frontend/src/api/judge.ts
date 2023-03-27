export interface JudgeRequest {
  src: string;
  language: string;
  time_limit: number;
  memory_limit: number;
  problem_id: number;
}

export interface JudgeResult {
  cpu_time: number;
  result: number;
  memory: number;
  real_time: number;
  signal: number;
  error: number;
  exit_code: number;
  output_md5?: string;
  test_case: string;
}

export interface JudgeResponse {
  code: number;
  data?: {
    result?: JudgeResult[];
  };
}

export async function judge<JudgeResponse>(
  params: JudgeRequest
): Promise<JudgeResponse> {
  const url = `/api/v1/judge`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return await response.json();
}
