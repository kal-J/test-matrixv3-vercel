import React, { useState, ReactNode, ButtonHTMLAttributes, InputHTMLAttributes } from 'react';
import axios from 'axios';

// Type definitions
interface BaseProps {
  className?: string;
  children: ReactNode;
}

interface DialogProps extends BaseProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface LabelProps {
  htmlFor: string;
  children: ReactNode;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

interface LoginResponse {
  [key: string]: any;
}

// Card Components
const Card: React.FC<BaseProps> = ({ className = '', children }) => (
  <div className={`bg-white rounded-lg shadow-lg ${className}`}>
    {children}
  </div>
);

const CardHeader: React.FC<BaseProps> = ({ children }) => (
  <div className="px-6 py-4 border-b border-gray-200">
    {children}
  </div>
);

const CardTitle: React.FC<BaseProps> = ({ children }) => (
  <h2 className="text-xl font-semibold text-gray-900">
    {children}
  </h2>
);

const CardDescription: React.FC<BaseProps> = ({ children }) => (
  <p className="mt-1 text-sm text-gray-600">
    {children}
  </p>
);

const CardContent: React.FC<BaseProps> = ({ children }) => (
  <div className="px-6 py-4">
    {children}
  </div>
);

// Dialog Components
const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50 w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
        {children}
      </div>
    </div>
  );
};

const DialogContent: React.FC<BaseProps> = ({ children }) => (
  <div className="relative">
    {children}
  </div>
);

const DialogHeader: React.FC<BaseProps> = ({ children }) => (
  <div className="mb-4">
    {children}
  </div>
);

const DialogTitle: React.FC<BaseProps> = ({ children }) => (
  <h3 className="text-lg font-semibold text-gray-900">
    {children}
  </h3>
);

// Input Components
const Input: React.FC<InputProps> = ({ className = '', ...props }) => (
  <input
    className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
    ${className}`}
    {...props}
  />
);

const Label: React.FC<LabelProps> = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
    {children}
  </label>
);

const Button: React.FC<ButtonProps> = ({ className = '', disabled, children, ...props }) => (
  <button
    className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md 
    hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
    focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
);

// Main Login Form Component
const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [responseData, setResponseData] = useState<LoginResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('37.60.249.24:8195/api/users/login', {
        username: email,
        password
      }, {
        //withCredentials: false
      });
      console.log(response.data);
      console.log(response);
      setResponseData(response.data);
      setShowModal(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Login failed. Please try again.');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Successful</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-auto max-h-96">
              {JSON.stringify(responseData, null, 2)}
            </pre>
          </div>
          <Button 
            onClick={() => setShowModal(false)}
            className="mt-4"
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoginForm;