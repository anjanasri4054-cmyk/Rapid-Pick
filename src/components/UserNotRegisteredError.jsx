import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

export default function UserNotRegisteredError() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="max-w-md w-full text-center">
                <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mb-6">
                    <UserPlus className="w-8 h-8 text-amber-600" />
                </div>

                <h1 className="text-2xl font-bold mb-2">Account Not Found</h1>
                <p className="text-muted-foreground mb-8">
                    We couldn't find your account. Please register first to continue.
                </p>

                <div className="space-y-3">
                    <Link to="/user/signup">
                        <Button className="w-full h-12 rounded-2xl text-base">
                            Create New Account
                        </Button>
                    </Link>

                    <Link to="/">
                        <Button variant="outline" className="w-full h-12 rounded-2xl">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Home
                        </Button>
                    </Link>
                </div>

                <p className="text-xs text-muted-foreground mt-8">
                    Need help? Contact support@canteengo.com
                </p>
            </div>
        </div>
    );
}