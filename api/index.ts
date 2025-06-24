import express, { Request, Response } from "express";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 3000;
const OC = "con3363"; // 사용자님의 법제처 API 키

// 공통 요청 함수
async function fetchLawApi(target: string, params: any): Promise<string> {
  const response = await axios.get("https://www.law.go.kr/DRF/lawService.do", {
    params: { OC, target, type: "XML", ...params },
    responseType: "text", // 그대로 문자열(XML)로 받음
  });
  return response.data;
}

// 1. 법령명 검색
app.get("/search", async (req: Request, res: Response) => {
  const { query } = req.query;
  if (!query) return res.status(400).send("query 파라미터가 필요합니다.");
  try {
    const xml = await fetchLawApi("lawSearch", { query });
    res.set("Content-Type", "application/xml");
    res.send(xml);
  } catch {
    res.status(500).send("lawSearch API 실패");
  }
});

// 2. 법령 본문
app.get("/law", async (req: Request, res: Response) => {
  const { id } = req.query;
  if (!id) return res.status(400).send("id 파라미터가 필요합니다.");
  try {
    const xml = await fetchLawApi("law", { ID: id });
    res.set("Content-Type", "application/xml");
    res.send(xml);
  } catch {
    res.status(500).send("law API 실패");
  }
});

// 3. 상세 조문
app.get("/law/contents", async (req: Request, res: Response) => {
  const { id, article } = req.query;
  if (!id || !article) return res.status(400).send("id, article 파라미터 필요");
  try {
    const xml = await fetchLawApi("lawContents", { ID: id, article });
    res.set("Content-Type", "application/xml");
    res.send(xml);
  } catch {
    res.status(500).send("lawContents API 실패");
  }
});

// 4. 지자체 조례 목록
app.get("/local-laws", async (req: Request, res: Response) => {
  const { region } = req.query;
  if (!region) return res.status(400).send("region 파라미터 필요");
  try {
    const xml = await fetchLawApi("localLawList", { region });
    res.set("Content-Type", "application/xml");
    res.send(xml);
  } catch {
    res.status(500).send("localLawList API 실패");
  }
});

// 5. 지자체 조례 본문
app.get("/local-law", async (req: Request, res: Response) => {
  const { id } = req.query;
  if (!id) return res.status(400).send("id 파라미터 필요");
  try {
    const xml = await fetchLawApi("localLaw", { ID: id });
    res.set("Content-Type", "application/xml");
    res.send(xml);
  } catch {
    res.status(500).send("localLaw API 실패");
  }
});

// 포트 설정 (Vercel 배포용)
app.listen(PORT, () => {
  console.log(`✅ 서버 실행됨: http://localhost:${PORT}`);
});
