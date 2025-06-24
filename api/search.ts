import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import iconv from 'iconv-lite';

const OC = 'con3363'; // 여기에 본인의 법제처 API 사용자 인증키 작성

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { query } = req.query;

  if (!query || typeof query !== 'string') {
    res.status(400).setHeader('Content-Type', 'application/xml; charset=utf-8');
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
      responseType: 'arraybuffer', // EUC-KR 수신
    });

    const decodedData = iconv.decode(Buffer.from(response.data), 'euc-kr');

    // ⛔ HTML 에러 페이지 방지
    if (decodedData.includes('<html') || decodedData.includes('<!DOCTYPE html')) {
      res.status(502).setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('❌ 법제처 API에서 HTML 오류 페이지를 반환했습니다.\n검색어를 더 구체적으로 입력해 보세요.');
      return;
    }

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.status(200).send(decodedData);
  } catch (error) {
    res.status(500).setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.end(`<error>lawSearch API 호출 실패</error>`);
  }
}
