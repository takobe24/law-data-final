import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

const OC = 'con3363'; // ← 본인의 법제처 API 키

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { lawId } = req.query;

  // 1) 필수 파라미터 검증
  if (!OC || !lawId || typeof lawId !== 'string') {
    res.status(400).json({ error: 'OC와 lawId는 필수입니다.' });
    return;
  }

  try {
    // 2) 외부 API 호출 (lawId 이용)
    const response = await axios.get('https://www.law.go.kr/DRF/lawService.do', {
      params: {
        OC,
        target: 'law',
        type: 'XML',
        lawId
      },
      responseType: 'arraybuffer'
    });

    // 3) EUC-KR 디코딩
    const decoded = Buffer.from(response.data).toString('utf-8');

    // 4) 결과 전송
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.status(200).send(decoded);
  } catch (error: any) {
    // — catch(error: any) 로 타입 오류 해결
    res.status(500).json({ error: '법령 상세 조회 API 호출 중 오류가 발생했습니다.' });
  }
}
