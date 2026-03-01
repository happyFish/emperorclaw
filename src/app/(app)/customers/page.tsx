import { db } from "@/db";
import { customers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCompanyId } from "@/lib/auth";
import { redirect } from "next/navigation";
import CustomersClient from "./customers-client";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
    const companyId = await getCompanyId();
    if (!companyId) redirect("/login");

    const allCustomers = await db.select().from(customers).where(eq(customers.companyId, companyId));

    return <CustomersClient initialData={allCustomers} />;
}
