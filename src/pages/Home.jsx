import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, MessageCircle, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchThreadsAndUsers } from '@/states/thread/threadSlice';
import { ThreadCard } from '@/components/ThreadCard';
import { LoadingThreadCard } from '@/components/LoadingThreadCard';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const dispatch = useDispatch();
  const { threads, loading: loadingThread } = useSelector((state) => state.thread);

  const { user } = useSelector((state) => state.auth);

  const categoryNames = [
    { id: 'all', hashtag: '#Semua' },
    ...Array.from(new Set(threads.map((thread) => thread.category))).map((cat) => ({
      id: cat,
      hashtag: `#${cat}`
    }))
  ];

  const filteredThreads =
    activeCategory === 'all'
      ? threads
      : threads.filter((thread) => thread.category === activeCategory);

  useEffect(() => {
    if (threads.length === 0) {
      dispatch(fetchThreadsAndUsers());
    }
  }, [dispatch, threads.length]);

  return (
    <div className="min-h-screen bg-background">
      {/* Thread Actions */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">Berbagi ide dan pemikiran bersama komunitas</p>
            </div>
            {user && (
              <Button asChild>
                <Link to="/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Buat Thread
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          {!loadingThread ? (
            <div className="flex flex-wrap gap-2">
              {categoryNames.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveCategory(category.id)}
                  className="text-sm cursor-pointer"
                >
                  {category.hashtag}
                </Button>
              ))}
            </div>
          ) : (
            <Button variant="outline" size="sm" className="text-sm cursor-pointer">
              Memuat...
            </Button>
          )}
        </div>
      </div>

      {/* Thread List */}
      <main className="container mx-auto px-4 py-6">
        {!loadingThread ? (
          <div className="space-y-4">
            {filteredThreads.map((thread) => (
              <ThreadCard key={thread.id} thread={thread} />
            ))}
          </div>
        ) : (
          <LoadingThreadCard />
        )}
      </main>
    </div>
  );
}
