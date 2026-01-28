import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Social login icons
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'facebook' | null>(null);
  const { signIn, signUp, signInWithGoogle, signInWithFacebook, resetPassword, user } = useAuth();
  const { t, language } = useLanguage();
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
      toast.error(t('auth.error.fillAllFields'));
      return;
    }

    setIsLoading(true);
    
    const { error } = await signIn(signInEmail, signInPassword);
    
    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        toast.error(t('auth.error.invalidCredentials'));
      } else if (error.message.includes('Email not confirmed')) {
        toast.error(t('auth.error.emailNotConfirmed'));
      } else {
        toast.error(t('auth.error.generic') + error.message);
      }
    } else {
      toast.success(t('auth.success.signIn'));
    }
    
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signUpEmail || !signUpPassword || !signUpFullName || !signUpConfirmPassword) {
      toast.error(t('auth.error.fillAllFields'));
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      toast.error(t('auth.error.passwordMismatch'));
      return;
    }

    if (signUpPassword.length < 6) {
      toast.error(t('auth.error.passwordLength'));
      return;
    }

    setIsLoading(true);
    
    const { error } = await signUp(signUpEmail, signUpPassword, signUpFullName);
    
    if (error) {
      if (error.message.includes('already registered')) {
        toast.error(t('auth.error.alreadyRegistered'));
      } else {
        toast.error(t('auth.error.generic') + error.message);
      }
    } else {
      toast.success(t('auth.success.signUp'));
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
      toast.error(t('auth.error.enterEmail'));
      return;
    }

    setIsLoading(true);

    const { error } = await resetPassword(resetEmail);

    if (error) {
      toast.error(t('auth.error.generic') + error.message);
    } else {
      toast.success(t('auth.success.resetPassword'));
      setShowResetForm(false);
      setResetEmail('');
    }

    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setSocialLoading('google');
    const { error } = await signInWithGoogle();
    if (error) {
      toast.error(language === 'ka' ? 'Google-ით შესვლა ვერ მოხერხდა' : 'Google sign in failed');
    }
    setSocialLoading(null);
  };

  const handleFacebookSignIn = async () => {
    setSocialLoading('facebook');
    const { error } = await signInWithFacebook();
    if (error) {
      toast.error(language === 'ka' ? 'Facebook-ით შესვლა ვერ მოხერხდა' : 'Facebook sign in failed');
    }
    setSocialLoading(null);
  };

  if (showResetForm) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted py-12 px-4 sm:px-6 lg:px-8">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{t('auth.resetPassword.title')}</CardTitle>
              <CardDescription>
                {t('auth.resetPassword.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">{t('auth.email')}</Label>
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
                    {t('auth.send')}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowResetForm(false)}
                    disabled={isLoading}
                  >
                    {t('auth.cancel')}
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
            <CardTitle>{t('auth.welcome')}</CardTitle>
            <CardDescription>
              {t('auth.welcomeDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">{t('auth.signIn')}</TabsTrigger>
                <TabsTrigger value="signup">{t('auth.signUp')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">{t('auth.email')}</Label>
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
                    <Label htmlFor="signin-password">{t('auth.password')}</Label>
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
                    {t('auth.forgotPassword')}
                  </Button>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('auth.signIn')}
                  </Button>

                  <div className="relative my-6">
                    <Separator />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                      {language === 'ka' ? 'ან' : 'or'}
                    </span>
                  </div>

                  <div className="grid gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleGoogleSignIn}
                      disabled={socialLoading !== null}
                    >
                      {socialLoading === 'google' ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <GoogleIcon />
                      )}
                      <span className="ml-2">
                        {language === 'ka' ? 'Google-ით შესვლა' : 'Continue with Google'}
                      </span>
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleFacebookSignIn}
                      disabled={socialLoading !== null}
                    >
                      {socialLoading === 'facebook' ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <FacebookIcon />
                      )}
                      <span className="ml-2">
                        {language === 'ka' ? 'Facebook-ით შესვლა' : 'Continue with Facebook'}
                      </span>
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">{t('auth.fullName')}</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder={t('auth.fullNamePlaceholder')}
                      value={signUpFullName}
                      onChange={(e) => setSignUpFullName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">{t('auth.email')}</Label>
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
                    <Label htmlFor="signup-password">{t('auth.password')}</Label>
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
                    <Label htmlFor="signup-confirm-password">{t('auth.confirmPassword')}</Label>
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
                    {t('auth.signUp')}
                  </Button>

                  <div className="relative my-6">
                    <Separator />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                      {language === 'ka' ? 'ან' : 'or'}
                    </span>
                  </div>

                  <div className="grid gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleGoogleSignIn}
                      disabled={socialLoading !== null}
                    >
                      {socialLoading === 'google' ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <GoogleIcon />
                      )}
                      <span className="ml-2">
                        {language === 'ka' ? 'Google-ით რეგისტრაცია' : 'Sign up with Google'}
                      </span>
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleFacebookSignIn}
                      disabled={socialLoading !== null}
                    >
                      {socialLoading === 'facebook' ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <FacebookIcon />
                      )}
                      <span className="ml-2">
                        {language === 'ka' ? 'Facebook-ით რეგისტრაცია' : 'Sign up with Facebook'}
                      </span>
                    </Button>
                  </div>
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
