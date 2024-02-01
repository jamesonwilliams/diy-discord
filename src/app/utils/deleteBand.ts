import { sql } from "@vercel/postgres";

export default async function deleteBand(name: string): Promise<boolean> {
    const result = await sql`DELETE FROM Bands WHERE name = ${name}`;
    return result.rowCount === 1;
}
