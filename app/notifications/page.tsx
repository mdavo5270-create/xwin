import { TopBar } from "@/components/Nav";

export default function NotificationsPage() {
  return (
    <>
      <TopBar title="Notifications" back="/compte" />
      <main className="wrap">
        <p className="empty">Pas de notification. Elles apparaîtront quand un prono ou une montante sera publié pour toi.</p>
      </main>
    </>
  );
}
