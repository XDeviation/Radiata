export interface ProblemListResponse {
  code: number;
  data: {
    problems: {
      id: number;
      name: string;
    }[];
  };
}

export interface ProblemPageResponse {
  code: number;
  data: { total: number };
}

export async function getProblemList<ProblemListResponse>(
  page = 1
): Promise<ProblemListResponse> {
  const url = `/api/v1/problem_list?page=${page}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return await response.json();
}

export async function getProblemPages<
  ProblemPageResponse
>(): Promise<ProblemPageResponse> {
  const url = `/api/v1/total_pages`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return await response.json();
}
