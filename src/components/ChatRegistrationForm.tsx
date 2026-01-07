import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Mail, Lock, User, Loader2, Sparkles, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ChatRegistrationFormProps {
  onComplete: () => void;
  onClose: () => void;
}

export const ChatRegistrationForm = ({ onComplete, onClose }: ChatRegistrationFormProps) => {
  const { language } = useLanguage();
  const { signUp } = useAuth();
  const [step, setStep] = useState<'info' | 'form' | 'success'>('info');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.email || !formData.password) {
      toast.error(language === 'ka' ? 'გთხოვთ შეავსოთ ყველა ველი' : 'Please fill all fields');
      return;
    }

    if (formData.password.length < 6) {
      toast.error(language === 'ka' ? 'პაროლი უნდა იყოს მინ. 6 სიმბოლო' : 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await signUp(formData.email, formData.password, formData.fullName);
      
      if (error) {
        toast.error(error.message || (language === 'ka' ? 'რეგისტრაცია ვერ მოხერხდა' : 'Registration failed'));
        return;
      }

      setStep('success');
      toast.success(language === 'ka' ? '🎉 მოგეცათ 20₾ ვაუჩერი!' : '🎉 You got a 20₾ voucher!');
      
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (error) {
      toast.error(language === 'ka' ? 'რეგისტრაცია ვერ მოხერხდა' : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-xl p-4 border border-primary/20"
    >
      {step === 'info' && (
        <div className="space-y-4 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10 }}
            className="w-16 h-16 mx-auto bg-gradient-gold rounded-full flex items-center justify-center"
          >
            <Gift className="h-8 w-8 text-secondary-foreground" />
          </motion.div>
          
          <div>
            <h4 className="font-bold text-lg text-foreground">
              {language === 'ka' ? '🎁 მიიღეთ 20₾ ვაუჩერი!' : '🎁 Get a 20₾ Voucher!'}
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              {language === 'ka' 
                ? 'დარეგისტრირდით და მიიღეთ ფასდაკლება პირველ დაჯავშნაზე'
                : 'Register now and get a discount on your first booking'}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="flex-1 text-xs"
            >
              {language === 'ka' ? 'მოგვიანებით' : 'Later'}
            </Button>
            <Button
              size="sm"
              onClick={() => setStep('form')}
              className="flex-1 bg-gradient-gold hover:opacity-90 text-secondary-foreground text-xs gap-1"
            >
              <Sparkles className="h-3 w-3" />
              {language === 'ka' ? 'დარეგისტრირება' : 'Register Now'}
            </Button>
          </div>
        </div>
      )}

      {step === 'form' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-gradient-gold rounded-full flex items-center justify-center">
              <Gift className="h-4 w-4 text-secondary-foreground" />
            </div>
            <span className="font-semibold text-sm">
              {language === 'ka' ? 'რეგისტრაცია - 20₾ ვაუჩერი' : 'Register - 20₾ Voucher'}
            </span>
          </div>

          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={language === 'ka' ? 'სრული სახელი' : 'Full name'}
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              className="pl-9 h-9 text-sm"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder={language === 'ka' ? 'ელ-ფოსტა' : 'Email'}
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="pl-9 h-9 text-sm"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="password"
              placeholder={language === 'ka' ? 'პაროლი' : 'Password'}
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="pl-9 h-9 text-sm"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStep('info')}
              disabled={isLoading}
              className="flex-1 text-xs"
            >
              {language === 'ka' ? 'უკან' : 'Back'}
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 bg-gradient-gold hover:opacity-90 text-secondary-foreground text-xs"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                language === 'ka' ? 'დარეგისტრირება' : 'Register'
              )}
            </Button>
          </div>
        </div>
      )}

      {step === 'success' && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-3 py-2"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10, delay: 0.1 }}
            className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center"
          >
            <CheckCircle className="h-8 w-8 text-white" />
          </motion.div>
          <div>
            <h4 className="font-bold text-lg text-foreground">
              {language === 'ka' ? '🎉 გილოცავთ!' : '🎉 Congratulations!'}
            </h4>
            <p className="text-sm text-muted-foreground">
              {language === 'ka' 
                ? 'თქვენ მიიღეთ 20₾ ვაუჩერი! გამოიყენეთ კოდი: WELCOME20'
                : 'You got a 20₾ voucher! Use code: WELCOME20'}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
