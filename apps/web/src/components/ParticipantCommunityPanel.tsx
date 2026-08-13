type ParticipantCommunityPanelProps = {
  participantName: string;
};

/** Материалы, официальные каналы и обсуждение конкретного участника. */
export default function ParticipantCommunityPanel({ participantName }: ParticipantCommunityPanelProps) {
  return (
    <section className="participant-page-community anim d5">
      <div className="participant-community-grid">
        <article className="card participant-media-card">
          <div className="section-kicker">Контекст</div>
          <h2>СМИ и публикации</h2>
          <div className="media-item"><span>12.08.2026 · Региональное издание</span><strong>Отчёт о работе за первое полугодие</strong><a href="#">Открыть публикацию ↗</a></div>
          <div className="media-item"><span>06.08.2026 · Официальный источник</span><strong>Позиция по общественно значимому вопросу</strong><a href="#">Открыть материал ↗</a></div>
          <button className="community-link" type="button">Все публикации →</button>
        </article>
        <article className="card participant-links-card">
          <div className="section-kicker">Связь</div>
          <h2>Официальные каналы</h2>
          <a href="#">Официальный сайт участника ↗</a><a href="#">Telegram · @participant_demo ↗</a><a href="#">Страница приёмной ↗</a>
          <div className="source-note">Источники ссылок проверены 12.08.2026</div>
        </article>
      </div>
      <article className="card participant-discussion-card">
        <div className="discussion-title-row"><div><div className="section-kicker">Обратная связь</div><h2>Общественное обсуждение</h2><p>Задавай вопросы, высказывай мнение и получай официальные ответы по деятельности {participantName}.</p></div><button className="btn" type="button">Задать вопрос</button></div>
        <div className="discussion-thread">
          <div className="discussion-message citizen-message"><div className="discussion-author"><strong>Мария · житель округа</strong><span>Вопрос · 2 дня назад</span></div><p>Почему не выполнено обещание по ремонту поликлиники? Добавьте, пожалуйста, источник и срок завершения.</p><div className="discussion-actions"><button type="button">Поддержать · 18</button><button type="button">Ответить</button><button type="button">Пожаловаться</button></div></div>
          <div className="discussion-message representative-message"><div className="discussion-author"><strong>Представитель {participantName}</strong><span className="verified-answer">✓ Официальный ответ</span></div><p>Источник добавлен в карточку. Работы находятся в процессе, обновление статуса будет опубликовано после подтверждения документов.</p><div className="discussion-actions"><button type="button">Полезно · 7</button><button type="button">Ответить</button></div></div>
          <div className="discussion-message citizen-message"><div className="discussion-author"><strong>Алексей · участник сообщества</strong><span>Комментарий · вчера</span></div><p>Как участник проголосовал по последнему законопроекту?</p><div className="discussion-actions"><button type="button">Поддержать · 9</button><button type="button">Ответить</button><button type="button">Пожаловаться</button></div></div>
        </div>
        <button className="community-link discussion-all" type="button">Открыть все обсуждения →</button>
      </article>
    </section>
  );
}

export type { ParticipantCommunityPanelProps };
