import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

const OC = 'con3363'; // 사용자님의 법제처 API 키

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { query } = req.query;

  if (!query || typeof query !== 'string') {
    res.status(400).setHeader('Content-Type', 'application/xml');
    res.end(`<error>query 파라미터가 필요합니다.</error>`);
    return;
  }

  try {
    const response = await axios.get('https://www.law.go.kr/DRF/lawService.do', {
      params: {
        OC,
        target: 'lawSearch',
        type: 'XML',
        query,
      },
      responseType: 'text',
    });

    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(response.data);
  } catch (error) {
    res.status(500).setHeader('Content-Type', 'application/xml');
    res.end(`<error>lawSearch API 호출 실패</error>`);
  }
}
