import { For } from 'solid-js';
import { GITHUB, HANDLE, LINKEDIN } from '../constants/site';
import { downloadCv } from '../utils/actions';
import { fmt } from '../utils/format';
import { readout } from '../utils/session';

const LINES = [
  { label: 'time on page', value: () => readout.time },
  { label: 'frames rendered', value: () => fmt(readout.frames) },
  { label: 'frames dropped', value: () => fmt(readout.dropped) },
  { label: 'average fps', value: () => readout.average },
  { label: 'slowest frame', value: () => readout.slowest },
  { label: 'peak glyphs', value: () => fmt(readout.peak) },
  { label: 'glyph updates', value: () => fmt(readout.updates) },
  { label: 'react renders, naive', value: () => fmt(readout.naive) },
  { label: 'react renders, selected', value: () => fmt(readout.selected) },
  { label: 'distance scrolled', value: () => `${fmt(readout.scrolled)} px` },
];

const Contact = () => (
  <section class="act wrap" id="contact" aria-labelledby="contact-h">
    <p class="slot" id="s4">
      Say hi.
    </p>
    <div class="fin">
      <div>
        <h2 id="contact-h">
          One conversation is enough to know if I can help.
        </h2>
        <p class="body">
          Bring a trace, a repo or a symptom. Your receipt for this visit is
          still printing.
        </p>
        <div class="links">
          <a class="btn" href={LINKEDIN} rel="me">
            Message on LinkedIn
          </a>
          <a href={GITHUB} rel="me">
            github.com/{HANDLE}
          </a>
          <button class="cv" type="button" onClick={downloadCv}>
            Download CV (PDF)
          </button>
        </div>
      </div>
      <div class="receipt" role="group" aria-label="Session receipt">
        <h3>ARTHUR GERON</h3>
        <p>frontend, rendered to order</p>
        <hr />
        <For each={LINES}>
          {(line) => (
            <div class="r">
              <span>{line.label}</span>
              <i />
              <b>{line.value()}</b>
            </div>
          )}
        </For>
        <hr />
        <div class="r">
          <span>TOTAL DUE</span>
          <i />
          <b>1 conversation</b>
        </div>
        <hr />
        <p>thank you for your GPU time</p>
      </div>
    </div>
  </section>
);

export default Contact;
