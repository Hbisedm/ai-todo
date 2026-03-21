export function ProductPreview() {
  return (
    <section className="product-preview">
      <div>
        <p className="eyebrow">Task dashboard preview</p>
        <h2>Built to feel like a real product, not a mockup.</h2>
        <p>
          The app area combines overview metrics, focused task cards, and quick status updates so the product reads well in both demos and screenshots.
        </p>
      </div>
      <div className="preview-panel">
        <div className="preview-panel__stats">
          <div><strong>24</strong><span>Total tasks</span></div>
          <div><strong>8</strong><span>Completed</span></div>
          <div><strong>3</strong><span>Overdue</span></div>
        </div>
        <div className="preview-panel__list">
          <div className="preview-line"><strong>Prepare launch notes</strong><span>Today</span></div>
          <div className="preview-line"><strong>Polish register page</strong><span>Tomorrow</span></div>
          <div className="preview-line"><strong>Refine empty state</strong><span>Done</span></div>
        </div>
      </div>
    </section>
  );
}
