export function TypographyH1(text: string) {
  return (
    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      {text}
    </h1>
  );
}
export function TypographyH2({ text }: { text: string }) {
  return (
    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 dark:border-b-white">
      {text}
    </h2>
  );
}
export function TypographyH3(text: string) {
  return (
    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
      {text}
    </h3>
  );
}
export function TypographyH4({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
      {children}
    </h4>
  );
}
export function TypographyBlockquote(text: string) {
  return (
    <blockquote className="mt-6 border-l-2 pl-6 italic">{text}</blockquote>
  );
}
export function TypographyList(text: string[]) {
  return (
    <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
      {text.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
export function TypographyInlineCode(text: string) {
  return (
    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
      {text}
    </code>
  );
}
export function TypographyLead(text: string) {
  return <p className="text-xl text-muted-foreground">{text}</p>;
}
export function TypographyLarge(text: string) {
  return <div className="text-lg font-semibold">{text}</div>;
}
export function TypographySmall(text: string) {
  return <small className="text-sm font-medium leading-none">{text}</small>;
}
export function TypographyMuted(text: string) {
  return <p className="text-sm text-muted-foreground">{text}</p>;
}
