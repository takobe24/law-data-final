import { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

const OC = "con3363"; // 법제처 API 사용자 아이디

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { path, id, query, article, region } = req.query;

  let target = "";
  let params: Record<string, any> = {};

  switch (path) {
    case "search":
      if (!query) return res.status(400).send("<error>query 파라미터 필요</error>");
      target = "lawSearch";
      params = { query };
      break;
    case "law":
      if (!id) return res.status(400).send("<error>id 파라미터 필요</error>");
      target = "law";
      params = { ID: id };
      break;
    case "contents":
      if (!id || !article)
        return res.status(400).send("<error>id, article 파라미터 필요</error>");
      target = "lawContents";
      params = { ID: id, article };
      break;
    case "local-list":
      if (!region) return res.status(400).send("<error>region 파라미터 필요</error>");
      target = "localLawList";
      params = { region };
      break;
    case "local-law":
      if (!id) return res.status(400).send("<error>id 파라미터 필요</error>");
      target = "localLaw";
      params = { ID: id };
      break;
    default:
      return res.status(400).send("<error>올바른 path 값을 지정하세요</error>");
  }

  try {
    const response = await axios.get("https://www.law.go.kr/DRF/lawService.do", {
      params: {
        OC,
        target,
        type: "XML",
        ...params,
      },
      responseType: "text",
    });

    res.setHeader("Content-Type", "application/xml");
    res.status(200).send(response.data);
  } catch (err) {
    res.status(500).send("<error>API 호출 실패</error>");
  }
}
