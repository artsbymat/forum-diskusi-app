import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchLeaderboard } from '@/states/leaderboard/leaderboardSlice';

function getRankIcon(rank) {
  switch (rank) {
  case 1:
    return <Trophy className="w-6 h-6 text-yellow-500" />;
  case 2:
    return <Medal className="w-6 h-6 text-gray-400" />;
  case 3:
    return <Award className="w-6 h-6 text-amber-600" />;
  default:
    return (
      <span className="w-6 h-6 flex items-center justify-center text-lg font-bold text-muted-foreground">
          #{rank}
      </span>
    );
  }
}

function getRankBadgeVariant(rank) {
  switch (rank) {
  case 1:
    return 'default';
  case 2:
    return 'secondary';
  case 3:
    return 'outline';
  default:
    return 'secondary';
  }
}

export default function LeaderboardPage() {
  const { leaderboards, loading } = useSelector((state) => state.leaderboard);

  const dispatch = useDispatch();

  useEffect(() => {
    if (leaderboards.length === 0) {
      dispatch(fetchLeaderboard());
    }
  }, [dispatch, leaderboards.length]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loader mb-4"></div>
          <p className="text-lg text-muted-foreground">Memuat data leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Top 3 Podium */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6 text-center">Top 3 Kontributor</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {leaderboards.slice(0, 3).map((item, index) => {
              const rank = index + 1;
              return (
                <Card
                  key={item.id}
                  className={`text-center ${rank === 1 ? 'ring-2 ring-yellow-500' : ''}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex flex-col items-center gap-2">
                      {getRankIcon(rank)}
                      <Avatar className="w-16 h-16">
                        <AvatarImage
                          src={item.user.avatar || '/placeholder.svg'}
                          alt={item.user.name}
                        />
                        <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{item.user.name}</h3>
                        <Badge variant={getRankBadgeVariant(rank)} className="mt-1">
                          Peringkat {rank}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary mb-2">
                      {item.score.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Full Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle>Semua Kontributor</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {leaderboards.slice(3).map((item, index) => {
                const rank = index + 4;
                return (
                  <div
                    key={item.user.id}
                    className="flex items-center gap-4 p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-center w-12">
                      <span className="w-6 h-6 flex items-center justify-center text-lg font-bold text-muted-foreground">
                        #{rank}
                      </span>
                    </div>

                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={item.user.avatar || '/placeholder.svg'}
                        alt={item.user.name}
                      />
                      <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{item.user.name}</h3>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">{item.score}</div>
                      <div className="text-xs text-muted-foreground">Poin</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
