import fs from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

// JSON dosyasının yolu
const dataFilePath = path.join(process.cwd(), 'data', 'issues.json');

// Yardımcı fonksiyon: Verileri oku
async function getIssues() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Dosya yoksa boş dizi döndür
    return [];
  }
}

// Yardımcı fonksiyon: Verileri yaz
async function saveIssues(issues: any[]) {
  await fs.writeFile(dataFilePath, JSON.stringify(issues, null, 2), 'utf8');
}

export async function GET() {
  try {
    const issues = await getIssues();
    // En yeni en üstte olacak şekilde sırala
    issues.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json(issues);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch issues' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Basit validasyon
    if (!body.title || !body.location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const issues = await getIssues();
    
    const newIssue = {
      id: crypto.randomUUID(),
      title: body.title,
      location: body.location,
      status: 'pending', // Varsayılan durum
      category: body.category || 'General',
      createdAt: new Date().toISOString(),
      severity: body.severity || 'Medium',
      detectedTags: body.detectedTags || [],
      description: body.description || '',
      imageUrl: body.imageUrl || '' // Şimdilik sadece yer tutucu veya base64
    };

    issues.unshift(newIssue); // En başa ekle
    await saveIssues(issues);

    return NextResponse.json(newIssue, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save issue' }, { status: 500 });
  }
}
