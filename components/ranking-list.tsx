import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { Player } from "@/types/player";

type PlayersListProps = {
  players: Player[];
};

export function RankingList({ players }: PlayersListProps) {
  return (
    <>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="pt-4 pb-2">
          <CardTitle className="text-2xl font-bold text-yellow-400 text-center">
            Ranking
            <hr />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Index</TableHead>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {players.map((player, i) => (
                <TableRow key={player.id}>
                  <TableCell>{i + 1}</TableCell>

                  <TableCell className="font-medium">
                    <a
                      href={`/player/${player.id}`}
                      className="hover:underline"
                    >
                      {player.name} {player.lastname}
                    </a>
                  </TableCell>
                  <TableCell>{player.category}</TableCell>
                  <TableCell>{player.rating}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
