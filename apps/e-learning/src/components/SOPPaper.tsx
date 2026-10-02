/** Three separate paper sheets. Copy stays live text, never a raster texture. */
export function SOPPaper() {
  return <div className="sop-paper-stack">
    <div className="sop-under-sheet sop-under-sheet--third" aria-hidden="true"/>
    <div className="sop-under-sheet sop-under-sheet--second" aria-hidden="true"/>
    <article className="sop-document sop-simple sop-readable" aria-label="SOP: Team communication">
      <div className="sop-mast"><span>STANDARD OPERATING PROCEDURE</span></div>
      <div className="sop-rule"/>
      <span className="sop-title">SOP</span>
      <h3>Team communication</h3>
      <p className="sop-summary">A guide to clearer conversations and agreed next steps.</p>
      <ol className="sop-steps">
        <li><span>01</span><span>Prepare the conversation.</span></li>
        <li><span>02</span><span>Listen to each perspective.</span></li>
        <li><span>03</span><span>Agree the next step.</span></li>
      </ol>
      <footer><span>PROCESS GUIDE</span><span>01 / 03</span></footer>
    </article>
  </div>;
}
