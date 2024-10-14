import { createClient } from "@/utils/supabase/server";
import { RankingList } from "@/components/ranking-list";
export default async function RankingPage() {
  const supabase = createClient();

  const { data: players, error } = await supabase
    .from("user")
    .select("*")
    .order("rating", { ascending: false });
  return <RankingList players={players!} />;
}
