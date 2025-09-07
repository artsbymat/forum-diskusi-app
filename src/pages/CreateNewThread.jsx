import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { addThread } from '@/states/thread/threadSlice';
import useInput from '@/hooks/useInput';

export default function NewThreadPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { posting } = useSelector((state) => state.thread);

  const [title, onTitleChange, setTitle] = useInput('');
  const [category, onCategoryChange, setCategory] = useInput('');
  const [body, onBodyChange, setBody] = useInput('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(addThread({ title, category, body })).unwrap();
      toast.success('Thread berhasil dipublikasikan 🚀');

      setTitle('');
      setCategory('');
      setBody('');

      navigate('/');
    } catch (err) {
      toast.error(err || 'Gagal mempublikasikan thread');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Thread Baru</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Thread</Label>
                  <Input
                    id="title"
                    placeholder="Masukkan judul thread yang menarik..."
                    value={title}
                    onChange={onTitleChange}
                    required
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori Thread</Label>
                  <Input
                    id="category"
                    placeholder="Misal: teknologi, hobi, berita"
                    value={category}
                    onChange={onCategoryChange}
                    required
                  />
                </div>

                {/* Body */}
                <div className="space-y-2">
                  <Label htmlFor="body">Konten Thread</Label>
                  <Textarea
                    id="body"
                    placeholder="Tulis konten thread Anda di sini..."
                    value={body}
                    onChange={onBodyChange}
                    rows={8}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimal 50 karakter. Gunakan bahasa yang sopan dan konstruktif. lorem ipsum
                    dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                    labore et dolore magna aliqua.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4">
                  <Link to="/">
                    <Button variant="outline" type="button" className="cursor-pointer">
                      Batal
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={posting || !title || !category || !body || body.length < 50}
                  >
                    {posting ? 'Mempublikasikan...' : 'Publikasikan Thread'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
