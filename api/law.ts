import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import iconv from 'iconv-lite';

const OC = 'con3363'; // 법제처 API 키

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const { lawId } = req.query;
  if (!lawId || typeof lawId !== 'string') {
    res
      .status(400)
      .setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.end('<error>lawId 파라미터가 필요합니다.</error>');
    return;
  }

  try {
    const response = await axios.get(
      'https://www.law.go.kr/DRF/lawService.do',
      {
        params: {
          OC,
          target: 'getLawInfo',  // 법조문 상세 조회
          type: 'XML',
          lawId,
        },
        responseType: 'arraybuffer', // 반드시 arraybuffer 로
      }
    );

    // EUC-KR → UTF-8 디코딩
    const xml = iconv.decode(Buffer.from(response.data), 'euc-kr');

    res
      .status(200)
      .setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.send(xml);
  } catch (error: any) {
    const msg = error instanceof Error ? error.message : String(error);
    res
      .status(500)
      .setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.end(`<error>getLawInfo API 호출 실패: ${msg}</error>`);
  }
}
