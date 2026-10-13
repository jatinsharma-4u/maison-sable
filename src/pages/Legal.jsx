import { Link } from 'react-router-dom';
import { Crumbs } from '../components/ui';
import { site } from '../data/site';
import { credits } from '../data/credits';
import { useSeo } from '../lib/seo';

// SAMPLE policy text — have these reviewed by a legal professional before launch.
const docs = {
  delivery: {
    title: 'Delivery & returns',
    intro: 'How we deliver, install and look after your made-to-order furniture.',
    body: (
      <>
        <h2>Production times</h2>
        <p>Each product page shows a typical production window (for example “6–8 weeks”). The clock starts once you approve your final drawings and the deposit is received. Your confirmed delivery week is stated in your written quote, and we will keep you updated with progress photos throughout.</p>
        <h2>Delivery & installation</h2>
        <ul>
          <li>Our own two-person team delivers every piece, carries it to the room of your choice, assembles it and removes all packaging.</li>
          <li>Delivery charges depend on location and access and are itemised in your quote.</li>
          <li>Please tell us about stairs, narrow doors or lifts in advance — large pieces can be built in sections when needed.</li>
        </ul>
        <h2>Inspecting your furniture</h2>
        <p>Please inspect each piece with our team at delivery. If anything is not right, we will note it and arrange a repair or remake.</p>
        <h2>Returns</h2>
        <p>Because each piece is made to your specification, made-to-order items cannot be returned for a change of mind. This does not affect your statutory rights. If a piece has a manufacturing defect, contact us and we will repair or replace it.</p>
        <h2>Cancellations</h2>
        <p>You can cancel free of charge before production begins. Once materials have been cut, the deposit may be retained to cover work completed — your quote sets out the exact terms.</p>
      </>
    ),
  },
  privacy: {
    title: 'Privacy policy',
    intro: 'What we collect, why, and how we protect it.',
    body: (
      <>
        <h2>Information we collect</h2>
        <p>When you submit a custom order or contact form we collect the details you provide: name, email, phone number, delivery location, project details and any reference images you upload.</p>
        <h2>How we use it</h2>
        <ul>
          <li>To prepare drawings and a quote and to discuss your project with you.</li>
          <li>To deliver and support your furniture if you place an order.</li>
          <li>To send our newsletter, only if you subscribe. You can unsubscribe at any time.</li>
        </ul>
        <h2>Stored on your device</h2>
        <p>Your saved designs, quote list, recently viewed items and form drafts are stored in your browser’s local storage so they persist between visits. They are not sent to us unless you submit a form. You can clear them by clearing your browser data.</p>
        <h2>Sharing</h2>
        <p>We never sell your data. We only share it with service providers who help us operate (for example form handling or delivery partners), under appropriate agreements.</p>
        <h2>Your rights</h2>
        <p>You can ask us to access, correct or delete your personal information by writing to <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
      </>
    ),
  },
  terms: {
    title: 'Terms of use',
    intro: 'The terms that apply when you use this website and request a quote.',
    body: (
      <>
        <h2>Prices and quotes</h2>
        <p>Prices on this website are indicative starting prices for standard dimensions and materials. They are not an offer for sale. A binding price is only given in a written quote that you accept.</p>
        <h2>Orders</h2>
        <p>An order is formed when you approve your final drawings and quote in writing and pay the agreed deposit. Specifications, delivery terms and payment schedule are those stated in your accepted quote.</p>
        <h2>Natural materials</h2>
        <p>Solid wood, leather and natural fabrics vary in grain, colour and texture. Samples and photographs are representative; these natural variations are part of the character of handmade furniture and are not defects.</p>
        <h2>Website content</h2>
        <p>Designs, text and imagery on this site may not be reproduced without permission. Photography credits are listed on our <Link to="/credits">image credits</Link> page.</p>
      </>
    ),
  },
  credits: {
    title: 'Image credits',
    intro: 'Photography on this site comes from Unsplash and is used under the Unsplash License. Product cut-outs were created by removing the background from the source photographs.',
    body: (
      <>
        <p>Each file below links to its original photograph on Unsplash.</p>
        <table className="credits">
          <thead><tr><th scope="col">Image</th><th scope="col">Source</th><th scope="col">Notes</th></tr></thead>
          <tbody>
            {credits.map(([file, slug, note]) => (
              <tr key={file}>
                <td><img src={`/img/${file}`} alt="" loading="lazy" width="48" height="48" /> <code>{file}</code></td>
                <td><a href={`https://images.unsplash.com/${slug}`} target="_blank" rel="noopener noreferrer">Unsplash · {slug.replace('photo-', '').slice(0, 13)}…</a></td>
                <td>{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    ),
  },
};

export default function Legal({ doc }) {
  const d = docs[doc];
  useSeo(d.title, d.intro);
  return (
    <>
      <section className="page-hero">
        <div className="container container--narrow">
          <Crumbs items={[{ label: 'Home', to: '/' }, { label: d.title }]} />
          <div className="page-hero__inner">
            <h1 className="h1">{d.title}</h1>
            <p className="lede">{d.intro}</p>
            {doc !== 'credits' && <p className="tiny muted">Last updated October 2026</p>}
          </div>
        </div>
      </section>
      <section className="section--tight" style={{ paddingTop: 0, paddingBottom: 'var(--section)' }}>
        <div className="container container--narrow prose">{d.body}</div>
      </section>
    </>
  );
}
