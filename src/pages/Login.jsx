import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useInput from '@/hooks/useInput';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '@/states/auth/authSlice';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, onEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');
  const { loading } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogin = async ({ email, password }) => {
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Masuk</CardTitle>
          <CardDescription className="text-center">
            Masuk ke akun Anda untuk melanjutkan diskusi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                required
                value={email}
                onChange={onEmailChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan password"
                required
                value={password}
                onChange={onPasswordChange}
              />
            </div>
            <Button
              type="button"
              className="w-full cursor-pointer"
              disabled={loading}
              onClick={() => onLogin({ email, password })}
            >
              {loading ? <Spinner /> : null}
              Masuk
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Belum punya akun?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Daftar di sini
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
