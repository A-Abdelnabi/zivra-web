import { getMenu } from "@/lib/data/menu"

export async function GET() {
    const menu = getMenu()
    return Response.json(menu)
}
