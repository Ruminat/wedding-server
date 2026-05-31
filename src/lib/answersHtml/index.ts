import escapeHtml from "escape-html";
import { TWeddingAnswer } from "../../db";

type TAnswerMeta = {
  label: string;
  className: string;
};

const ANSWER_META: Record<string, TAnswerMeta> = {
  "😎": { label: "Приедет", className: "answer-good" },
  "🤔": { label: "Пока не знает", className: "answer-meh" },
  "🤡": { label: "Не получится", className: "answer-bad" },
};

function formatTimestamp(at: number) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(at));
}

function getAnswerMeta(answer: string): TAnswerMeta {
  return ANSWER_META[answer] ?? { label: answer, className: "answer-unknown" };
}

function groupAnswersByGuest(answers: TWeddingAnswer[]) {
  const grouped = new Map<string, TWeddingAnswer[]>();

  for (const entry of answers) {
    const guestAnswers = grouped.get(entry.who) ?? [];
    guestAnswers.push(entry);
    grouped.set(entry.who, guestAnswers);
  }

  for (const guestAnswers of grouped.values()) {
    guestAnswers.sort((a, b) => b.at - a.at);
  }

  return [...grouped.entries()].sort(([, aAnswers], [, bAnswers]) => bAnswers[0].at - aAnswers[0].at);
}

function renderGuestGroup(who: string, guestAnswers: TWeddingAnswer[]) {
  const guestName = escapeHtml(who);
  const rows = guestAnswers
    .map((entry) => {
      const meta = getAnswerMeta(entry.answer);

      return `
        <tr class="answer-row">
          <td class="cell-answer">
            <span class="answer-badge ${meta.className}">
              <span class="answer-emoji">${escapeHtml(entry.answer)}</span>
              <span class="answer-label">${escapeHtml(meta.label)}</span>
            </span>
          </td>
          <td class="cell-time">${escapeHtml(formatTimestamp(entry.at))}</td>
        </tr>`;
    })
    .join("");

  return `
    <tbody class="guest-group">
      <tr class="guest-header">
        <th colspan="2">${guestName}</th>
      </tr>
      ${rows}
    </tbody>`;
}

function renderEmptyState() {
  return `
    <p class="empty-state">Пока нет ни одного ответа.</p>`;
}

function renderTable(groupedAnswers: [string, TWeddingAnswer[]][]) {
  if (groupedAnswers.length === 0) {
    return renderEmptyState();
  }

  const groups = groupedAnswers.map(([who, guestAnswers]) => renderGuestGroup(who, guestAnswers)).join("");

  return `
    <div class="table-wrapper">
      <table class="answers-table">
        <thead>
          <tr>
            <th>Ответ</th>
            <th>Когда</th>
          </tr>
        </thead>
        ${groups}
      </table>
    </div>`;
}

function renderSummary(groupedAnswers: [string, TWeddingAnswer[]][]) {
  const guestCount = groupedAnswers.length;
  const responseCount = groupedAnswers.reduce((total, [, guestAnswers]) => total + guestAnswers.length, 0);

  const guestLabel = guestCount === 1 ? "гость" : guestCount < 5 ? "гостя" : "гостей";
  const responseLabel = responseCount === 1 ? "ответ" : responseCount < 5 ? "ответа" : "ответов";

  return `
    <p class="summary">
      ${guestCount} ${guestLabel} · ${responseCount} ${responseLabel}
    </p>`;
}

export function renderAnswersHtml(answers: TWeddingAnswer[]) {
  const groupedAnswers = groupAnswersByGuest(answers);
  const generatedAt = escapeHtml(
    new Intl.DateTimeFormat("ru-RU", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(new Date())
  );

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Ответы на приглашение</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:ital@0;1&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; }

    html, body {
      margin: 0;
      min-height: 100%;
      font-family: "Roboto", sans-serif;
      font-size: 16px;
      line-height: 1.5;
      color: rgb(3, 63, 99);
      background: rgb(3, 63, 99);
    }

    main {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      padding: 64px 16px;
    }

    .page {
      width: 100%;
      max-width: 720px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .hero {
      background: rgb(255, 181, 185);
      border-radius: 16px;
      padding: 48px 24px;
      text-align: center;
    }

    .hero h1 {
      margin: 0;
      font-size: 2rem;
      font-weight: bold;
    }

    .hero .summary {
      margin: 12px 0 0;
      font-size: 1.1rem;
      opacity: 0.85;
    }

    .content {
      background: rgb(204, 213, 174);
      border-radius: 16px;
      padding: 32px 20px;
    }

    .table-wrapper {
      overflow-x: auto;
    }

    .answers-table {
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
    }

    .answers-table thead th {
      padding: 0 12px 16px;
      text-align: left;
      font-size: 0.95rem;
      font-weight: bold;
      opacity: 0.75;
      border-bottom: 2px solid rgba(3, 63, 99, 0.12);
    }

    .guest-group + .guest-group .guest-header th {
      padding-top: 24px;
    }

    .guest-header th {
      padding: 20px 12px 10px;
      text-align: left;
      font-size: 1.25rem;
      font-weight: bold;
      border-bottom: 1px solid rgba(3, 63, 99, 0.1);
    }

    .answer-row td {
      padding: 10px 12px;
      vertical-align: middle;
    }

    .answer-row + .answer-row td {
      border-top: 1px dashed rgba(3, 63, 99, 0.08);
    }

    .cell-time {
      white-space: nowrap;
      font-size: 0.95rem;
      opacity: 0.8;
      text-align: right;
    }

    .answer-badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 8px 14px;
      border-radius: 12px;
      font-weight: bold;
    }

    .answer-emoji {
      font-size: 1.25rem;
      line-height: 1;
    }

    .answer-good {
      background: rgb(233, 237, 201);
    }

    .answer-meh {
      background: rgb(251, 239, 221);
      opacity: 0.95;
    }

    .answer-bad {
      background: rgb(252, 213, 206);
      opacity: 0.9;
    }

    .answer-unknown {
      background: rgb(214, 204, 194);
    }

    .empty-state {
      margin: 0;
      text-align: center;
      font-style: italic;
      opacity: 0.85;
    }

    .footer {
      text-align: center;
      font-size: 0.9rem;
      color: rgb(248, 255, 229);
      opacity: 0.75;
    }
  </style>
</head>
<body>
  <main>
    <div class="page">
      <section class="hero">
        <h1>Ответы на приглашение</h1>
        ${renderSummary(groupedAnswers)}
      </section>
      <section class="content">
        ${renderTable(groupedAnswers)}
      </section>
      <p class="footer">Обновлено ${generatedAt}</p>
    </div>
  </main>
</body>
</html>`;
}

export function renderForbiddenHtml() {
  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Доступ запрещён</title>
  <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
  <style>
    html, body {
      margin: 0;
      min-height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: "Roboto", sans-serif;
      color: rgb(248, 255, 229);
      background: rgb(3, 63, 99);
    }

    .message {
      text-align: center;
      padding: 32px;
    }

    h1 {
      margin: 0 0 8px;
      font-size: 1.5rem;
    }

    p {
      margin: 0;
      opacity: 0.8;
    }
  </style>
</head>
<body>
  <div class="message">
    <h1>Доступ запрещён</h1>
    <p>Нужен правильный secret_key в адресе.</p>
  </div>
</body>
</html>`;
}
