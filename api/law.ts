import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { lawId } = req.query;

  if (!lawId || typeof lawId !== 'string') {
    return res.status(400).json({ error: '법령 ID(lawId)가 유효하지 않습니다.' });
  }

  try {
    const response = await axios.get(
      `https://www.law.go.kr/DRF/lawService.do`,
      {
        params: {
          OC: '발급받은 API ID',
          target: 'law',
          type: 'XML',
          lawId: lawId
        }
      }
    );

    res.setHeader('Content-Type', 'text/xml'); // XML 응답 그대로 내보냄
    res.status(200).send(response.data);
  } catch (error: any) {
    res.status(500).json({
      message: '법제처 API 요청 중 오류 발생',
      detail: error.message
    });
  }
}
