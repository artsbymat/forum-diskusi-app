import { downVoteThread, neutralizeThreadVote, upVoteThread } from '@/states/thread/threadSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { formatTimeAgo } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowDown, ArrowUp, MessageCircle } from 'lucide-react';
import { Badge } from './ui/badge';
import parser from 'html-react-parser';
import { toast } from 'sonner';

export function ThreadCard({ thread }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const hasUpVoted = thread.upVotesBy.includes(user?.id);
  const hasDownVoted = thread.downVotesBy.includes(user?.id);

  const handleUpVote = () => {
    if (!user) return toast.error('Silakan login terlebih dahulu untuk memberikan suara.');
    if (hasUpVoted) {
      dispatch(neutralizeThreadVote(thread.id));
    } else {
      dispatch(upVoteThread(thread.id));
    }
  };

  const handleDownVote = () => {
    if (!user) return toast.error('Silakan login terlebih dahulu untuk memberikan suara.');
    if (hasDownVoted) {
      dispatch(neutralizeThreadVote(thread.id));
    } else {
      dispatch(downVoteThread(thread.id));
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={thread.creator.avatar || '/placeholder.svg'}
              alt={thread.creator.name}
            />
            <AvatarFallback>{thread.creator.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">{thread.creator.name}</span>
              <span className="text-muted-foreground text-xs">•</span>
              <span className="text-muted-foreground text-xs">
                {formatTimeAgo(thread.createdAt)}
              </span>
            </div>
            <Link to={`/threads/${thread.id}`} className="block">
              <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2">
                {thread.title}
              </h3>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Link to={`/threads/${thread.id}`} className="block mb-4">
          <div className="text-muted-foreground line-clamp-3 text-sm">{parser(thread.body)}</div>
        </Link>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Button
                aria-label="Upvote"
                variant={hasUpVoted ? 'default' : 'ghost'}
                size="sm"
                className="h-8 px-2 gap-1 cursor-pointer"
                onClick={handleUpVote}
              >
                <ArrowUp className="w-4 h-4" />
                <span className="text-sm">{thread.upVotesBy.length}</span>
              </Button>
              <Button
                aria-label="Downvote"
                variant={hasDownVoted ? 'destructive' : 'ghost'}
                size="sm"
                className="h-8 px-2 gap-1 cursor-pointer"
                onClick={handleDownVote}
              >
                <ArrowDown className="w-4 h-4" />
                <span className="text-sm">{thread.downVotesBy.length}</span>
              </Button>
            </div>

            {/* Comments */}
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{thread.totalComments}</span>
            </div>
          </div>

          <Badge variant="secondary" className="text-xs">
            #{thread.category}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
