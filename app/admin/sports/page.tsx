import { SPORTS } from "@/lib/sports";
export default function Page() {
  return (<><h1>Sports</h1><div className="grid">{SPORTS.map((s) => <div className="card" key={s.slug}>{s.label}</div>)}</div></>);
}
