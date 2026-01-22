import fs from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

// JSON dosyasının yolu (Fallback için)
const dataFilePath = path.join(process.cwd(), 'data', 'issues.json');

// Azure SQL kontrolü
const isSqlTarget = !!process.env.AZURE_SQL_DATABASE;

// Yardımcı fonksiyon: Verileri oku
async function getIssues() {
  if (isSqlTarget) {
    try {
      const { executeQuery } = await import('@/lib/db');
      const results = await executeQuery('SELECT * FROM issues ORDER BY createdAt DESC');
      return results.map(row => ({
        ...row,
        detectedTags: typeof row.detectedTags === 'string' ? JSON.parse(row.detectedTags) : row.detectedTags
      }));
    } catch (err) {
      console.error('SQL fetch failed, falling back to JSON:', err);
    }
  }

  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export async function GET() {
  try {
    const issues = await getIssues();
    return NextResponse.json(issues);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch issues' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.title || !body.location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newIssue = {
      id: crypto.randomUUID(),
      title: body.title,
      location: body.location,
      status: 'pending',
      category: body.category || 'General',
      createdAt: new Date().toISOString(),
      severity: body.severity || 'Medium',
      detectedTags: Array.isArray(body.detectedTags) ? body.detectedTags : [],
      description: body.description || '',
      imageUrl: body.imageUrl || ''
    };

    if (isSqlTarget) {
      try {
        const { executeQuery } = await import('@/lib/db');
        const query = `
          INSERT INTO issues (id, title, location, status, category, createdAt, severity, detectedTags, description, imageUrl)
          VALUES ('${newIssue.id}', '${newIssue.title}', '${newIssue.location}', '${newIssue.status}', '${newIssue.category}', '${newIssue.createdAt}', '${newIssue.severity}', '${JSON.stringify(newIssue.detectedTags)}', '${newIssue.description}', '${newIssue.imageUrl}')
        `;
        await executeQuery(query);
        return NextResponse.json(newIssue, { status: 201 });
      } catch (err) {
        console.error('SQL save failed, falling back to JSON:', err);
      }
    }

    const issues = await getIssues();
    issues.unshift(newIssue);
    await fs.writeFile(dataFilePath, JSON.stringify(issues, null, 2), 'utf8');

    return NextResponse.json(newIssue, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save issue' }, { status: 500 });
  }
}
