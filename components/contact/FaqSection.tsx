import type { Faq } from '@/lib/schemas/contact';

export function FaqSection({ faqs }: { faqs: Faq[] }) {
  return <section id="faq" className="mt-24 border-t border-line pt-12"><div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]"><div><p className="text-sm font-black uppercase tracking-[0.2em] text-moss">FAQ</p><h2 className="mt-4 text-5xl font-black leading-[0.88] tracking-[-0.08em]">Quick answers.</h2></div><div className="divide-y divide-line">{faqs.map((faq) => <details key={faq.question} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-bold"><span>{faq.question}</span><span className="text-2xl font-normal transition-transform group-open:rotate-45">+</span></summary><p className="max-w-2xl pt-4 leading-7 text-ink/65">{faq.answer}</p></details>)}</div></div></section>;
}
