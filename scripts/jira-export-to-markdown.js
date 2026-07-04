#!/usr/bin/env node
/**
 * Convert Jira issue JSON exports to markdown acceptance-criteria specs.
 * Usage: node scripts/jira-export-to-markdown.js
 */
const fs = require('fs');
const path = require('path');

const RAW_DIR = path.join(__dirname, '../docs/tickets/_raw');
const OUT_DIR = path.join(__dirname, '../docs/tickets');
const TICKETS = ['ROKJ-3', 'ROKJ-15', 'ROKJ-16', 'ROKJ-17', 'ROKJ-18', 'ROKJ-22'];

function textFromInline(content = []) {
  return content
    .map((node) => {
      if (node.type === 'text') {
        let t = node.text || '';
        if (node.marks?.some((m) => m.type === 'strong')) t = `**${t}**`;
        if (node.marks?.some((m) => m.type === 'em')) t = `*${t}*`;
        return t;
      }
      if (node.type === 'hardBreak') return '\n';
      if (node.content) return textFromInline(node.content);
      return '';
    })
    .join('');
}

function taskItemLabel(item) {
  return (item.content || [])
    .flatMap((node) => {
      if (node.type === 'text') return [node.text || ''];
      if (node.type === 'paragraph') return [textFromInline(node.content)];
      return [];
    })
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
}

function nestedLists(item) {
  return (item.content || []).filter((n) => n.type === 'taskList' || n.type === 'bulletList');
}

function acceptanceCriteriaToMarkdown(doc) {
  if (!doc) return '';
  if (typeof doc === 'string') return doc;

  const lines = [];

  function walk(nodes, indent = 0) {
    for (const node of nodes || []) {
      switch (node.type) {
        case 'paragraph': {
          const t = textFromInline(node.content).trim();
          if (t) lines.push(`${'  '.repeat(indent)}**${t}**`);
          break;
        }
        case 'heading': {
          const t = textFromInline(node.content).trim();
          if (t) lines.push(`${'  '.repeat(indent)}### ${t}`);
          break;
        }
        case 'bulletList':
          for (const item of node.content || []) {
            if (item.type !== 'listItem') continue;
            const text = textFromInline(item.content).replace(/\s+/g, ' ').trim();
            lines.push(`${'  '.repeat(indent)}- ${text}`);
            for (const child of item.content || []) {
              if (child.type === 'bulletList' || child.type === 'taskList') walk([child], indent + 1);
            }
          }
          break;
        case 'taskList': {
          const items = node.content || [];
          for (let i = 0; i < items.length; i += 1) {
            const child = items[i];
            if (child.type === 'taskList') {
              walk([child], indent);
              continue;
            }
            if (child.type !== 'taskItem') continue;

            const label = taskItemLabel(child);
            const inlineChildren = nestedLists(child);
            const next = items[i + 1];
            const state = child.attrs?.state || 'TODO';
            const box = state === 'DONE' ? '[x]' : '[ ]';

            if (label.endsWith(':') && (inlineChildren.length > 0 || next?.type === 'taskList')) {
              lines.push(`${'  '.repeat(indent)}**${label.slice(0, -1).trim()}**`);
              for (const list of inlineChildren) walk([list], indent);
              if (next?.type === 'taskList') {
                walk([next], indent);
                i += 1;
              }
            } else {
              lines.push(`${'  '.repeat(indent)}- ${box} ${label}`);
              for (const list of inlineChildren) walk([list], indent + 1);
            }
          }
          break;
        }
        default:
          if (node.content) walk(node.content, indent);
      }
    }
  }

  walk(doc.content || []);
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

function shortTitle(summary = '') {
  return summary.replace(/^Flow \| Prototype wireframe \| /, '').trim() || summary;
}

function cleanCommentText(text = '') {
  return text
    .replace(/<custom[^>]*>([^<]*)<\/custom>/g, '$1')
    .replace(/\\(\*|_)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseReviewItems(comments = []) {
  const items = [];
  for (const comment of comments) {
    const body = comment.body;
    if (typeof body !== 'string' || !/not approved/i.test(body)) continue;

    for (const line of body.split('\n')) {
      if (!line.trim().startsWith('|')) continue;
      if (line.includes('---') || /summary/i.test(line)) continue;

      const cells = line
        .split('|')
        .map((c) => cleanCommentText(c.replace(/\*\*/g, '')))
        .filter(Boolean);
      if (cells.length < 2 || !/^\d+$/.test(cells[0])) continue;

      const summary = cells[1];
      const description = cells[2] || '';
      if (!summary || summary === 'undefined') continue;

      items.push({ id: comment.id, summary, description });
    }
  }
  return items;
}

function normalizeForMatch(text = '') {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function isDuplicateReviewItem(item, acText) {
  const hay = normalizeForMatch(acText);
  const summary = normalizeForMatch(item.summary);
  const description = normalizeForMatch(item.description);

  if (summary.length <= 10 || !hay.includes(summary)) return false;
  if (!description || description.length < 15) return true;
  return hay.includes(description.slice(0, Math.min(description.length, 60)));
}

function reviewItemsToMarkdown(items, acText) {
  const unique = items.filter((item) => !isDuplicateReviewItem(item, acText));
  if (!unique.length) return '';

  const lines = ['', '**Review updates**'];
  for (const item of unique) {
    const detail = item.description ? ` — ${item.description}` : '';
    lines.push(`- [ ] ${item.summary}${detail}`);
  }
  return lines.join('\n');
}

function issueToMarkdown(issue) {
  const f = issue.fields || {};
  const title = shortTitle(f.summary);
  const ac = acceptanceCriteriaToMarkdown(f.customfield_10057);
  const comments = f.comment?.comments || issue.comments || [];
  const review = reviewItemsToMarkdown(parseReviewItems(comments), ac);

  return [`# ${issue.key}: ${title}`, '', ac || '_No acceptance criteria._', review, ''].join('\n');
}

if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

let written = 0;

const searchExport = path.join(RAW_DIR, '_search-export.json');
if (fs.existsSync(searchExport)) {
  const search = JSON.parse(fs.readFileSync(searchExport, 'utf8'));
  for (const issue of search.issues || []) {
    fs.writeFileSync(path.join(RAW_DIR, `${issue.key}.json`), JSON.stringify(issue, null, 2));
  }
}

for (const key of TICKETS) {
  const rawPath = path.join(RAW_DIR, `${key}.json`);
  if (!fs.existsSync(rawPath)) {
    console.warn(`Skip ${key}: missing ${rawPath}`);
    continue;
  }
  let issue;
  try {
    issue = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
  } catch (err) {
    console.warn(`Skip ${key}: invalid JSON (${err.message})`);
    continue;
  }
  fs.writeFileSync(path.join(OUT_DIR, `${key}.md`), issueToMarkdown(issue));
  written += 1;
  console.log(`Wrote docs/tickets/${key}.md`);
}

console.log(`Done: ${written}/${TICKETS.length} tickets`);
