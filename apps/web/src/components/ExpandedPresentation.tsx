"use client";

import { useState } from "react";

type PresentationDocument = { title: string; text: string };
type PresentationBlock = {
  id: string;
  number: string;
  title: string;
  description: string;
  documents: PresentationDocument[];
};

function MarkdownText({ text }: { text: string }) {
  return (
    <div className="presentation-markdown">
      {text.split(/\n\s*\n/).map((paragraph, index) => {
        const value = paragraph.trim();
        if (!value) return null;
        if (value.startsWith("### ")) return <h4 key={index}>{value.slice(4)}</h4>;
        if (value.startsWith("## ")) return <h3 key={index}>{value.slice(3)}</h3>;
        if (value.startsWith("# ")) return <h2 key={index}>{value.slice(2)}</h2>;
        if (value.split("\n").every((line) => line.startsWith("- "))) {
          return <ul key={index}>{value.split("\n").map((line) => <li key={line}>{line.slice(2)}</li>)}</ul>;
        }
        return <p key={index}>{value.split("\n").map((line, lineIndex) => <span key={lineIndex}>{line}{lineIndex < value.split("\n").length - 1 && <br />}</span>)}</p>;
      })}
    </div>
  );
}

export default function ExpandedPresentation({ blocks }: { blocks: PresentationBlock[] }) {
  const [activeId, setActiveId] = useState(blocks[0]?.id ?? "");
  const active = blocks.find((block) => block.id === activeId) ?? blocks[0];
  if (!active) return null;

  return (
    <section className="expanded-presentation" aria-label="Расширенная презентация">
      <div className="expanded-sidebar">
        <span className="section-kicker">Расширенная презентация</span>
        <h2>Пять блоков<br /><em>одной системы</em></h2>
        <p>Выбери направление, чтобы открыть его материалы.</p>
        <div className="expanded-tabs">
          {blocks.map((block) => (
            <button className={block.id === active.id ? "active" : ""} key={block.id} onClick={() => setActiveId(block.id)}>
              <span>{block.number}</span><strong>{block.title}</strong>
            </button>
          ))}
        </div>
      </div>
      <div className="expanded-content">
        <div className="unlock-badge">✦ Материалы из Енота</div>
        <span className="section-kicker">{active.number} · {active.description}</span>
        <h3>{active.title}</h3>
        {active.documents.map((document) => (
          <article className="expanded-document" key={document.title}>
            <h4>{document.title}</h4>
            <MarkdownText text={document.text} />
          </article>
        ))}
      </div>
    </section>
  );
}

export type { PresentationBlock };

export function MarkdownContent({ text }: { text: string }) {
  return <MarkdownText text={text} />;
}

export type { PresentationDocument };

export function ParticipantCommunitySection() {
  return (
    <section className="participant-community card">
      <div className="section-kicker">Демо · общественный контур</div>
      <h2>Публичный профиль участника</h2>
      <p className="community-lead">Карточка объединяет факты, источники, материалы участника и обсуждение вокруг проверяемых событий.</p>
      <div className="community-grid">
        <div><span>Статьи и материалы</span><a href="#">Отчёт о работе за 2025 год ↗</a><a href="#">Позиция по законопроекту ↗</a></div>
        <div><span>Официальные каналы</span><a href="#">Telegram · @participant_demo</a><a href="#">Сайт организации ↗</a></div>
      </div>
      <div className="discussion-preview">
        <div className="discussion-head"><strong>Обсуждение участника</strong><span>Демо-режим · 24 комментария</span></div>
        <div className="discussion-message"><b>Мария · житель округа</b><p>Добавьте, пожалуйста, источник по ремонту поликлиники.</p></div>
        <div className="discussion-message"><b>Алексей · участник сообщества</b><p>Источник добавлен. Ждём ответ представителя.</p></div>
        <div className="discussion-input">Написать комментарий… <span>→</span></div>
      </div>
    </section>
  );
}

export function ParticipantCardMeta() {
  return <div className="participant-meta-strip"><span>Тип: депутат</span><span>Статус: действующий</span><span>Полномочия: федеральный уровень</span><span>Данные: проверяются</span></div>;
}

export function ProjectAbout({ text }: { text: string }) {
  return <section className="project-about-section wrap"><div className="section-kicker">О проекте</div><h2>Народный рейтинг как основа общественного участия</h2><MarkdownText text={text} /></section>;
}
