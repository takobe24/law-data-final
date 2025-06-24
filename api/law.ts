import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

const OC = 'con3363'; // 법제처 API 키

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const lawId = req.query.lawId;
  if (!lawId || typeof lawId !== 'string') {
    res.status(400).json({ error: 'OC와 lawId는 필수입니다.' });
    return;
  }

  try {
    const response = await axios.get('https://www.law.go.kr/DRF/lawService.do', {
      params: {
        OC,
        target: 'lawDetail',
        type: 'XML',
        lawId
      },
      responseType: 'text'
    });
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.status(200).send(response.data);
  } catch (error: any) {
    // ↓ 반드시 any나 unknown→any로 캐스트
    console.error(error);
    res.status(500).json({ error: 'lawDetail API 호출 실패', message: error.message });
  }
}
