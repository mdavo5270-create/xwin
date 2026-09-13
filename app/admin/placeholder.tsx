export function AdminEmpty({ title, note }: { title: string; note: string }) {
  return (<><h1>{title}</h1><p className="empty">{note}</p></>);
}
