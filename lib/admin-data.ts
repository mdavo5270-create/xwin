import { hasDatabase, sql } from "./db";
import { ensureSchema } from "./schema";

export async function countUsers() {
  if (!hasDatabase()) return 0;
  await ensureSchema();
  const rows = await sql()`select count(*)::int as n from users`;
  return Number(rows[0]?.n ?? 0);
}

export async function listUsers() {
  if (!hasDatabase()) return [];
  await ensureSchema();
  const rows = await sql()`select id, email, name, created_at from users order by created_at desc limit 200`;
  return rows.map((r) => ({
    id: String(r.id),
    email: String(r.email),
    name: String(r.name),
    createdAt: String(r.created_at),
  }));
}

// Dashboard Stats
export async function getDashboardStats() {
  if (!hasDatabase()) {
    return {
      totalUsers: 0,
      totalRegistrations: 0,
      dailyVisits: 0,
      topCountries: [],
      totalPronos: 0,
      clickedBuy: 0,
      completedSales: 0,
      minTimeOnSite: 0,
      avgTimeOnSite: 0,
    };
  }

  await ensureSchema();

  try {
    const users = await sql()`select count(*)::int as n from users`;
    const totalUsers = Number(users[0]?.n ?? 0);

    // Registrations = users created today
    const today = new Date().toISOString().split('T')[0];
    const registrations = await sql()`
      select count(*)::int as n from users 
      where created_at::date = ${today}::date
    `;
    const totalRegistrations = Number(registrations[0]?.n ?? 0);

    // Daily visits (approximation)
    const visits = await sql()`
      select count(*)::int as n from visits 
      where created_at::date = ${today}::date
    `.catch(() => [{ n: 0 }]);
    const dailyVisits = Number(visits[0]?.n ?? 0);

    // Top countries
    const countries = await sql()`
      select country, count(*)::int as n from users 
      where country is not null
      group by country
      order by n desc limit 5
    `.catch(() => []);
    const topCountries = countries.map((r: Record<string, unknown>) => ({
      country: String(r.country),
      count: Number(r.n),
    }));

    // Total pronos
    const pronos = await sql()`select count(*)::int as n from pronos where status != 'draft'`;
    const totalPronos = Number(pronos[0]?.n ?? 0);

    // Buy clicks
    const buyClicks = await sql()`select count(*)::int as n from orders where status = 'initiated'`;
    const clickedBuy = Number(buyClicks[0]?.n ?? 0);

    // Completed sales
    const sales = await sql()`select count(*)::int as n from orders where status = 'completed'`;
    const completedSales = Number(sales[0]?.n ?? 0);

    // Time on site stats
    const timeStats = await sql()`
      select 
        min(time_on_site)::int as min_time,
        avg(time_on_site)::int as avg_time
      from sessions where created_at::date = ${today}::date
    `.catch(() => [{ min_time: 0, avg_time: 0 }]);
    
    const minTimeOnSite = Number(timeStats[0]?.min_time ?? 0);
    const avgTimeOnSite = Number(timeStats[0]?.avg_time ?? 0);

    return {
      totalUsers,
      totalRegistrations,
      dailyVisits,
      topCountries,
      totalPronos,
      clickedBuy,
      completedSales,
      minTimeOnSite,
      avgTimeOnSite,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalUsers: 0,
      totalRegistrations: 0,
      dailyVisits: 0,
      topCountries: [],
      totalPronos: 0,
      clickedBuy: 0,
      completedSales: 0,
      minTimeOnSite: 0,
      avgTimeOnSite: 0,
    };
  }
}
