// api/law.ts

import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';

const BASE_URL = 'https://www.law.go.kr/DRF/lawService.do';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { OC, lawId } = req.query;

  if (!OC || !lawId) {
    return res.status(400).json({ error: 'OC와 lawId는 필수입니다.' });
  }

  try {
    const url = `${BASE_URL}?OC=${OC}&target=lawView&lawId=${lawId}&type=XML`;
    const response = await axios.get(url, { responseType: 'text' });
    const xml = response.data;

    const accept = req.headers.accept || '';
    const wantsJson = accept.includes('application/json');

    if (wantsJson) {
      const json = await parseStringPromise(xml, { explicitArray: false });
      return res.status(200).json(json);
    } else {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.status(200).send(xml);
    }

  } catch (error) {
    return res.status(500).json({ error: '법령 상세 조회 실패', detail: error.message });
  }
}