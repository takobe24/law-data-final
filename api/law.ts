import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import iconv from 'iconv-lite';

const OC = 'con3363'; // ← 법제처에서 발급받은 YOUR_API_KEY

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { lawId } = req.query;

  // 1) lawId 체크
  if (!lawId || typeof lawId !== 'string') {
    res
      .status(400)
      .setHeader('Content-Type', 'application/xml; charset=utf-8')
      .end(`<error>lawId 파라미터가 필요합니다.</error>`);
    return;
  }

  try {
    // 2) API 호출 (EUC-KR → UTF-8 디코딩)
    const response = await axios.get('https://www.law.go.kr/DRF/lawService.do', {
      params: {
        OC,
        target: 'lawDetail',
        type: 'XML',
        lawId,
      },
      responseType: 'arraybuffer',
    });
    const decoded = iconv.decode(Buffer.from(response.data), 'euc-kr');

    // 3) 성공 응답
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.status(200).send(decoded);
  } catch (err) {
    // 4) 실패 응답
    res
      .status(500)
      .setHeader('Content-Type', 'application/xml; charset=utf-8')
      .end(`<error>lawDetail API 호출 실패</error>`);
  }
}
