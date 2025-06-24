import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

const OC = 'con3363'; // 사용자님의 법제처 API 키

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { query } = req.query;

  if (!query || typeof query !== 'string') {
    res.status(400).setHeader('Content-Type', 'text/plain');
    res.end('❌ query 파라미터가 필요합니다.');
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

    // HTML 에러 응답인지 감지
    if (response.data.includes('<html') || response.data.includes('<HTML')) {
      res.status(502).setHeader('Content-Type', 'text/plain');
      res.end('❌ 법제처 API에서 HTML 오류 페이지가 반환되었습니다.');
      return;
    }

    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(response.data);
  } catch (error) {
    res.status(500).setHeader('Content-Type', 'text/plain');
    res.end('❌ lawSearch API 호출 실패');
  }
}
