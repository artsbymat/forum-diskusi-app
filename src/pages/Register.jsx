import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useInput from '@/hooks/useInput';
import { registerUser } from '@/states/auth/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';

export default function RegisterPage() {
  const [name, onNameChange] = useInput('');
  const [email, onEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');
  const { loading } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onRegister = async ({ name, email, password }) => {
    try {
      await dispatch(registerUser({ name, email, password })).unwrap();
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
          <CardTitle className="text-2xl font-bold text-center">Daftar Akun</CardTitle>
          <CardDescription className="text-center">
            Buat akun baru untuk bergabung dalam diskusi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                type="text"
                placeholder="Masukkan nama lengkap"
                required
                value={name}
                onChange={onNameChange}
              />
            </div>
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
              onClick={() => onRegister({ name, email, password })}
            >
              {loading ? <Spinner /> : null}
              Daftar
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Masuk di sini
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
