import { generateArticle } from '../../actions';

export async function POST(request) {
  const { prompt } = await request.json();
  return await generateArticle(prompt);
}
