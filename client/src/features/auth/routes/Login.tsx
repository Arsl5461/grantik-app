import { useNavigate } from 'react-router-dom';

import { Layout } from '../components/Layout';
import { LoginForm } from '../components/LoginForm';

export const Login = () => {
    const navigate = useNavigate();

    return (
        <Layout title="Skráðu þig inn á þitt svæði">
            <LoginForm onSuccess={() => navigate('/app')} />
        </Layout>
    );
};
