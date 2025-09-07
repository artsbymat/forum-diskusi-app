import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { ArrowUp, ArrowDown, Send } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { formatTimeAgo } from '@/lib/utils';
import parser from 'html-react-parser';
import { LoadingThreadCard } from '@/components/LoadingThreadCard';
import useInput from '@/hooks/useInput';
import { toast } from 'sonner';
import NotFoundPage from './NotFound';
import {
  upVoteComment,
  downVoteComment,
  neutralizeCommentVote,
  fetchThreadDetail,
  clearThreadDetail,
  addThreadComment
} from '@/states/threadDetail/threadDetailSlice';
import { upVoteThread, downVoteThread, neutralizeThreadVote } from '@/states/thread/threadSlice';

export default function ThreadDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { thread, loading, uploading, error } = useSelector((state) => state.threadDetail);

  const hasUpVoted = thread?.upVotesBy.includes(user?.id);
  const hasDownVoted = thread?.downVotesBy.includes(user?.id);

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

  const [comment, onCommentChange, setComment] = useInput('');

  const handleUpVoteComment = (comment) => {
    if (!user) return toast.error('Silakan login untuk vote.');
    const hasUpVoted = comment.upVotesBy.includes(user.id);
    if (hasUpVoted) {
      dispatch(neutralizeCommentVote({ threadId: thread.id, commentId: comment.id }));
    } else {
      dispatch(upVoteComment({ threadId: thread.id, commentId: comment.id }));
    }
  };

  const handleDownVoteComment = (comment) => {
    if (!user) return toast.error('Silakan login untuk vote.');
    const hasDownVoted = comment.downVotesBy.includes(user.id);
    if (hasDownVoted) {
      dispatch(neutralizeCommentVote({ threadId: thread.id, commentId: comment.id }));
    } else {
      dispatch(downVoteComment({ threadId: thread.id, commentId: comment.id }));
    }
  };

  useEffect(() => {
    dispatch(fetchThreadDetail(id));
    return () => dispatch(clearThreadDetail());
  }, [dispatch, id]);

  const handleAddComment = async () => {
    if (!comment.trim()) {
      toast.error('Komentar tidak boleh kosong');
      return;
    }

    try {
      await dispatch(addThreadComment({ threadId: id, content: comment })).unwrap();
      setComment('');
      toast.success('Komentar berhasil ditambahkan');
    } catch (error) {
      toast.error(error || 'Gagal menambahkan komentar');
    }
  };

  if (loading) return <LoadingThreadCard />;
  if (error) return <NotFoundPage />;

  console.log(thread);

  if (!thread) return null;
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Thread Detail */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage
                  src={thread.owner.avatar || '/placeholder.svg'}
                  alt={thread.owner.name}
                />
                <AvatarFallback>{thread.owner.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{thread.owner.name}</span>
                  <span className="text-muted-foreground text-sm">•</span>
                  <span className="text-muted-foreground text-sm">
                    {formatTimeAgo(thread.createdAt)}
                  </span>
                </div>
                <h1 className="text-2xl font-bold mb-4">{thread.title}</h1>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none mb-6">
              <div className="text-foreground leading-relaxed whitespace-pre-line">
                {parser(thread.body)}
              </div>
            </div>

            {/* Thread Actions */}
            <div className="flex items-center gap-4 pt-4 border-t">
              <div className="flex items-center gap-1">
                <Button
                  variant={hasUpVoted ? 'default' : 'ghost'}
                  size="sm"
                  className="h-8 px-2 gap-1 cursor-pointer"
                  onClick={handleUpVote}
                >
                  <ArrowUp className="w-4 h-4" />
                  <span className="text-sm">{thread.upVotesBy.length}</span>
                </Button>
                <Button
                  variant={hasDownVoted ? 'destructive' : 'ghost'}
                  size="sm"
                  className="h-8 px-2 gap-1 cursor-pointer"
                  onClick={handleDownVote}
                >
                  <ArrowDown className="w-4 h-4" />
                  <span className="text-sm">{thread.downVotesBy.length}</span>
                </Button>
              </div>
              <span className="text-muted-foreground text-sm">
                {thread.comments.length} komentar
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Comment Form */}
        {user && (
          <Card className="mb-6">
            <CardHeader>
              <h3 className="font-semibold">Tambah Komentar</h3>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddComment();
                }}
              >
                <Textarea
                  placeholder="Tulis komentar Anda..."
                  className="min-h-[100px] resize-none"
                  value={comment}
                  onChange={onCommentChange}
                  disabled={uploading}
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={uploading} className="cursor-pointer">
                    <Send className="w-4 h-4 mr-2" />
                    {uploading ? 'Mengirim...' : 'Kirim Komentar'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Komentar ({thread.comments.length})</h3>

          {thread.comments.map((comment, index) => (
            <div key={comment.id}>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={comment.owner.avatar || '/placeholder.svg'}
                        alt={comment.owner.name}
                      />
                      <AvatarFallback>{comment.owner.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-sm">{comment.owner.name}</span>
                        <span className="text-muted-foreground text-xs">•</span>
                        <span className="text-muted-foreground text-xs">
                          {formatTimeAgo(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed mb-3">{parser(comment.content)}</p>

                      {/* Comment Actions */}
                      <div className="flex items-center gap-1">
                        <Button
                          variant={comment.upVotesBy.includes(user?.id) ? 'default' : 'ghost'}
                          size="sm"
                          className="h-7 px-2 gap-1 cursor-pointer"
                          onClick={() => handleUpVoteComment(comment)}
                        >
                          <ArrowUp className="w-3 h-3" />
                          <span className="text-xs">{comment.upVotesBy.length}</span>
                        </Button>
                        <Button
                          variant={comment.downVotesBy.includes(user?.id) ? 'destructive' : 'ghost'}
                          size="sm"
                          className="h-7 px-2 gap-1 cursor-pointer"
                          onClick={() => handleDownVoteComment(comment)}
                        >
                          <ArrowDown className="w-3 h-3" />
                          <span className="text-xs">{comment.downVotesBy.length}</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {index < thread.comments.length - 1 && <Separator className="my-4" />}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
