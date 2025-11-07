import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, resetPassword, user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Sign In state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Sign Up state
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpFullName, setSignUpFullName] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');

  // Reset Password state
  const [resetEmail, setResetEmail] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signInEmail || !signInPassword) {
      toast.error('გთხოვთ შეავსოთ ყველა ველი');
      return;
    }

    setIsLoading(true);
    
    const { error } = await signIn(signInEmail, signInPassword);
    
    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        toast.error('არასწორი ელ.ფოსტა ან პაროლი');
      } else if (error.message.includes('Email not confirmed')) {
        toast.error('გთხოვთ დაადასტუროთ ელ.ფოსტა');
      } else {
        toast.error('შეცდომა: ' + error.message);
      }
    } else {
      toast.success('წარმატებით შეხვედით!');
    }
    
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signUpEmail || !signUpPassword || !signUpFullName || !signUpConfirmPassword) {
      toast.error('გთხოვთ შეავსოთ ყველა ველი');
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      toast.error('პაროლები არ ემთხვევა');
      return;
    }

    if (signUpPassword.length < 6) {
      toast.error('პაროლი უნდა შეიცავდეს მინიმუმ 6 სიმბოლოს');
      return;
    }

    setIsLoading(true);
    
    const { error } = await signUp(signUpEmail, signUpPassword, signUpFullName);
    
    if (error) {
      if (error.message.includes('already registered')) {
        toast.error('ეს ელ.ფოსტა უკვე რეგისტრირებულია');
      } else {
        toast.error('შეცდომა: ' + error.message);
      }
    } else {
      toast.success('რეგისტრაცია წარმატებული! გთხოვთ შეამოწმოთ ელ.ფოსტა');
      // Clear form
      setSignUpEmail('');
      setSignUpPassword('');
      setSignUpFullName('');
      setSignUpConfirmPassword('');
    }
    
    setIsLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail) {
      toast.error('გთხოვთ შეიყვანოთ ელ.ფოსტა');
      return;
    }

    setIsLoading(true);
    
    const { error } = await resetPassword(resetEmail);
    
    if (error) {
      toast.error('შეცდომა: ' + error.message);
    } else {
      toast.success('პაროლის აღდგენის ბმული გამოგზავნილია ელ.ფოსტაზე');
      setShowResetForm(false);
      setResetEmail('');
    }
    
    setIsLoading(false);
  };

  if (showResetForm) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted py-12 px-4 sm:px-6 lg:px-8">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>პაროლის აღდგენა</CardTitle>
              <CardDescription>
                შეიყვანეთ თქვენი ელ.ფოსტა და ჩვენ გამოგიგზავნით პაროლის აღდგენის ბმულს
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">ელ.ფოსტა</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="your@email.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    გაგზავნა
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowResetForm(false)}
                    disabled={isLoading}
                  >
                    გაუქმება
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>მოგესალმებით!</CardTitle>
            <CardDescription>
              შედით თქვენს ანგარიშში ან შექმენით ახალი
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">შესვლა</TabsTrigger>
                <TabsTrigger value="signup">რეგისტრაცია</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">ელ.ფოსტა</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="your@email.com"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">პაროლი</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="button" 
                    variant="link" 
                    className="px-0 text-sm"
                    onClick={() => setShowResetForm(true)}
                  >
                    დაგავიწყდათ პაროლი?
                  </Button>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    შესვლა
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">სრული სახელი</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="გიორგი გეორგიევი"
                      value={signUpFullName}
                      onChange={(e) => setSignUpFullName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">ელ.ფოსტა</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">პაროლი</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">გაიმეორეთ პაროლი</Label>
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={signUpConfirmPassword}
                      onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    რეგისტრაცია
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Auth;
