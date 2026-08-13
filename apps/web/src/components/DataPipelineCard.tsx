/** Технический контур данных: источники, проверки, модерация и история изменений. */
export default function DataPipelineCard() {
  const steps = [
    ["01", "Источники", "Официальные реестры, декларации и публикации"],
    ["02", "Проверка", "Сопоставление данных и фиксация подтверждений"],
    ["03", "Модерация", "Разбор спорных случаев перед публикацией"],
    ["04", "История", "Версии записи, автор изменения и дата"],
  ];

  return (
    <section className="data-pipeline card card-dark anim d3">
      <div className="pipeline-heading">
        <div><span className="section-kicker">Технический контур</span><h2>Данные не просто загружаются — они проходят путь проверки</h2></div>
        <span className="pipeline-status"><i /> Контур подготовлен</span>
      </div>
      <p className="pipeline-lead">Парсинг отделён от публичного интерфейса: каждый факт получает источник, статус проверки и запись в истории изменений.</p>
      <div className="pipeline-steps">
        {steps.map(([number, title, text], index) => <div className="pipeline-step" key={number}><span>{number}</span><div><strong>{title}</strong><small>{text}</small></div>{index < steps.length - 1 && <b className="pipeline-arrow">→</b>}</div>)}
      </div>
    </section>
  );
}
