import { supabase } from '@/lib/supabase';
import fs from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export const dynamic = 'force-dynamic';

// Path to JSON file (Fallback)
const dataFilePath = path.join(process.cwd(), 'data', 'issues.json');

// Helper function: Get issues
async function getIssues() {
  // Try Supabase first
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const { data, error } = await supabase
        .from('issues')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        return data.map(row => ({
          ...row,
          // If stored as text in DB, parse it. If JSONB, it's already an object/array.
          detectedTags: typeof row.detectedTags === 'string' ? JSON.parse(row.detectedTags) : row.detectedTags
        }));
      }
    } catch (err) {
      console.error('Supabase fetch failed, falling back to JSON:', err);
    }
  }

  // Fallback to local JSON
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

    // Try saving to Supabase
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      try {
        const { error } = await supabase
          .from('issues')
          .insert([newIssue]);

        if (error) {
          throw error;
        }

        return NextResponse.json(newIssue, { status: 201 });
      } catch (err) {
        console.error('Supabase save failed, falling back to JSON:', err);
      }
    }

    // Fallback to local JSON
    const issues = await getIssues();
    issues.unshift(newIssue);
    await fs.writeFile(dataFilePath, JSON.stringify(issues, null, 2), 'utf8');

    return NextResponse.json(newIssue, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save issue' }, { status: 500 });
  }
}
