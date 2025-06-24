// api/law.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import iconv from 'iconv-lite';

const OC = 'con3363'; // 사용자 인증 키

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { lawId } = req.query;

  if (!lawId || typeof lawId !== 'string') {
    res.status(400).setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.end('<error>lawId 파라미터가 필요합니다.</error>');
    return;
  }

  try {
    const response = await axios.get('https://www.law.go.kr/DRF/lawService.do', {
      params: {
        OC,
        target: 'law',
        type: 'XML',
        lawId,
      },
      responseType: 'arraybuffer', // EUC-KR 인코딩 대비
    });

    const decodedData = iconv.decode(Buffer.from(response.data), 'euc-kr');

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.status(200).send(decodedData);
  } catch (error) {
    res.status(500).setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.end('<error>법령 본문 조회 API 호출 실패</error>');
  }
}
