// api/law.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

const OC = 'con3363'; // 법제처 API 키

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { lawId } = req.query;

  // lawId 체크만 남기고 OC 체크는 제거
  if (!lawId || typeof lawId !== 'string') {
    res
      .status(400)
      .setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: 'lawId 파라미터가 필요합니다.' }));
    return;
  }

  try {
    const response = await axios.get('https://www.law.go.kr/DRF/lawService.do', {
      params: {
        OC,         // 여기서 하드코딩한 키 사용
        target: 'lawInfo',
        type: 'XML',
        lawId,
      },
      responseType: 'text',
    });

    res
      .status(200)
      .setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.send(response.data);
  } catch (err) {
    // TS 빌드 에러 안 나게 any 처리
    const error = err as any;
    console.error(error);
    res
      .status(500)
      .setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: 'lawInfo API 호출 실패' }));
  }
}
